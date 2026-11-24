/* G01 app logic. Content lives in data.js. No network, no backend, no live AI. */
(function () {
  'use strict';
  var D = window.G01_DATA;
  var KEY = 'g01-seed-choices-v1';
  var ORDER = ['start', 'meet', 'routes', 'stress', 'report', 'debrief'];
  var LABEL = { start: 'Choose farmer', meet: 'Meet the farmer', routes: 'Routes and plan', stress: 'Stress test', report: 'Fit report', debrief: 'Debrief' };
  var ICON = {
    start: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.600-7 8-7s8 3 8 7"/>',
    meet: '<path d="M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7zM2.500 20c0-3.500 3-6 6.500-6s6.500 2.500 6.500 6M16 4.500a3.500 3.500 0 0 1 0 6.500M18 14c2.200.8 3.500 3 3.500 6"/>',
    routes: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    stress: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    report: '<path d="M12 3a9 9 0 1 0 9 9h-9zM15 3.500A9 9 0 0 1 20.500 9H15z"/>',
    debrief: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.500h.01"/>'
  };
  function svgIcon(d) { var w = document.createElement('span'); w.className = 'ico'; w.setAttribute('aria-hidden', 'true'); w.innerHTML = '<svg viewBox="0 0 24 24">' + d + '</svg>'; return w; }
  var $app = document.getElementById('app');
  var $status = document.getElementById('status');
  var $steps = document.getElementById('steps');
  var params = new URLSearchParams(location.search);
  var state = { screen: 'start', farmerId: null, plans: {}, facilitator: params.get('facilitator') === '1', remember: false };

  /* ---------- helpers ---------- */
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); }
    else if (c.nodeType) { el.appendChild(c); }
    else { el.appendChild(document.createTextNode(String(c))); }
  }
  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function farmer() { return byId(D.farmers, state.farmerId); }
  function plan() { return state.plans[state.farmerId]; }
  function src(id) { return byId(D.sources, id); }
  function chosen() { var p = plan(); return [p.main, p.backup].filter(Boolean); }
  function announce(msg) { $status.textContent = ''; setTimeout(function () { $status.textContent = msg; }, 30); }
  function lvl(code) {
    var l = D.levels[code];
    return h('span', { class: 'lvl lvl-' + code }, h('span', { 'aria-hidden': 'true' }, l.sym), l.label);
  }
  function stressBadge(code) {
    var l = D.stressLevels[code];
    return h('span', { class: 'lvl lvl-' + ({ holds: 'g', strained: 'p', exposed: 'w', depends: 'u' })[code] }, h('span', { 'aria-hidden': 'true' }, l.sym), l.label);
  }
  function list(items) { return h('ul', { class: 'clean' }, items.map(function (t) { return h('li', null, t); })); }
  function tableWrap(label, table) { return h('div', { class: 'tablewrap', role: 'region', 'aria-label': label, tabindex: '0' }, table); }


  /* ---------- cartoon headshots (generated SVG, fictional people) ---------- */
  var FACE = '<ellipse cx="62" cy="96" rx="7" ry="9" fill="SKIN2"/><ellipse cx="138" cy="96" rx="7" ry="9" fill="SKIN2"/>' +
    '<ellipse cx="100" cy="94" rx="38" ry="44" fill="SKIN"/>';
  var FEATURES = '<ellipse cx="86" cy="94" rx="4.600" ry="5.800" fill="#1d1410"/><ellipse cx="114" cy="94" rx="4.600" ry="5.800" fill="#1d1410"/>' +
    '<circle cx="87.600" cy="92" r="1.600" fill="#fff"/><circle cx="115.600" cy="92" r="1.600" fill="#fff"/>' +
    '<path d="M100 98c-2 6-4 9-1 10 3 1 5 0 6-1" fill="none" stroke="SKIN2" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M86 113q14 12 28 0" fill="#fff" stroke="#3a1c14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="74" cy="108" r="6" fill="#e0715a" opacity=".28"/><circle cx="126" cy="108" r="6" fill="#e0715a" opacity=".28"/>';
  function mk(bg, body, skin, skin2) {
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' + '<rect width="200" height="200" fill="' + bg + '"/>' + body.replace(/SKIN2/g, skin2).replace(/SKIN/g, skin) + '</svg>';
  }
  var PORTRAIT = {
    amina: mk('#f6e4b4',
      '<path d="M62 92c-6 22 0 40 8 46h60c8-6 14-24 8-46z" fill="#2a1a12"/>' +
      '<path d="M18 200c0-34 34-56 82-56s82 22 82 56z" fill="#c4553a"/><path d="M80 146l20 22 20-22" fill="#f3e6c8"/>' +
      '<rect x="87" y="122" width="26" height="30" rx="10" fill="SKIN2"/>' + FACE +
      '<path d="M64 88c4-22 22-30 36-30s32 8 36 30c-10-10-26-14-36-14s-26 4-36 14z" fill="#2a1a12"/>' +
      '<path d="M78 85q8-5 16-1M106 84q8-4 16 1" fill="none" stroke="#2a1a12" stroke-width="3.500" stroke-linecap="round"/>' + FEATURES +
      '<ellipse cx="100" cy="68" rx="66" ry="14" fill="#e0a63a"/><path d="M62 68c0-34 76-34 76 0z" fill="#f2c14e"/><path d="M62 66c20 8 56 8 76 0v-7c-20 7-56 7-76 0z" fill="#c4553a"/>' +
      '<circle cx="55" cy="106" r="3.500" fill="#f2c14e"/><circle cx="145" cy="106" r="3.500" fill="#f2c14e"/>',
      '#8d5a3b', '#774a30'),
    joseph: mk('#f8d6cb',
      '<path d="M18 200c0-34 34-56 82-56s82 22 82 56z" fill="#2f5a3e"/><path d="M80 146l20 20 20-20" fill="#e8cf9a"/>' +
      '<rect x="87" y="122" width="26" height="30" rx="10" fill="SKIN2"/>' + FACE +
      '<path d="M62 88c-2-30 18-44 38-44s40 14 38 44c-4-14-12-24-22-26-10 4-30 4-42-2-4 6-8 16-12 28z" fill="#1d1410"/>' +
      '<path d="M76 84l18-3M106 81l18 3" fill="none" stroke="#1d1410" stroke-width="4.500" stroke-linecap="round"/>' + FEATURES +
      '<path d="M88 107c6-5 18-5 24 0-6 2-18 2-24 0z" fill="#1d1410"/>',
      '#6b4128', '#573320'),
    neema: mk('#d9e8d2',
      '<circle cx="100" cy="62" r="40" fill="#1d1410"/><circle cx="66" cy="84" r="16" fill="#1d1410"/><circle cx="134" cy="84" r="16" fill="#1d1410"/>' +
      '<path d="M18 200c0-34 34-56 82-56s82 22 82 56z" fill="#b0508a"/><path d="M78 148q22 22 44 0" fill="none" stroke="#f3e6c8" stroke-width="5"/>' +
      '<rect x="87" y="122" width="26" height="30" rx="10" fill="SKIN2"/>' + FACE +
      '<path d="M62 86c0-34 76-34 76 0-14-14-62-14-76 0z" fill="#e0a63a"/>' +
      '<circle cx="76" cy="70" r="3" fill="#b0508a"/><circle cx="92" cy="64" r="3" fill="#b0508a"/><circle cx="108" cy="64" r="3" fill="#b0508a"/><circle cx="124" cy="70" r="3" fill="#b0508a"/>' +
      '<path d="M76 85q8-5 16-1M108 84q8-4 16 1" fill="none" stroke="#1d1410" stroke-width="3.500" stroke-linecap="round"/>' + FEATURES +
      '<circle cx="62" cy="108" r="3.500" fill="#e0a63a"/><circle cx="138" cy="108" r="3.500" fill="#e0a63a"/>',
      '#a56b45', '#8c5a38')
  };
  function portrait(id, size) {
    var w = document.createElement('span');
    w.className = 'portrait' + (size ? ' ' + size : '');
    w.setAttribute('aria-hidden', 'true');
    w.innerHTML = PORTRAIT[id] || '';
    return w;
  }

  /* ---------- optional storage (opt-in, try/catch) ---------- */
  function save() {
    try {
      if (state.remember) localStorage.setItem(KEY, JSON.stringify({ remember: true, plans: state.plans }));
      else localStorage.removeItem(KEY);
    } catch (e) { /* storage blocked: the activity still works */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var o = JSON.parse(raw);
      if (o && o.remember && o.plans) {
        state.remember = true;
        Object.keys(o.plans).forEach(function (id) { if (byId(D.farmers, id)) state.plans[id] = o.plans[id]; });
      }
    } catch (e) { /* ignore */ }
  }
  function resetAll() {
    if (!window.confirm('Clear all choices and any saved data on this device?')) return;
    state.plans = {}; state.farmerId = null; state.remember = false;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    go('start'); announce('Everything was cleared.');
  }

  /* ---------- navigation ---------- */
  function reachable(s) {
    if (s === 'start') return true;
    if (!state.farmerId) return false;
    var p = plan();
    if (s === 'meet' || s === 'routes') return true;
    if (s === 'stress') return !!p.main;
    return !!(p.main && p.disruption);
  }
  function go(screen) {
    state.screen = screen;
    render();
  }
  function renderSteps() {
    $steps.innerHTML = '';
    ORDER.forEach(function (s) {
      var b = h('button', { type: 'button', onclick: function () { go(s); } }, svgIcon(ICON[s]), h('span', { class: 'num', 'aria-hidden': 'true' }, String(ORDER.indexOf(s) + 1)), LABEL[s]);
      if (s === state.screen) b.setAttribute('aria-current', 'step');
      if (!reachable(s)) b.disabled = true;
      $steps.appendChild(h('li', null, b));
    });
  }
  function facPanel(key) {
    if (!state.facilitator) return null;
    var tips = {
      start: 'Ask for a guess first: "Which seed source is best?" Keep the guesses visible and return to them in the debrief.',
      meet: 'Ask participants to say aloud what matters most to this farmer before they look at the routes.',
      routes: 'Listen for "best" language. Ask: best for whom, at what time of year, for which crop?',
      stress: 'Change the disruption and compare. Does the same plan hold up in all four?',
      report: 'The symbols are not a score. Ask which gap matters most and who could help close it.',
      debrief: 'Run the five reflection questions. Use the compare table if two or more farmers were tried.'
    };
    var f = D.facilitator;
    return h('details', { class: 'fac' }, h('summary', null, 'Facilitator note for this screen'),
      h('p', null, tips[key]),
      key === 'start' ? [h('p', null, f.purpose), h('p', null, 'Time: ' + f.time), h('p', null, h('strong', null, 'Suggested flow')), list(f.flow), h('p', null, h('strong', null, 'Watch for')), list(f.watchFor)] : null);
  }
  function nav(back, next, nextLabel, nextDisabled) {
    return h('div', { class: 'row' },
      back ? h('button', { type: 'button', class: 'btn alt', onclick: function () { go(back); } }, 'Back') : null,
      next ? h('button', { type: 'button', class: 'btn', disabled: nextDisabled, onclick: function () { go(next); } }, nextLabel) : null);
  }
  function heading(text) { return h('h1', { tabindex: '-1', id: 'h1' }, text); }

  /* ---------- screens ---------- */
  function screenStart() {
    var rem = h('input', { type: 'checkbox', id: 'rem', onchange: function (e) { state.remember = e.target.checked; save(); } });
    rem.checked = state.remember;
    return h('div', null,
      h('h1', { tabindex: '-1', id: 'h1' }, 'Where will the seed come from?', h('span', { class: 'pill' }, 'Fictional scenario')),
      h('div', { class: 'fiction' },
        h('span', { class: 'fic-ico', 'aria-hidden': 'true' }, '!'),
        h('p', null, 'Three fictional farmers, one decision each season. All names, places and details are invented for teaching and do not describe real people. Choose a farmer, look at what they want and what they have, then plan where their seed will come from.'),
        h('button', { type: 'button', class: 'btn alt small-btn', onclick: function () { aboutOpen = true; render(); } }, 'Learn more')),
      h('p', null, 'There is no best seed source and no score. Each source meets some needs and misses others. You will see how your plan fits the farmer, test it against something going wrong, and compare with other farmers.'),
      facPanel('start'),
      h('div', { class: 'grid' }, D.farmers.map(function (f) {
        var tried = state.plans[f.id] && state.plans[f.id].main;
        return h('div', { class: 'card farmer-pick', 'data-farmer': f.id },
          h('p', { class: 'eyebrow' }, f.name),
          h('h2', { style: 'margin-top:0' }, f.name, ' ', h('span', { class: 'tag' }, f.crop)),
          h('p', null, f.intro),
          h('ul', { class: 'chips' }, f.cropNote.split(', ').slice(0, 3).map(function (c) { return h('li', null, c); })),
          tried ? h('p', { class: 'small' }, 'You have already planned for ' + f.name + '.') : null,
          portrait(f.id),
          h('button', { type: 'button', class: 'btn', onclick: function () { pickFarmer(f.id); } }, (tried ? 'Open ' : 'Meet ') + f.name));
      })),
      h('div', { class: 'card' },
        h('label', { class: 'opt', for: 'rem' }, rem, h('span', null, 'Remember my choices on this device. Off by default. Only your route choices are stored, no names or personal data. You can reset at any time with Reset simulation in the side menu.'))));
  }
  function pickFarmer(id) {
    state.farmerId = id;
    if (!state.plans[id]) state.plans[id] = { main: null, backup: null, disruption: null };
    save(); go('meet');
  }

  function screenMeet() {
    var f = farmer();
    var tbl = h('table', null,
      h('caption', null, f.name + '’s season (fictional). The seed decision window is highlighted.'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Season factor'),
        f.stages.map(function (s, i) { return h('th', { scope: 'col', class: i === f.decisionStage ? 'win' : null }, s, i === f.decisionStage ? h('span', { class: 'cellnote' }, '▶ Seed decision window') : null); }))),
      h('tbody', null, Object.keys(f.calendar).map(function (row) {
        return h('tr', null, h('th', { scope: 'row' }, row),
          f.calendar[row].map(function (c, i) { return h('td', { class: i === f.decisionStage ? 'win' : null }, c); }));
      })));
    return h('div', null,
      h('div', { class: 'meet-head' }, portrait(f.id, 'sm'), heading('Meet ' + f.name)),
      h('p', { class: 'fiction' }, 'Fictional farmer. Details are invented for this activity.'),
      h('p', null, f.intro),
      h('div', { class: 'grid' },
        h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'Crop'), h('p', null, h('strong', null, f.crop), ' · ' + f.cropNote),
          h('h2', null, 'What ' + f.name + ' wants from seed'), list(f.wants)),
        h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'What ' + f.name + ' has'),
          h('dl', null, f.resources.map(function (r) { return [h('dt', { style: 'font-weight:700' }, r[0]), h('dd', { style: 'margin:0 0 .4rem 0' }, r[1])]; })))),
      h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'What matters most when choosing'),
        h('ul', { class: 'clean' }, D.dimensions.map(function (d) {
          return h('li', null, h('strong', null, d.label), ': ' + D.importanceLabel[f.importance[d.id]] + '. ', h('span', { class: 'small' }, d.q));
        }))),
      h('h2', null, 'The season'),
      tableWrap('Seasonal table for ' + f.name, tbl),
      facPanel('meet'),
      nav('start', 'routes', 'Explore the routes'));
  }

  function setRole(role, id) {
    var p = plan();
    if (p[role] === id) { p[role] = null; }
    else {
      p[role] = id;
      var other = role === 'main' ? 'backup' : 'main';
      if (p[other] === id) p[other] = null;
    }
    save(); render(true);
  }
  function screenRoutes() {
    var f = farmer(), p = plan();
    var cards = D.sources.map(function (s) {
      var st = f.story[s.id];
      var isMain = p.main === s.id, isBack = p.backup === s.id;
      return h('div', { class: 'card' + (isMain || isBack ? ' chosen' : ''), id: 'route-' + s.id },
        h('h2', { style: 'margin-top:0' }, s.name, isMain ? h('span', { class: 'tag' }, ' Main route') : null, isBack ? h('span', { class: 'tag' }, ' Back-up') : null),
        h('p', { class: 'small' }, s.tagline),
        h('p', null, h('strong', null, 'For ' + f.name + ': '), st[0]),
        h('p', null, h('strong', null, 'Ask: '), st[1]),
        h('details', null, h('summary', null, 'In general, this route'),
          h('p', null, h('strong', null, 'Can meet: '), s.can), h('p', null, h('strong', null, 'Watch for: '), s.watch), h('p', null, h('strong', null, 'Check: '), s.check),
          h('p', { class: 'small' }, 'General statements for discussion. To be verified by a seed-systems expert before release.')),
        h('div', { class: 'row' },
          h('button', { type: 'button', id: 'bm-' + s.id, class: 'btn alt', 'aria-pressed': isMain ? 'true' : 'false', onclick: function () { setRole('main', s.id); } }, 'Main route' + ': ' + s.name),
          h('button', { type: 'button', id: 'bb-' + s.id, class: 'btn alt', 'aria-pressed': isBack ? 'true' : 'false', onclick: function () { setRole('backup', s.id); } }, 'Back-up' + ': ' + s.name)));
    });
    var bar = h('div', { class: 'planbar' },
      h('span', null, h('strong', null, 'Your plan for ' + f.name + ': '), 'main = ' + (p.main ? src(p.main).name : 'not chosen yet'), ' · back-up = ' + (p.backup ? src(p.backup).name : 'none (optional)')),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn alt', onclick: function () { go('meet'); } }, 'Back'),
        h('button', { type: 'button', class: 'btn', disabled: !p.main, onclick: function () { go('stress'); } }, 'Stress-test the plan')));
    return h('div', null,
      heading('Routes and plan for ' + f.name),
      h('p', null, 'Five routes. Read what each could mean for ' + f.name + ', then choose one main route and, if you like, one back-up. Mixing routes is realistic. Choose the button again to undo.'),
      h('p', { class: 'small' }, f.name + ' wants: ' + f.wants.join('; ') + '.'),
      facPanel('routes'),
      h('div', { class: 'grid' }, cards), bar);
  }

  function screenStress() {
    var f = farmer(), p = plan();
    var group = h('fieldset', null, h('legend', null, 'Choose one thing that could go wrong'),
      D.disruptions.map(function (d) {
        var r = h('input', { type: 'radio', name: 'dis', value: d.id, id: 'dis-' + d.id, onchange: function () { p.disruption = d.id; save(); render(true); } });
        if (p.disruption === d.id) r.checked = true;
        return h('label', { class: 'opt', for: 'dis-' + d.id }, r, h('span', null, h('strong', null, d.label), ': ' + d.text));
      }));
    var out = null;
    if (p.disruption) {
      var d = byId(D.disruptions, p.disruption), res = D.stress[d.id];
      out = h('div', null,
        h('h2', null, 'What happens: ' + d.label),
        h('p', null, f.stressNote[d.id]),
        chosen().map(function (id, i) {
          var r = res[id];
          return h('div', { class: 'card' }, h('h3', null, (i === 0 ? 'Main: ' : 'Back-up: ') + src(id).name + '  ', stressBadge(r[0])), h('p', null, r[1]));
        }),
        h('h3', null, 'Other routes ' + f.name + ' could turn to'),
        list(D.sources.filter(function (s) { return chosen().indexOf(s.id) < 0; }).map(function (s) { return s.name + ': ' + D.stressLevels[res[s.id][0]].label + '. ' + res[s.id][1]; })));
    }
    return h('div', null,
      heading('Stress-test the plan'),
      h('p', null, 'Your plan: main = ' + src(p.main).name + (p.backup ? ', back-up = ' + src(p.backup).name : ', no back-up') + '. Pick a disruption to see how it holds up. You can try each one. The result is a conversation aid in words and symbols, not a prediction.'),
      group, out, facPanel('stress'),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn alt', onclick: function () { go('routes'); } }, 'Change the plan'),
        h('button', { type: 'button', class: 'btn', disabled: !p.disruption, onclick: function () { go('report'); } }, 'See the fit report')));
  }

  function cover(f, dimId, routes) {
    var vals = routes.map(function (r) { return f.assess[r][dimId][0]; });
    if (vals.indexOf('g') >= 0) return 'g';
    if (vals.indexOf('p') >= 0) return 'p';
    if (vals.indexOf('u') >= 0) return 'u';
    return 'w';
  }
  var COVER_TEXT = { g: 'Well covered', p: 'Partly covered', u: 'Not known: check', w: 'Still open' };

  function screenReport() {
    var f = farmer(), p = plan(), ids = chosen();
    var thead = h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Need'), h('th', { scope: 'col' }, 'How much it matters'),
      ids.map(function (id, i) { return h('th', { scope: 'col' }, (i === 0 ? 'Main: ' : 'Back-up: ') + src(id).name); }),
      ids.length > 1 ? h('th', { scope: 'col' }, 'Together') : null));
    var tbody = h('tbody', null, D.dimensions.map(function (d) {
      return h('tr', null, h('th', { scope: 'row' }, d.label), h('td', null, D.importanceLabel[f.importance[d.id]]),
        ids.map(function (id) { var a = f.assess[id][d.id]; return h('td', null, lvl(a[0]), h('span', { class: 'cellnote' }, a[1])); }),
        ids.length > 1 ? h('td', null, lvl(cover(f, d.id, ids)), h('span', { class: 'cellnote' }, COVER_TEXT[cover(f, d.id, ids)])) : null);
    }));
    var gaps = D.dimensions.filter(function (d) { return f.importance[d.id] === 'high' && cover(f, d.id, ids) !== 'g'; });
    var unknowns = [];
    ids.forEach(function (id) { D.dimensions.forEach(function (d) { if (f.assess[id][d.id][0] === 'u') unknowns.push(src(id).name + ', ' + d.label.toLowerCase() + ': ' + f.assess[id][d.id][1]); }); });
    return h('div', null,
      heading('Fit report for ' + f.name),
      h('p', { class: 'fiction' }, 'Fictional farmer, qualitative judgements by the pilot author. This is not a score and not a prediction.'),
      h('p', null, 'How your plan meets each need. Symbols and words, not colour alone.'),
      tableWrap('Fit of the plan to ' + f.name + '’s needs', h('table', null, h('caption', null, 'Plan fit by need'), thead, tbody)),
      h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'What the plan covers and what is still open'),
        gaps.length ? [h('p', null, 'Needs that matter most to ' + f.name + ' and are not fully covered:'), list(gaps.map(function (d) { return d.label + ': ' + COVER_TEXT[cover(f, d.id, ids)].toLowerCase() + '. ' + d.q; }))]
          : h('p', null, 'Every need that matters most to ' + f.name + ' is covered by at least one chosen route. Others may still be partly covered.')),
      h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'What to check before committing'),
        list(ids.map(function (id) { return src(id).name + ': ' + src(id).check; }))),
      h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'What we do not know'),
        unknowns.length ? list(unknowns) : h('p', null, 'No cell is marked unknown for your chosen routes.'),
        h('p', { class: 'small' }, 'Also unknown: how these invented cases compare with real farmers in a real place. Treat everything as a prompt for discussion.')),
      h('p', null, f.wholeNote),
      facPanel('report'),
      nav('stress', 'debrief', 'Go to the debrief'));
  }

  function summaryText() {
    var lines = ['G01 seed-choice summary (fictional farmers, pilot for review)'];
    D.farmers.forEach(function (f) {
      var p = state.plans[f.id]; if (!p || !p.main) return;
      var ids = [p.main, p.backup].filter(Boolean);
      var gaps = D.dimensions.filter(function (d) { return f.importance[d.id] === 'high' && cover(f, d.id, ids) !== 'g'; }).map(function (d) { return d.label; });
      lines.push(f.name + ' (' + f.crop + '): main = ' + src(p.main).name + '; back-up = ' + (p.backup ? src(p.backup).name : 'none') + '; stress test = ' + (p.disruption ? byId(D.disruptions, p.disruption).label : 'not done') + '; top needs not fully covered = ' + (gaps.length ? gaps.join(', ') : 'none'));
    });
    return lines.join('\n');
  }

  function screenDebrief() {
    var f = farmer(), p = plan(), ids = chosen();
    var role = function (id) { return p.main === id ? ' (your main)' : p.backup === id ? ' (your back-up)' : ''; };
    var map = h('table', null, h('caption', null, 'All five routes for ' + f.name + ' (fictional)'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Route'), D.dimensions.map(function (d) { return h('th', { scope: 'col' }, d.label, h('span', { class: 'cellnote' }, D.importanceLabel[f.importance[d.id]])); }))),
      h('tbody', null, D.sources.map(function (s) {
        return h('tr', null, h('th', { scope: 'row', class: role(s.id) ? 'win' : null }, s.name + role(s.id)),
          D.dimensions.map(function (d) { var a = f.assess[s.id][d.id]; return h('td', null, lvl(a[0]), h('span', { class: 'cellnote' }, a[1])); }));
      })));
    var high = D.dimensions.filter(function (d) { return f.importance[d.id] === 'high'; });
    var derived = D.sources.map(function (s) {
      var m = [], gp = [];
      high.forEach(function (d) { (f.assess[s.id][d.id][0] === 'g' ? m : gp).push(d.label.toLowerCase()); });
      return s.name + ': meets ' + (m.length ? m.join(', ') : 'none') + (gp.length ? '; partly, weak or unknown on ' + gp.join(', ') : '') + '.';
    });
    var fnTable = h('table', null, h('caption', null, 'Eight sector functions (V2.0) and your chosen routes. Simplified, to verify.'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Sector function'), h('th', { scope: 'col' }, 'Used by your plan?'), h('th', { scope: 'col' }, 'What it covers'))),
      h('tbody', null, D.functions.map(function (fn) {
        var users = ids.filter(function (id) { return src(id).functions.indexOf(fn.id) >= 0; }).map(function (id) { return src(id).name; });
        return h('tr', null, h('th', { scope: 'row' }, fn.name), h('td', null, users.length ? 'Yes: ' + users.join(', ') : 'Not leaned on'), h('td', null, fn.note));
      })));
    var tried = D.farmers.filter(function (x) { return state.plans[x.id] && state.plans[x.id].main; });
    var cmp = null;
    if (tried.length >= 2) {
      var mains = tried.map(function (x) { return state.plans[x.id].main; });
      var same = mains.every(function (m) { return m === mains[0]; });
      cmp = [tableWrap('Comparison across farmers', h('table', null, h('caption', null, 'Your plans across farmers'),
        h('thead', null, h('tr', null, ['Farmer', 'Crop', 'Main', 'Back-up', 'Stress test'].map(function (c) { return h('th', { scope: 'col' }, c); }))),
        h('tbody', null, tried.map(function (x) { var q = state.plans[x.id]; return h('tr', null, h('th', { scope: 'row' }, x.name), h('td', null, x.crop), h('td', null, src(q.main).name), h('td', null, q.backup ? src(q.backup).name : 'none'), h('td', null, q.disruption ? byId(D.disruptions, q.disruption).label : 'not done')); })))),
        h('p', null, same ? 'You chose the same main route for every farmer so far. What would have to change about the farmer for a different route to win?' : 'Your main route changed between farmers. That is the point: the answer depends on the farmer, the crop and the season.')];
    } else {
      cmp = h('p', null, 'Try a second farmer to compare plans. Different farmers usually need different routes.');
    }
    var ta = h('textarea', { id: 'summary', readonly: true, 'aria-label': 'Summary of your plans, to copy' }); ta.value = summaryText();
    return h('div', null,
      heading('Debrief: ' + f.name),
      h('p', null, f.wholeNote),
      h('h2', null, 'The full fit map'),
      h('p', null, 'No route is best for everything. Here is every route for ' + f.name + ', so you can compare it with your choice.'),
      tableWrap('Fit map of all routes', map),
      h('h2', null, 'Against the needs that matter most'),
      list(derived),
      h('h2', null, 'Behind the choice: eight sector functions'),
      h('p', null, 'The routes depend on different parts of the seed sector. A route that fits a farmer well may rely on functions that are weak in a real place.'),
      tableWrap('Sector function lens', fnTable),
      h('h2', null, 'Reflect'), h('ol', null, D.prompts.map(function (t) { return h('li', null, t); })),
      h('h2', null, 'Compare across farmers'), cmp,
      h('h2', null, 'Summary to copy'), ta,
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn alt', onclick: function () { copy(ta); } }, 'Copy summary'),
        h('button', { type: 'button', class: 'btn', onclick: function () { go('start'); } }, 'Try another farmer'),
        h('button', { type: 'button', class: 'btn alt', onclick: function () { state.plans[f.id] = { main: null, backup: null, disruption: null }; save(); go('routes'); announce('Plan cleared for ' + f.name); } }, 'Replan ' + f.name)),
      facPanel('debrief'));
  }
  function copy(ta) {
    try { ta.select(); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value); else document.execCommand('copy'); announce('Summary copied.'); }
    catch (e) { announce('Select the text and copy it manually.'); }
  }

  function screenAbout() {
    var reg = [
      ['Route descriptions (can meet, watch for, check)', 'General statements written by the pilot author from general seed-systems knowledge and the ISSD framing in the V2.0 concept note.', 'Unverified'],
      ['Ratings in the fit grids', 'Qualitative judgements for each invented farmer. Not measured data.', 'Unverified. Fictional'],
      ['Stress-test results', 'Qualitative reasoning about each route under each disruption. No probabilities.', 'Unverified'],
      ['Route to sector function mapping', 'Simplified by the author using the eight functions in the V2.0 concept note.', 'Unverified. Simplified'],
      ['Farmers, places, seasons', 'Invented. They do not describe real people or places.', 'Fictional by design'],
      ['Statements on hybrids and saved seed', 'General agronomic statements.', 'Verify with a seed-systems expert']
    ];
    return h('div', null,
      heading('About, rubric and sources'),
      h('p', { class: 'fiction' }, D.meta.status + ' Version ' + D.meta.version + '. Linked to: ' + D.meta.module + '.'),
      h('h2', null, 'How feedback works (rubric)'),
      list([
        'No points, no totals, no probabilities, no yield numbers.',
        'Each route is described against five needs: timing, cash and cost, fit to crop and wishes, quality information, reach and quantity.',
        'Four levels, always shown with a symbol and words: ● meets the need, ◐ partly meets, ○ does not meet well, ? not known.',
        'Each farmer has a different set of needs that matter most. The same route can fit one farmer and not another.',
        '"Together" combines your main and back-up routes: well covered if any chosen route meets the need, partly if any partly meets it, not known if only unknowns remain, still open otherwise.',
        'The stress test describes how a route holds up in words: holds up, under strain, exposed, or depends.'
      ]),
      h('h2', null, 'Source register'),
      tableWrap('Source register', h('table', null, h('caption', null, 'Where each kind of content comes from and its status'),
        h('thead', null, h('tr', null, ['Content', 'Basis', 'Status'].map(function (c) { return h('th', { scope: 'col' }, c); }))),
        h('tbody', null, reg.map(function (r) { return h('tr', null, r.map(function (c, i) { return h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : null, c); })); })))),
      h('p', null, 'Review needed before any release: a seed-systems expert should check all generic statements, and the course team should decide on learner group and depth.'),
      h('h2', null, 'Accessibility and privacy'),
      list(['Works with keyboard only. No drag and drop.', 'Respects reduced-motion settings. Symbols and words, not colour alone.', 'No data leaves your device. Saving is optional and off by default.']),
      h('button', { type: 'button', class: 'btn', onclick: function () { go(state.farmerId ? 'meet' : 'start'); } }, 'Back to the activity'));
  }

  /* ---------- render ---------- */
  var aboutOpen = false;
  function render(keepFocus) {
    var s = state.screen;
    var el;
    if (aboutOpen) el = screenAbout();
    else if (s === 'meet') el = screenMeet();
    else if (s === 'routes') el = screenRoutes();
    else if (s === 'stress') el = screenStress();
    else if (s === 'report') el = screenReport();
    else if (s === 'debrief') el = screenDebrief();
    else el = screenStart();
    var y = window.scrollY, active = document.activeElement && document.activeElement.id;
    $app.innerHTML = '';
    $app.appendChild(el);
    renderSteps();
    var hh = document.getElementById('h1');
    document.title = (hh ? hh.textContent + ' · ' : '') + 'G01 seed choices';
    if (keepFocus === true) {
      window.scrollTo(0, y);
      if (active && document.getElementById(active)) document.getElementById(active).focus();
    } else {
      if (hh) hh.focus();
      window.scrollTo(0, 0);
      announce(hh ? hh.textContent : '');
    }
  }

  /* ---------- wire up footer ---------- */
  document.getElementById('btn-about').addEventListener('click', function () { aboutOpen = true; render(); });
  document.getElementById('btn-reset').addEventListener('click', resetAll);
  var bf = document.getElementById('btn-fac');
  bf.setAttribute('aria-pressed', state.facilitator ? 'true' : 'false');
  bf.addEventListener('click', function () { state.facilitator = !state.facilitator; bf.setAttribute('aria-pressed', state.facilitator ? 'true' : 'false'); render(true); announce('Facilitator notes ' + (state.facilitator ? 'on' : 'off')); });
  var origGo = go;
  go = function (s) { aboutOpen = false; origGo(s); };

  load();
  render();
  window.__g01 = { state: state, go: function (s) { go(s); }, pick: pickFarmer, setRole: setRole };
})();
