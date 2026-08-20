/* ============================================================
   /api/ask — "Ask Adamawa", now backed by a real model instead of
   the old offline keyword matcher.

   Grounded in assets/data.js (required directly — the same file the
   browser loads as window.__ADAMAWA_DATA__), so every fact this site
   has individually verified stays authoritative, while general
   questions outside that curated set (climate, notable people,
   universities, cuisine, sport...) draw on the model's own broad
   knowledge instead of hitting a hard "I don't know that" wall.

   Runs through the Vercel AI Gateway — on a Vercel deployment this
   authenticates automatically via OIDC, no API key to manage.
   ============================================================ */

const { streamText, toTextStream, pipeTextStreamToResponse } = require('ai');
const DATA = require('../assets/data.js');

const MODEL = 'anthropic/claude-sonnet-5';
const MAX_HISTORY = 12;
const MAX_MSG_LEN = 2000;

function buildContext(D) {
  var lines = [];

  var facts = D.facts || {};
  var factLines = Object.keys(facts).map(function (k) {
    var f = facts[k];
    return f && f.v ? '- ' + k + ': ' + f.v + (f.src ? ' (source: ' + f.src + ')' : '') : null;
  }).filter(Boolean);
  if (factLines.length) lines.push('STATE FACTS:\n' + factLines.join('\n'));

  if (D.governor) {
    lines.push('CURRENT GOVERNOR: ' + D.governor.name + ' — ' + (D.governor.title || '') + '\n' + (D.governor.bio || ''));
  }

  if (D.achievements && D.achievements.length) {
    lines.push('CURRENT GOVERNOR\'S DOCUMENTED ACHIEVEMENTS IN OFFICE:\n' +
      D.achievements.map(function (a) { return '- ' + a.title + ': ' + a.body; }).join('\n'));
  }

  if (D.governors && D.governors.length) {
    lines.push('ALL GOVERNORS / MILITARY ADMINISTRATORS SINCE 1991 (most recent first):\n' +
      D.governors.map(function (g) {
        return '- ' + g.name + ' (' + (g.term || '') + (g.party ? ', ' + g.party : '') + ')' + (g.note ? ': ' + g.note : '');
      }).join('\n'));
  }

  if (D.eras && D.eras.length) {
    lines.push('HISTORICAL TIMELINE:\n' +
      D.eras.map(function (e) { return '- ' + e.when + ' — ' + e.title + ': ' + e.body; }).join('\n'));
  }

  if (D.lgas && D.lgas.length) {
    lines.push('ALL 21 LOCAL GOVERNMENT AREAS (zone, headquarters, documented languages/ethnic groups, notes):\n' +
      D.lgas.map(function (l) {
        return '- ' + l.name + ' | zone: ' + l.zone + ' | HQ: ' + l.hq +
          (l.languages && l.languages.length ? ' | languages/groups: ' + l.languages.join(', ') : '') +
          (l.note ? ' | note: ' + l.note : '');
      }).join('\n'));
  }

  if (D.minerals && D.minerals.length) {
    lines.push('MINERAL RESOURCES:\n' + D.minerals.map(function (m) { return '- ' + m.name + ' (' + m.where + '): ' + m.note; }).join('\n'));
  }

  if (D.landmarks && D.landmarks.length) {
    lines.push('LANDMARKS & CULTURAL SITES:\n' +
      D.landmarks.map(function (l) { return '- ' + l.name + ' (' + (l.lga || 'location not published') + '): ' + l.note; }).join('\n'));
  }

  if (D.yola) lines.push('State capital Yola’s coordinates: ' + D.yola.lat + ', ' + D.yola.lng);

  return lines.join('\n\n');
}

const SYSTEM_PROMPT = [
  'You are "Ask Adamawa", a knowledgeable, friendly assistant embedded in a website about Adamawa State, Nigeria.',
  '',
  'For anything covered in the CURATED SITE DATA below, treat it as the authoritative, fact-checked source and prefer it over your own memory — it has been individually verified and sourced by the people who built this site. For everything else about Adamawa State (geography, climate, economy, agriculture, education, notable people, festivals, cuisine, sport, transport, neighbouring states, and so on), answer from your own general knowledge as accurately as you can, and say plainly if you are not fully certain of a specific figure rather than inventing one.',
  '',
  'If asked about very recent news or current events, say you may not have the latest information and point the person to this site’s News page, which shows live headlines — do not guess at recent events.',
  '',
  'Keep answers conversational and reasonably concise — a few sentences to a short paragraph — since this appears in a chat widget, unless the person clearly wants more depth. Write in plain prose with no markdown formatting (no headers, bold, or bullet lists), since the widget displays plain text. Stay neutral and factual on political topics such as party affiliation. If a question has nothing to do with Adamawa State or Nigeria, say so politely and steer the conversation back.',
  '',
  'CURATED SITE DATA:',
  buildContext(DATA)
].join('\n');

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null;
  var out = [];
  for (var i = 0; i < input.length; i++) {
    var m = input[i];
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    var content = typeof m.content === 'string' ? m.content.slice(0, MAX_MSG_LEN).trim() : '';
    if (!content) continue;
    out.push({ role: m.role, content: content });
  }
  return out.length ? out.slice(-MAX_HISTORY) : null;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { /* fall through */ }
  }
  return new Promise(function (resolve) {
    var raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve({}); } });
    req.on('error', function () { resolve({}); });
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  var body = await readJsonBody(req);
  var messages = sanitizeMessages(body && body.messages);
  if (!messages) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'messages must be a non-empty array of { role, content }' }));
    return;
  }

  try {
    var result = streamText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      messages: messages,
      maxOutputTokens: 500,
      temperature: 0.4,
      onError: function (e) { console.error('/api/ask streamText error:', e); }
    });

    res.setHeader('Cache-Control', 'no-store');
    await pipeTextStreamToResponse({ response: res, stream: toTextStream({ stream: result.stream }) });
  } catch (err) {
    console.error('/api/ask fatal error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'The assistant is temporarily unavailable.' }));
    } else {
      res.end();
    }
  }
};
