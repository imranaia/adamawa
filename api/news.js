/* ============================================================
   /api/news — server-side proxy + parser for live Adamawa State
   news headlines, pulled from Google News' public RSS search feed.

   This has to run server-side: the feed sends no CORS header, so a
   browser can't fetch it directly, and running it here also lets the
   response be cached at the edge instead of hitting Google on every
   page view. Parsed with plain regex rather than an XML library —
   this is a static site with no build step / npm dependencies, and
   Google's feed shape is simple and stable enough that a small,
   defensive parser is the pragmatic choice.
   ============================================================ */

const FEED_URL = 'https://news.google.com/rss/search?q=' +
  encodeURIComponent('Adamawa State Nigeria') + '&hl=en-NG&gl=NG&ceid=NG:en';

const MAX_ITEMS = 30;
const FETCH_TIMEOUT_MS = 8000;

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(parseInt(n, 10)); })
    .replace(/&amp;/g, '&')
    .trim();
}

function stripTags(s) {
  return decodeEntities((s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')).trim();
}

function parseItems(xml) {
  var items = [];
  var itemRe = /<item>([\s\S]*?)<\/item>/g;
  var m;
  while ((m = itemRe.exec(xml)) && items.length < MAX_ITEMS * 2) {
    var block = m[1];
    var titleM = /<title>([\s\S]*?)<\/title>/.exec(block);
    var linkM = /<link>([\s\S]*?)<\/link>/.exec(block);
    var pubM = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(block);
    var srcM = /<source url="([^"]*)">([\s\S]*?)<\/source>/.exec(block);

    var rawTitle = stripTags(titleM ? titleM[1] : '');
    var link = decodeEntities(linkM ? linkM[1] : '').trim();
    var pubDate = pubM ? pubM[1].trim() : '';
    var sourceName = srcM ? stripTags(srcM[2]) : '';
    var sourceUrl = srcM ? decodeEntities(srcM[1]) : '';

    var title = rawTitle;
    if (sourceName && title.slice(-sourceName.length) === sourceName) {
      title = title.slice(0, title.length - sourceName.length).replace(/\s*-\s*$/, '').trim();
    }
    if (!title || !link) continue;

    var publishedAt = null;
    if (pubDate) {
      var d = new Date(pubDate);
      if (!isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({ title: title, link: link, source: sourceName || null, sourceUrl: sourceUrl || null, publishedAt: publishedAt });
  }
  items.sort(function (a, b) {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });
  return items.slice(0, MAX_ITEMS);
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=1800, stale-while-revalidate=3600');

  var controller = new AbortController();
  var timeout = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS);

  try {
    var r = await fetch(FEED_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdamawaStateSite/1.0; +https://adamawastate.gov.ng)' }
    });
    clearTimeout(timeout);

    if (!r.ok) {
      res.statusCode = 502;
      res.end(JSON.stringify({ ok: false, error: 'Upstream feed returned ' + r.status }));
      return;
    }

    var xml = await r.text();
    var items = parseItems(xml);

    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      fetchedAt: new Date().toISOString(),
      count: items.length,
      source: 'Google News (RSS search: "Adamawa State Nigeria")',
      items: items
    }));
  } catch (err) {
    clearTimeout(timeout);
    res.statusCode = 504;
    res.end(JSON.stringify({ ok: false, error: err && err.name === 'AbortError' ? 'Upstream feed timed out' : 'Could not reach the news feed' }));
  }
};
