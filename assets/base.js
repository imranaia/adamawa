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
    /* clicking the dimmed backdrop (not the docked panel itself) closes it */
    sheet.addEventListener('click', function(e){ if (e.target === sheet) closeSheet(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeSheet(); });

    /* category accordions — expand/collapse, don't close the sheet */
    sheet.querySelectorAll('.nav-sheet__cat-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var cat = btn.closest('.nav-sheet__cat');
        var expanded = cat.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });
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
     CHAT ENGINE — "Ask Adamawa" talks to /api/ask, a serverless
     function that calls a real model (via the Vercel AI Gateway)
     grounded in this same site's data.js. Streams the reply in as it
     is generated rather than waiting for the full response.
     ================================================================ */
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
    var history = []; // { role: 'user'|'assistant', content: string }
    var busy = false;
    if (!log.children.length){
      appendMsg('Ask me anything about Adamawa — its history, local governments, resources, the governor’s record, or anything else about the state. I’m a real AI, grounded in what’s published on this site.', 'bot');
    }
    function escapeHtml(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    function handle(q){
      q = (q || '').trim();
      if (!q || busy) return;
      busy = true;
      appendMsg(escapeHtml(q), 'user');
      input.value = '';
      history.push({ role: 'user', content: q });

      var typing = document.createElement('div');
      typing.className = 'typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;

      fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      }).then(function(res){
        if (!res.ok || !res.body) throw new Error('bad response');
        typing.remove();
        var botDiv = appendMsg('', 'bot');
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var full = '';
        function pump(){
          return reader.read().then(function(step){
            if (step.done){
              if (!full.trim()){
                botDiv.textContent = 'Ask Adamawa is temporarily unavailable — please try again in a moment.';
              } else {
                history.push({ role: 'assistant', content: full });
              }
              return;
            }
            full += decoder.decode(step.value, { stream: true });
            botDiv.textContent = full;
            log.scrollTop = log.scrollHeight;
            return pump();
          });
        }
        return pump();
      }).catch(function(){
        typing.remove();
        appendMsg('Ask Adamawa is temporarily unavailable — please try again in a moment.', 'bot');
      }).finally(function(){ busy = false; });
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
