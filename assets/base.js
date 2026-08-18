/* ============================================================
   ADAMAWA — shared behaviour: nav, scroll reveals, map backdrop,
   distance maths, and the offline "Ask Adamawa" chat engine.
   Loaded on every page after assets/data.js has set window.__ADAMAWA_DATA__.
   ============================================================ */
(function(){
  'use strict';
  var DATA = window.__ADAMAWA_DATA__ || {};

  /* ---------------- data-fact filling (shared across every page) ---------------- */
  function applyFacts(){
    document.querySelectorAll('[data-fact]').forEach(function(el){
      var key = el.getAttribute('data-fact');
      var f = (DATA.facts || {})[key];
      if (f && f.v) el.textContent = f.v;
    });
    if (DATA.governor && DATA.governor.bio && DATA.governor.bio !== '—'){
      var bioEl = document.querySelector('[data-fact="governor-bio"]');
      if (bioEl) bioEl.textContent = DATA.governor.bio;
      var srcEl = document.querySelector('[data-fact="governor-source"]');
      if (srcEl) srcEl.textContent = DATA.governor.source;
    }
  }
  function renderSources(){
    var host = document.getElementById('footer-sources');
    if (!host || !(DATA.sources||[]).length) return;
    host.innerHTML = '<span style="color:var(--text-dim); text-transform:uppercase; letter-spacing:.1em; font-size:.68rem;">Sources</span>' +
      DATA.sources.map(function(s){ return '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a>'; }).join('');
  }

  /* ---------------- theme (dark / light) ---------------- */
  var THEME_KEY = 'adamawa-theme';
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle .lbl, .nav-sheet__theme .lbl').forEach(function(el){
      el.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
    });
  }
  function initTheme(){
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved === 'light' ? 'light' : 'dark');
    function toggle(){
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    }
    document.querySelectorAll('.theme-toggle, .nav-sheet__theme').forEach(function(btn){
      btn.addEventListener('click', toggle);
    });
  }

  /* ---------------- nav / burger ---------------- */
  function initNav(){
    var burger = document.getElementById('burger');
    var sheet = document.getElementById('nav-sheet');
    if (!burger || !sheet) return;
    function closeSheet(){ sheet.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); }
    burger.addEventListener('click', function(){
      var open = sheet.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sheet.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeSheet); });
  }

  /* ---------------- scroll reveals ---------------- */
  function initReveals(){
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      targets.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -3% 0px' });
    targets.forEach(function(el){ io.observe(el); });

    var ticking = false;
    function sweep(){
      ticking = false;
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el){
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      });
    }
    function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(sweep); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sweep();
  }
  window.__reobserveReveals = initReveals;

  /* ---------------- distance maths ---------------- */
  function toRad(d){ return d * Math.PI / 180; }
  function haversineKm(a, b){
    if (!a || !b || a.lat == null || b.lat == null) return null;
    var R = 6371;
    var dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    var s = Math.sin(dLat/2)*Math.sin(dLat/2) +
      Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat)) * Math.sin(dLng/2)*Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
  }
  window.__adamawaDistanceKm = haversineKm;

  /* ---------------- slug helper (shared by the LGA list + LGA detail page) ---------------- */
  window.__adamawaSlug = function(s){
    return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
  };

  /* ---------------- map backdrop (Leaflet, no API key) ---------------- */
  var AdamawaMap = { map: null, marker: null, line: null, interactive: false };
  function initMap(){
    var host = document.getElementById('map-bg');
    if (!host || typeof L === 'undefined') return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      var map = L.map(host, {
        zoomControl: false, attributionControl: true,
        dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        touchZoom: false, boxZoom: false, keyboard: false, tap: false,
        fadeAnimation: !reduceMotion, zoomAnimation: !reduceMotion
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, minZoom: 5,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      var start = (DATA.mapView && DATA.mapView.bounds)
        ? map.fitBounds(DATA.mapView.bounds) && map.getCenter()
        : null;
      if (!start) map.setView([9.32, 12.45], 8);

      AdamawaMap.map = map;

      // keep the backdrop honestly focused on Adamawa itself: cap how far a
      // viewer can pan/zoom out so Lagos, Abuja or deep into Cameroon never
      // fill the frame, and trace + dim everything outside the state outline.
      map.setMinZoom(7);
      map.setMaxBounds([[6.75, 10.35],[11.65, 14.75]]);
      if (DATA.adamawaBoundary && DATA.adamawaBoundary.length > 2){
        var world = [[-85,-180],[-85,180],[85,180],[85,-180]];
        L.polygon([world, DATA.adamawaBoundary], {
          stroke:false, fillColor:'#050a06', fillOpacity:0.5, className:'map-outline', interactive:false
        }).addTo(map);
        L.polygon(DATA.adamawaBoundary, {
          fill:false, color:'#8fe8a8', weight:1.4, opacity:0.6, className:'map-outline', interactive:false
        }).addTo(map);
      }

      var toggle = document.getElementById('map-toggle');
      if (toggle){
        toggle.addEventListener('click', function(){
          AdamawaMap.interactive = !AdamawaMap.interactive;
          var handlers = ['dragging','scrollWheelZoom','doubleClickZoom','touchZoom','boxZoom','keyboard'];
          handlers.forEach(function(h){ AdamawaMap.interactive ? map[h].enable() : map[h].disable(); });
          toggle.classList.toggle('is-live', AdamawaMap.interactive);
          toggle.querySelector('.lbl').textContent = AdamawaMap.interactive ? 'Map: live — drag to explore' : 'Map: view';
        });
      }

      // if the page defines an initial focus (state view or one LGA), fly there on load
      if (DATA.mapView && DATA.mapView.bounds){
        map.fitBounds(DATA.mapView.bounds, { animate: false });
      } else if (DATA.mapView && DATA.mapView.center){
        map.setView([DATA.mapView.center.lat, DATA.mapView.center.lng], DATA.mapView.zoom || 8, { animate: false });
      }
    } catch (e) {
      /* Leaflet failed (offline, blocked tiles, etc) — the CSS gradient
         already set on #map-bg-wrap remains as the fallback backdrop. */
    }
  }
  function clearDistanceLine(){
    if (AdamawaMap.line){ AdamawaMap.map.removeLayer(AdamawaMap.line); AdamawaMap.line = null; }
  }
  function flyTo(lat, lng, zoom, label, showDistance, isCapital){
    if (!AdamawaMap.map) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    AdamawaMap.map.flyTo([lat, lng], zoom || 10, { animate: !reduceMotion, duration: 1.6 });
    if (AdamawaMap.marker) AdamawaMap.map.removeLayer(AdamawaMap.marker);
    clearDistanceLine();
    if (typeof L !== 'undefined'){
      var pinHtml =
        '<div class="map-pin3d__wrap"><div class="map-pin3d__stem"></div>' +
        '<div class="map-pin3d__knob"><div class="map-pin3d__ring"></div><div class="map-pin3d__ring map-pin3d__ring--b"></div></div></div>' +
        '<div class="map-pin3d__shadow"></div>';
      var icon = L.divIcon({
        className: 'map-pin3d' + (isCapital ? ' map-pin3d--capital' : ''),
        html: pinHtml, iconSize: [26, 38], iconAnchor: [13, 33]
      });
      AdamawaMap.marker = L.marker([lat, lng], { icon: icon, keyboard:false }).addTo(AdamawaMap.map);

      // draw the straight-line (great-circle) path back to Yola so the
      // distance figure shown in the UI has a visible, honest basis —
      // this is *not* a road route, just the geodesic the km figure uses.
      if (showDistance && DATA.yola && (Math.abs(DATA.yola.lat - lat) > 0.01 || Math.abs(DATA.yola.lng - lng) > 0.01)){
        var km = haversineKm(DATA.yola, { lat: lat, lng: lng });
        AdamawaMap.line = L.polyline([[DATA.yola.lat, DATA.yola.lng], [lat, lng]], {
          color: '#74d492', weight: 2, opacity: 0.85, dashArray: '2 8', lineCap: 'round'
        }).bindTooltip(km != null ? '≈' + Math.round(km) + ' km, straight-line' : '', {
          permanent: false, sticky: true, className: 'map-tip'
        }).addTo(AdamawaMap.map);
      }
    }
  }
  window.__adamawaMap = { init: initMap, flyTo: flyTo, clearDistanceLine: clearDistanceLine };

  /* ================================================================
     CHAT ENGINE — offline retrieval over the embedded knowledge base.
     Runs entirely client-side against window.__ADAMAWA_DATA__.
     ================================================================ */
  var corpus = [];
  var ZONE_LABEL = { north: 'Adamawa North', central: 'Adamawa Central', south: 'Adamawa South' };

  function buildCorpus(){
    corpus = [];
    var F = DATA.facts || {};
    if (F['state-founded'] && F['state-founded'].v && F['state-founded'].v !== '—'){
      corpus.push({ text: 'when was adamawa state created founded formed history date', answer: 'Adamawa State was created on ' + F['state-founded'].v + '.', source: F['state-founded'].src });
    }
    if (F.population && F.population.v !== '—'){
      corpus.push({ text: 'population how many people live in adamawa', answer: 'Adamawa State has a population of approximately ' + F.population.v + '.', source: F.population.src });
    }
    if (F['land-area'] && F['land-area'].v !== '—'){
      corpus.push({ text: 'land area size how big is adamawa square kilometres', answer: 'Adamawa State covers roughly ' + F['land-area'].v + '.', source: F['land-area'].src });
    }
    corpus.push({ text: 'capital city of adamawa', answer: 'The capital of Adamawa State is Yola.', source: '' });

    if (DATA.governor && DATA.governor.bio && DATA.governor.bio !== '—'){
      corpus.push({ text: 'governor fintiri biography who is the governor ahmadu umaru fintiri current', answer: DATA.governor.bio, source: DATA.governor.source });
    }
    (DATA.governors || []).forEach(function(g){
      corpus.push({ text: ('governor administrator ' + g.name + ' ' + (g.term||'') + ' ' + (g.note||'')).toLowerCase(),
        answer: g.name + ' (' + (g.term||'') + '): ' + (g.note || 'Served as Governor of Adamawa State.'), source: g.source || '' });
    });
    (DATA.eras || []).forEach(function(e){
      corpus.push({ text: (e.title + ' ' + e.body + ' ' + e.when).toLowerCase(), answer: e.title + ' (' + e.when + '). ' + e.body, source: e.source || '' });
    });
    (DATA.lgas || []).forEach(function(l){
      var langTxt = l.languages ? l.languages.join(', ') : '';
      corpus.push({ text: ('local government area lga ' + l.name + ' headquarters ' + l.hq + ' zone ' + ZONE_LABEL[l.zone] + ' language ' + langTxt).toLowerCase(),
        answer: l.name + ' is a local government area in ' + ZONE_LABEL[l.zone] + '. Its headquarters is ' + l.hq + '.' + (langTxt ? ' Documented languages/ethnic groups in the area include ' + langTxt + '.' : ''),
        source: l.source || '' });
    });
    (DATA.minerals || []).forEach(function(m){
      corpus.push({ text: ('mineral resource ' + m.name + ' ' + m.where + ' ' + m.note).toLowerCase(),
        answer: m.answer || (m.name + ' is found in ' + m.where + '. ' + m.note), source: m.source || '' });
    });
    (DATA.achievements || []).forEach(function(a){
      corpus.push({ text: ('governor fintiri achievement ' + a.title + ' ' + a.body).toLowerCase(),
        answer: a.title + ': ' + a.body, source: a.source || '' });
    });
    (DATA.landmarks || []).forEach(function(l){
      corpus.push({ text: ('landmark culture site ' + l.name + ' ' + (l.lga||'') + ' ' + l.note).toLowerCase(),
        answer: l.name + ': ' + l.note, source: l.source || '' });
    });
    corpus.forEach(function(entry){ entry.words = new Set(tokenize(entry.text)); });
  }

  var STOPWORDS = new Set(['the','and','for','are','was','were','has','have','had','with','from','this','that',
    'what','when','where','which','who','how','does','do','did','doe','can','you','your','about','into','out',
    'located','tell','know','all','any','some','list','name','state','adamawa','far','many']);
  function tokenize(s){
    return s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
      .filter(function(t){ return t.length > 2 && !STOPWORDS.has(t); });
  }

  function findGeoByName(name){
    name = name.toLowerCase();
    var hit = (DATA.lgas || []).find(function(l){ return name.indexOf(l.name.toLowerCase()) !== -1 || name.indexOf(l.hq.toLowerCase()) !== -1; });
    if (hit && hit.lat != null) return { lat: hit.lat, lng: hit.lng, label: hit.name };
    var lm = (DATA.landmarks || []).find(function(l){ return name.indexOf(l.name.toLowerCase()) !== -1; });
    if (lm && lm.lat != null) return { lat: lm.lat, lng: lm.lng, label: lm.name };
    return null;
  }

  function answerQuery(q){
    var qLower = q.toLowerCase();

    if (/how far|distance/.test(qLower)){
      var target = findGeoByName(qLower);
      if (target && DATA.yola){
        var km = haversineKm(DATA.yola, target);
        if (km != null) return { text: target.label + ' is approximately ' + Math.round(km) + ' km from Yola (straight-line distance).', source: 'Calculated from documented coordinates' };
      }
    }

    var zoneMatch = null;
    if (/north/.test(qLower)) zoneMatch = 'north';
    else if (/central/.test(qLower)) zoneMatch = 'central';
    else if (/south/.test(qLower)) zoneMatch = 'south';
    if (zoneMatch && /(lga|local government|area)/.test(qLower)){
      var names = (DATA.lgas||[]).filter(function(l){ return l.zone === zoneMatch; }).map(function(l){ return l.name; });
      if (names.length) return { text: ZONE_LABEL[zoneMatch] + ' has ' + names.length + ' local government areas: ' + names.join(', ') + '.', source: '' };
    }
    if (/(all|list).*(lga|local government)/.test(qLower) || /how many local government/.test(qLower)){
      if ((DATA.lgas||[]).length) return { text: 'Adamawa State has ' + DATA.lgas.length + ' local government areas across three senatorial zones: ' + DATA.lgas.map(function(l){return l.name;}).join(', ') + '.', source: '' };
    }
    if (/mineral/.test(qLower) && /(what|which|list)/.test(qLower)){
      if ((DATA.minerals||[]).length) return { text: 'Adamawa is known for: ' + DATA.minerals.map(function(m){return m.name;}).join(', ') + '.', source: '' };
    }
    if (/(governor|fintiri).*(done|achiev|accomplish|record|work)/.test(qLower)){
      if ((DATA.achievements||[]).length) return { text: 'Some of the governor’s documented initiatives: ' + DATA.achievements.map(function(a){return a.title;}).join('; ') + '. Ask me about any one of these for detail.', source: '' };
    }
    if (/(past|former|previous|all).*governor/.test(qLower) || /governors.*adamawa/.test(qLower)){
      if ((DATA.governors||[]).length) return { text: 'Governors of Adamawa State: ' + DATA.governors.map(function(g){return g.name + ' (' + g.term + ')';}).join('; ') + '.', source: '' };
    }

    var qTokens = tokenize(q);
    if (!qTokens.length || !corpus.length) return null;
    var best = null, bestScore = 0;
    corpus.forEach(function(entry){
      var score = 0;
      qTokens.forEach(function(t){ if (entry.words.has(t)) score++; });
      if (score > bestScore){ bestScore = score; best = entry; }
    });
    var minScore = Math.min(2, qTokens.length);
    if (best && bestScore >= minScore) return { text: best.answer, source: best.source };
    return null;
  }

  function appendMsg(text, who, source){
    var log = document.getElementById('ask-log');
    var div = document.createElement('div');
    div.className = 'msg ' + who;
    div.innerHTML = text + (source ? '<span class="src">' + source + '</span>' : '');
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function initChat(){
    var form = document.getElementById('ask-form');
    if (!form) return; // page has no chat panel (overview)
    var input = document.getElementById('ask-input');
    var log = document.getElementById('ask-log');
    buildCorpus();
    if (!log.children.length){
      appendMsg('Ask me anything about Adamawa’s history, local governments, resources, or the governor’s record — I answer from the material published on this site.', 'bot');
    }
    function escapeHtml(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function handle(q){
      if (!q.trim()) return;
      appendMsg(escapeHtml(q), 'user');
      input.value = '';
      var typing = document.createElement('div');
      typing.className = 'typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;
      setTimeout(function(){
        typing.remove();
        var res = answerQuery(q);
        if (res) appendMsg(res.text, 'bot', res.source);
        else appendMsg('I don’t have that in what’s published on this site yet — try asking about the state’s history, a specific local government area, its mineral resources, or the governor’s initiatives.', 'bot');
      }, 420 + Math.random()*380);
    }
    form.addEventListener('submit', function(e){ e.preventDefault(); handle(input.value); });
    document.querySelectorAll('#ask-suggest button').forEach(function(b){
      b.addEventListener('click', function(){ handle(b.getAttribute('data-q')); document.getElementById('ask').scrollIntoView({behavior:'smooth', block:'start'}); });
    });

    var launcher = document.getElementById('launcher');
    var askSection = document.getElementById('ask');
    if (launcher && askSection){
      function scrollToAsk(){ askSection.scrollIntoView({ behavior:'smooth', block:'start' }); input.focus({preventScroll:true}); }
      launcher.addEventListener('click', scrollToAsk);
      var navAsk = document.getElementById('open-chat-nav');
      if (navAsk) navAsk.addEventListener('click', scrollToAsk);
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ launcher.classList.toggle('is-hidden', e.isIntersecting); });
      }, { threshold: 0.15 });
      io2.observe(askSection);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    applyFacts();
    renderSources();
    initTheme();
    initNav();
    initMap();
    initReveals();
    initChat();
    if (typeof window.__adamawaPageInit === 'function') window.__adamawaPageInit(DATA);
  });
})();
