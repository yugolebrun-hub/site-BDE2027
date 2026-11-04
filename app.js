(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const D = window.NETRA || {};
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const hasGsap = () => window.gsap && window.ScrollTrigger;
  const rich = matchMedia('(min-width: 60rem) and (pointer: fine)').matches;
  const small = matchMedia('(max-width: 40rem)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const seeded = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const between = (r, a, b) => a + r() * (b - a);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } } };

  /* ---------- leaves ---------- */
  const lanceD = (l, w) => `M0 0C${w} ${-l * 0.22} ${w * 0.85} ${-l * 0.7} 0 ${-l}C${-w * 0.85} ${-l * 0.7} ${-w} ${-l * 0.22} 0 0Z`;
  const lance = (g, l, w) => { el('path', { d: lanceD(l, w), class: 'leaf' }, g); el('path', { d: `M0 0Q${w * 0.08} ${-l * 0.5} 0 ${-l * 0.96}`, class: 'vein' }, g); };
  const frond = (g, l, w, r) => {
    const bend = (r() - 0.5) * l * 0.5;
    el('path', { d: `M0 0Q${bend} ${-l / 2} 0 ${-l}`, class: 'vine', 'stroke-width': 4 }, g);
    for (let i = 2; i <= 9; i++) {
      const t = i / 10, x = bend * 2 * t * (1 - t), y = -l * t;
      const ang = (Math.atan2(bend * 2 * (1 - 2 * t), l) * 180) / Math.PI, len = w * (1.15 - t * 0.8);
      for (const side of [-1, 1]) el('path', { d: lanceD(len, len * 0.18), class: 'leaf', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side * 58).toFixed(1)})` }, g);
    }
  };
  const fan = (g, l) => { for (let i = 0; i < 7; i++) { const a = -74 + (148 * i) / 6; el('path', { d: lanceD(l * (0.72 + 0.28 * Math.cos((a * Math.PI) / 180)), l * 0.13), class: 'leaf', transform: `rotate(${a.toFixed(1)})` }, g); } };

  /* hero jungle: two planes, each split so it can part as you walk in */
  const clear = { x: 800, y: 440, rx: 480, ry: 330 };
  const fit = (x, y, ang, l) => { const rad = (ang * Math.PI) / 180; while (l > 140) { const tx = x + Math.sin(rad) * l, ty = y - Math.cos(rad) * l; if (((tx - clear.x) / clear.rx) ** 2 + ((ty - clear.y) / clear.ry) ** 2 > 1) break; l *= 0.9; } return l; };
  const anchors = {
    2: [[-40, 900, 40], [-60, 600, 76], [-50, 260, 112], [1640, 900, -40], [1660, 600, -76], [1650, 260, -112], [430, 960, 14], [1170, 960, -14], [520, -50, 168], [1080, -50, -168]],
    1: [[-120, 980, 48], [-140, 560, 82], [-110, 80, 132], [1720, 980, -48], [1740, 560, -82], [1710, 80, -132]],
  };
  const size = { 2: [360, 560], 1: [440, 640] };
  const halves = [];
  $$('.hero .jungle__layer').forEach((svg) => {
    const depth = +svg.dataset.depth, r = seeded(13 * depth);
    const left = el('g', {}, svg), right = el('g', {}, svg);
    halves.push({ left, right, depth });
    anchors[depth].forEach(([x, y, base], idx) => {
      if (small && idx % 2) return;
      for (let i = 0; i < (depth === 2 && !small ? 2 : 1); i++) {
        const ang = base + between(r, -22, 22), l = fit(x, y, ang, between(r, ...size[depth]));
        const outer = el('g', { transform: `translate(${x} ${y}) rotate(${ang.toFixed(1)})` }, x < 800 ? left : right);
        const g = depth === 1 ? el('g', { class: 'sway', style: `--sway:${between(r, 1, 2.5).toFixed(2)}deg;--sway-dur:${between(r, 7, 11).toFixed(1)}s;--sway-delay:${between(r, -8, 0).toFixed(1)}s` }, outer) : outer;
        const k = r();
        if (k < 0.4 && !small) frond(g, l, l * 0.34, r); else if (k < 0.75) lance(g, l, l * between(r, 0.16, 0.24)); else fan(g, l * 0.8);
      }
    });
    if (depth === 2) for (let i = 0; i < (small ? 2 : 4); i++) {
      const x = between(r, 140, 1460), drop = between(r, 160, 340), sw = between(r, -60, 60);
      const g = el('g', { transform: `translate(${x.toFixed(0)} -20)` }, x < 800 ? left : right);
      const path = el('path', { d: `M0 0C${sw} ${drop * 0.35} ${-sw} ${drop * 0.7} ${sw * 0.4} ${drop}`, class: 'vine', 'stroke-width': 3 }, g);
      const len = path.getTotalLength();
      for (let t = 0.24; t < 1; t += 0.22) { const p = path.getPointAtLength(len * t); el('path', { d: lanceD(between(r, 26, 40), 9), class: 'leaf', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(r() > 0.5 ? 1 : -1) * between(r, 110, 150)})` }, g); }
    }
  });

  /* still fringes: under the banners and the vote */
  $$('[data-fringe]').forEach((svg, n) => {
    const r = seeded(97 + n * 7);
    for (let x = -40; x < 1680; x += between(r, small ? 140 : 80, small ? 200 : 130)) {
      const ang = between(r, -35, 35), l = between(r, 220, 420);
      const g = el('g', { transform: `translate(${x.toFixed(0)} 620) rotate(${ang.toFixed(1)})` }, svg);
      r() < 0.4 && !small ? frond(g, l, l * 0.3, r) : lance(g, l, l * 0.2);
    }
  });

  /* a cluster in the corner of each path card */
  $$('[data-leaves]').forEach((svg) => {
    const r = seeded(31 * +svg.dataset.leaves);
    for (let i = 0; i < 4; i++) {
      const g = el('g', { transform: `translate(${between(r, 300, 420).toFixed(0)} ${between(r, -20, 60).toFixed(0)}) rotate(${between(r, 190, 250).toFixed(0)})` }, svg);
      r() < 0.5 ? frond(g, between(r, 160, 260), 70, r) : lance(g, between(r, 160, 240), 40);
    }
  });

  /* ---------- the eyes ---------- */
  const art = document.getElementById('eyes-art');
  const looks = $$('.eye__look', art);
  if (motion) art.classList.add('is-closed');
  const blink = () => { art.classList.remove('is-blinking'); void art.getBoundingClientRect(); art.classList.add('is-blinking'); };
  art.addEventListener('animationend', (e) => { if (e.animationName === 'blink') art.classList.remove('is-blinking'); });

  if (motion) {
    const anchor = $('.hero__eyes') || $('.banner__eyes') || $('.vote__eyes');
    let raf = 0, px = innerWidth / 2, py = innerHeight * 0.2;
    const look = () => {
      raf = 0;
      if (!anchor) return;
      const b = anchor.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const dx = clamp((px - cx) / (innerWidth / 2), -1, 1), dy = clamp((py - cy) / (innerHeight / 2), -1, 1);
      /* the closer you come, the tighter the iris draws in */
      const near = clamp(Math.hypot(px - cx, py - cy) / (innerWidth * 0.45));
      const k = (0.86 + near * 0.2).toFixed(3);
      looks.forEach((g, i) => { const sx = i ? -dx : dx; g.style.transform = `translate(${(sx * 12).toFixed(1)}px, ${(dy * 6).toFixed(1)}px) scale(${k})`; });
    };
    addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(look); }, { passive: true });
    look();
    $$('.btn, .nav__cta, .path').forEach((b) => {
      const on = () => art.classList.add('is-squint'), off = () => art.classList.remove('is-squint');
      b.addEventListener('pointerenter', on); b.addEventListener('pointerleave', off);
      b.addEventListener('focus', on); b.addEventListener('blur', off);
    });
  }

  /* ---------- the hero loop ---------- */
  const hero = $('[data-loop]');
  let nextBlinkTimer = 0;
  const nextBlink = () => { clearTimeout(nextBlinkTimer); nextBlinkTimer = setTimeout(() => { blink(); nextBlink(); }, 6000 + Math.random() * 6000); };
  if (hero) {
    const canvas = $('.fireflies', hero);
    const flies = rich && motion;
    let draw = () => {};
    if (flies) {
      const ctx = canvas.getContext('2d');
      const color = getComputedStyle(root).getPropertyValue('--color-firefly').trim();
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 32;
      const sc = sprite.getContext('2d'), grad = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, color); grad.addColorStop(0.18, color); grad.addColorStop(1, 'transparent');
      sc.fillStyle = grad; sc.fillRect(0, 0, 32, 32);
      const r = seeded(5);
      const list = Array.from({ length: 20 }, () => ({ x: r(), y: r(), a: r() * Math.PI * 2, s: between(r, 0.00012, 0.00035), p: r() * Math.PI * 2, z: between(r, 14, 26) }));
      const resize = () => { const d = Math.min(devicePixelRatio || 1, 1.5); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
      resize(); addEventListener('resize', resize);
      draw = (t) => {
        const w = canvas.clientWidth, hh = canvas.clientHeight;
        ctx.clearRect(0, 0, w, hh);
        for (const f of list) {
          f.a += Math.sin(t / 2000 + f.p) * 0.02;
          f.x = (f.x + Math.cos(f.a) * f.s + 1) % 1; f.y = (f.y + Math.sin(f.a) * f.s * 0.7 + 1) % 1;
          ctx.globalAlpha = 0.2 + 0.8 * Math.max(0, Math.sin(t / 1100 + f.p * 3));
          ctx.drawImage(sprite, f.x * w - f.z / 2, f.y * hh - f.z / 2, f.z, f.z);
        }
        ctx.globalAlpha = 1;
      };
    }
    const toggle = $('[data-loop-toggle]', hero);
    const state = { seen: true, held: !motion };
    let frame = 0;
    const tick = (t) => { draw(t); frame = requestAnimationFrame(tick); };
    const sync = () => {
      const run = state.seen && !state.held;
      hero.classList.toggle('is-running', run);
      cancelAnimationFrame(frame); clearTimeout(nextBlinkTimer);
      if (run) { if (flies) frame = requestAnimationFrame(tick); nextBlink(); }
      toggle.textContent = state.held ? 'Lecture' : 'Pause';
      toggle.setAttribute('aria-pressed', String(state.held));
    };
    toggle.addEventListener('click', () => { state.held = !state.held; sync(); });
    new IntersectionObserver(([e]) => { state.seen = e.isIntersecting; sync(); }).observe(hero);
  } else if (motion) nextBlink();

  /* ---------- nav ---------- */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menuBtn = $('[data-menu-toggle]');
  if (menuBtn) {
    const list = $('#nav-list');
    const set = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); list.classList.toggle('is-open', open); };
    menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- the curtain: the eyes close between pages ---------- */
  const curtain = $('.curtain');
  if (motion && curtain) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
      const href = a.getAttribute('href');
      if (!/^[\w-]+\.html(#.*)?$/.test(href) || href.split('#')[0] === location.pathname.split('/').pop()) return;
      e.preventDefault();
      curtain.classList.remove('is-gone');
      curtain.classList.add('is-on');
      art.classList.add('is-closed');
      store.set('netra-curtain', '1');
      setTimeout(() => { location.href = href; }, 380);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { curtain.classList.remove('is-on'); art.classList.remove('is-closed'); } });
  }

  /* ---------- data into the pages ---------- */
  if (D.instagram) {
    const url = `https://www.instagram.com/${D.instagram.replace(/^@/, '')}/`;
    $$('[data-insta]').forEach((li) => { li.hidden = false; });
    $$('[data-insta-link]').forEach((a) => { a.href = url; a.rel = 'noopener'; });
    $$('[data-fill="instagram"]').forEach((s) => { const a = h('a', null, '@' + D.instagram.replace(/^@/, '')); a.href = url; s.replaceWith(a); });
  }

  /* team names */
  $$('[data-key]').forEach((node) => {
    const names = (D.equipe || {})[node.dataset.key] || [];
    if (!names.length) return;
    const ul = h('ul', 'node__names');
    names.forEach((n) => ul.appendChild(h('li', null, n)));
    node.appendChild(ul);
  });

  /* programme */
  const axes = $('[data-programme]');
  if (axes && (D.programme || []).length) {
    axes.textContent = '';
    D.programme.forEach((a, i) => {
      const art2 = h('article', 'axis');
      const head = h('div');
      head.append(h('p', 'axis__num', String(i + 1).padStart(2, '0')), h('h2', null, a.titre || ''));
      if (a.phrase) head.append(h('p', 'axis__phrase', a.phrase));
      const list = h('ul', 'axis__list');
      (a.mesures || []).forEach((m) => list.appendChild(h('li', null, m)));
      art2.append(head, list);
      axes.appendChild(art2);
    });
  }

  /* campaign timeline and clips */
  const tl = $('[data-timeline]');
  const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmtDate = (s) => { const d = new Date(s + 'T12:00:00'); return isNaN(d) ? s : d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); };
  if (tl && (D.campagne || []).length) {
    tl.textContent = '';
    const today = isoDay(new Date());
    let nextMarked = false;
    D.campagne.forEach((ev) => {
      const li = h('li', 'timeline__item');
      if (ev.date < today) li.classList.add('is-past');
      else if (!nextMarked) { li.classList.add('is-next'); nextMarked = true; }
      const t = h('time', 'timeline__date', fmtDate(ev.date)); t.dateTime = ev.date;
      const body = h('div'); body.append(h('p', 'timeline__title', ev.titre || ''));
      if (ev.texte) body.append(h('p', 'timeline__text', ev.texte));
      li.append(t, body); tl.appendChild(li);
    });
  }
  const clips = $('[data-clips]');
  if (clips && (D.clips || []).length) {
    const grid = $('[data-clips-grid]', clips);
    D.clips.forEach((c) => {
      const fig = h('figure', 'clip');
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.youtube)}`;
      f.title = c.titre || 'Clip Netra'; f.loading = 'lazy'; f.allow = 'encrypted-media; picture-in-picture'; f.allowFullscreen = true;
      fig.append(f, h('figcaption', null, c.titre || ''));
      grid.appendChild(fig);
    });
    clips.hidden = false;
  }

  /* countdowns */
  if (D.voteDate) {
    const end = new Date(D.voteDate).getTime();
    $$('[data-countdown]').forEach((cd) => {
      const grid = $('.countdown__grid', cd);
      $('.countdown__empty', cd).hidden = true; grid.hidden = false;
      const units = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
      const upd = () => { let left = Math.max(0, end - Date.now()); for (const u of ['d', 'h', 'm', 's']) { const v = Math.floor(left / units[u]); left -= v * units[u]; $(`[data-unit="${u}"]`, grid).textContent = String(v).padStart(2, '0'); } };
      upd(); setInterval(upd, 1000);
    });
  }

  /* ---------- the breakfast order ---------- */
  const form = $('[data-order]');
  if (form) {
    const P = D.petitdej || {};
    const menu = P.menu || [], max = P.max || 6;
    const qty = Object.fromEntries(menu.map((m) => [m.id, 0]));
    const euro = (v) => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    const list = $('[data-menu]', form);
    menu.forEach((m) => {
      const row = h('div', 'item');
      const info = h('div');
      const name = h('span', 'item__name', m.nom); name.id = `it-${m.id}`;
      info.append(name);
      if (m.detail) info.append(h('span', 'item__detail', m.detail));
      if (m.prix != null) info.append(h('span', 'item__price', euro(m.prix)));
      const st = h('div', 'stepper'); st.setAttribute('role', 'group'); st.setAttribute('aria-labelledby', name.id);
      const minus = h('button', null, '−'), out = h('output', null, '0'), plus = h('button', null, '+');
      minus.type = plus.type = 'button';
      minus.setAttribute('aria-label', `Retirer un ${m.nom}`); plus.setAttribute('aria-label', `Ajouter un ${m.nom}`);
      out.setAttribute('aria-live', 'polite');
      const upd = () => { out.textContent = qty[m.id]; out.classList.toggle('is-set', qty[m.id] > 0); minus.disabled = qty[m.id] === 0; plus.disabled = qty[m.id] >= max; summary(); };
      minus.addEventListener('click', () => { qty[m.id] = Math.max(0, qty[m.id] - 1); upd(); });
      plus.addEventListener('click', () => { qty[m.id] = Math.min(max, qty[m.id] + 1); upd(); });
      st.append(minus, out, plus);
      row.append(info, st); list.appendChild(row);
      minus.disabled = true;
    });

    const slots = $('[data-slots]', form);
    slots.appendChild(new Option('Choisis un créneau', ''));
    (P.creneaux || []).forEach((c) => slots.appendChild(new Option(c, c)));
    const day = $('#o-day');
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    day.min = isoDay(new Date()); day.value = isoDay(tomorrow);

    const open = P.ouvert && P.endpoint;
    const status = $('[data-order-status]');
    if (open) { status.textContent = 'Les commandes sont ouvertes.'; status.classList.add('is-open'); }

    const sumList = $('[data-summary]'), total = $('[data-total]'), where = $('[data-where]'), help = $('[data-order-help]'), send = $('[data-send]');
    function summary() {
      sumList.textContent = '';
      const chosen = menu.filter((m) => qty[m.id] > 0);
      if (!chosen.length) sumList.appendChild(h('li', 'summary__empty', 'Rien pour l’instant.'));
      chosen.forEach((m) => { const li = h('li'); li.append(h('span', null, `${qty[m.id]} × ${m.nom}`), h('span', null, m.prix != null ? euro(m.prix * qty[m.id]) : '')); sumList.appendChild(li); });
      const priced = chosen.length && chosen.every((m) => m.prix != null);
      total.hidden = !priced;
      if (priced) total.textContent = `Total ${euro(chosen.reduce((s, m) => s + m.prix * qty[m.id], 0))}`;
      const bat = $('#o-bat').value.trim(), room = $('#o-room').value.trim();
      const bits = [day.value && fmtDate(day.value), slots.value, bat && `bâtiment ${bat}`, room && `chambre ${room}`].filter(Boolean);
      where.textContent = bits.length ? `Livraison : ${bits.join(', ')}` : '';
    }
    form.addEventListener('input', summary);
    summary();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      help.textContent = '';
      const fields = $$('input[required], select[required]', form);
      fields.forEach((f) => f.removeAttribute('aria-invalid'));
      const bad = fields.filter((f) => !f.value.trim());
      if (!Object.values(qty).some((v) => v > 0)) { help.textContent = 'Ajoute au moins un article à ta commande.'; list.querySelector('button:not(:disabled)')?.focus(); return; }
      if (bad.length) { bad.forEach((f) => f.setAttribute('aria-invalid', 'true')); help.textContent = 'Il manque des informations pour la livraison.'; bad[0].focus(); return; }
      if (!open) { help.textContent = 'Les commandes ne sont pas encore ouvertes : rien n’a été envoyé.'; return; }
      const body = Object.fromEntries(new FormData(form));
      body.articles = menu.filter((m) => qty[m.id] > 0).map((m) => ({ id: m.id, nom: m.nom, quantite: qty[m.id] }));
      send.disabled = true; send.setAttribute('aria-busy', 'true');
      fetch(P.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then((r) => { help.textContent = r.ok ? 'Commande reçue. On te livre au créneau choisi.' : 'La commande n’est pas passée. Réessaie dans une minute.'; })
        .catch(() => { help.textContent = 'La commande n’est pas passée. Réessaie dans une minute.'; })
        .finally(() => { send.disabled = false; send.removeAttribute('aria-busy'); });
    });
  }

  /* ---------- manifesto words ---------- */
  const words = [];
  $$('[data-words]').forEach((p) => {
    const text = p.textContent;
    p.textContent = ''; p.setAttribute('aria-label', text);
    text.split(/(\s+)/).forEach((part) => {
      if (/^\s+$/.test(part)) { p.appendChild(document.createTextNode(part)); return; }
      const s = h('span', 'w', part); s.setAttribute('aria-hidden', 'true');
      if (/netra|œil/i.test(part)) s.classList.add('is-key');
      p.appendChild(s); words.push(s);
    });
  });
  const light = (pr) => { const n = Math.round(pr * words.length); words.forEach((w, i) => w.classList.toggle('is-lit', i < n)); };

  /* ---------- the vine tree ---------- */
  const tree = $('[data-tree]');
  let growth = 1, setGrowth = () => {}, drawTree = () => {};
  if (tree) {
    const vines = $('.tree__vines', tree), top = $('[data-node="root"]', tree);
    const nodes = $$('.node:not([data-node="root"])', tree);
    let paths = [];
    setGrowth = () => {
      nodes.forEach((node, i) => {
        const local = clamp((growth - (i / nodes.length) * 0.55) / 0.45);
        const v = paths[i];
        if (v) { v.path.style.strokeDashoffset = ((1 - local) * v.len).toFixed(1); v.leaves.forEach((l) => { l.style.opacity = local > 0.6 ? 1 : 0; }); }
        const on = local >= 0.98;
        if (on && !node.classList.contains('is-on')) { node.classList.add('is-on', 'is-flash'); setTimeout(() => node.classList.remove('is-flash'), 600); }
        if (!on) node.classList.remove('is-on');
      });
      top.classList.add('is-on');
    };
    drawTree = () => {
      vines.textContent = ''; paths = [];
      if (small) return setGrowth();
      const tb = tree.getBoundingClientRect(), rb = top.getBoundingClientRect();
      const rx = rb.left + rb.width / 2 - tb.left, ry = rb.bottom - tb.top, rr = seeded(23);
      nodes.forEach((n, i) => {
        const b = n.getBoundingClientRect(), nx = b.left + b.width / 2 - tb.left, ny = b.top - tb.top, mid = ry + (ny - ry) * 0.5;
        const g = el('g', {}, vines);
        const path = el('path', { d: `M${rx.toFixed(1)} ${ry.toFixed(1)}C${rx.toFixed(1)} ${(mid + 30).toFixed(1)} ${nx.toFixed(1)} ${(mid - 30).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`, class: 'vine-path' }, g);
        const len = path.getTotalLength();
        path.style.strokeDasharray = len.toFixed(1);
        const leaves = [0.35, 0.62, 0.85].map((t) => {
          const p = path.getPointAtLength(len * t), q = path.getPointAtLength(Math.min(len, len * t + 1));
          const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + (rr() > 0.5 ? 60 : -60);
          return el('path', { d: lanceD(18, 6), class: 'vine-leaf', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(ang + 90).toFixed(1)})` }, g);
        });
        paths[i] = { path, leaves, len };
      });
      setGrowth();
    };
    const lit = (i, on) => { top.classList.toggle('is-lit', on); const v = paths[i]; if (!v) return; v.path.classList.toggle('is-lit', on); v.leaves.forEach((l) => l.classList.toggle('is-lit', on)); };
    nodes.forEach((n, i) => {
      n.addEventListener('pointerenter', () => lit(i, true)); n.addEventListener('pointerleave', () => lit(i, false));
      n.addEventListener('focus', () => lit(i, true)); n.addEventListener('blur', () => lit(i, false));
    });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawTree, 150); });
  }

  /* ---------- motion ---------- */
  const start = () => {
    if (!motion || !hasGsap()) { drawTree(); light(1); art.classList.remove('is-closed'); root.classList.remove('from-curtain'); const i = $('.intro'); if (i) i.remove(); return; }
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    /* arrival: the full intro on the home page, a quick opening elsewhere */
    const intro = $('.intro');
    const fromCurtain = store.get('netra-curtain') === '1';
    store.set('netra-curtain', '0');
    if (intro && !fromCurtain) {
      setTimeout(() => art.classList.remove('is-closed'), 500);
      gsap.to(intro, { opacity: 0, duration: 0.6, delay: 1.25, ease: 'power2.in', onComplete: () => intro.remove() });
    } else {
      if (intro) intro.remove();
      setTimeout(() => art.classList.remove('is-closed'), 120);
      setTimeout(() => { curtain.classList.add('is-gone'); root.classList.remove('from-curtain'); }, 520);
    }
    const delay = intro && !fromCurtain ? 1.2 : 0.4;

    if (hero) {
      gsap.from('.hero__gaze', { scale: 0.86, opacity: 0, duration: 1.2, delay, ease: 'expo.out' });
      gsap.from('.hero .lead, .hero .actions', { y: 24, opacity: 0, duration: 0.9, delay: delay + 0.5, stagger: 0.1, ease: 'expo.out' });
      const layers = $$('.hero .jungle__layer');
      if (rich) {
        const movers = layers.map((l) => ({ x: gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3.out' }), k: 3 - +l.dataset.depth }));
        addEventListener('pointermove', (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; movers.forEach((m) => { m.x(-nx * 16 * m.k); m.y(-ny * 10 * m.k); }); }, { passive: true });
      }
      const walk = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      halves.forEach(({ left, right, depth }) => { const d = depth === 1 ? 620 : 380; walk.to(left, { x: -d, ease: 'power1.in' }, 0).to(right, { x: d, ease: 'power1.in' }, 0); });
      walk.to('.hero .wordmark-neon, .hero .lead, .hero .actions', { opacity: 0, y: -30, ease: 'none', duration: 0.35 }, 0)
        .to('.hero__gaze', { scale: 1.9, ease: 'power1.in', duration: 0.75 }, 0)
        .to('.hero__gaze', { opacity: 0, ease: 'none', duration: 0.3 }, 0.5)
        .to('.hero__veil', { opacity: 1, ease: 'none', duration: 0.35 }, 0.65);
    }

    $$('.banner__inner').forEach((b) => gsap.from(b.children, { y: 40, opacity: 0, duration: 1.1, delay, stagger: 0.12, ease: 'expo.out' }));
    $$('.banner .jungle__layer').forEach((l) => gsap.from(l, { yPercent: 25, duration: 1.6, delay: delay - 0.2, ease: 'expo.out' }));

    $$('.ribbon__row').forEach((row) => {
      const dir = +row.dataset.dir;
      gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -30 }, { xPercent: dir < 0 ? -30 : 0, ease: 'none', scrollTrigger: { trigger: '.ribbon', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    });

    if (words.length) ScrollTrigger.create({ trigger: '.manifesto', start: 'top 75%', end: 'center 50%', scrub: true, onUpdate: (s) => light(s.progress) });

    if ($('.paths')) gsap.from('.path', { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.paths', start: 'top 80%' } });
    $$('.explore__title, .timeline-sec h2, .clips h2, .pd-steps h2, .countdown-band h2').forEach((t) => gsap.from(t, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } }));
    $$('.axis, .timeline__item, .steps li, .item').forEach((t) => gsap.from(t, { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } }));

    if (tree) {
      tree.classList.add('is-anim');
      growth = 0; drawTree();
      const g = { v: 0 };
      gsap.to(g, { v: 1, ease: 'none', onUpdate: () => { growth = g.v; setGrowth(); }, scrollTrigger: { trigger: tree, start: 'top 70%', end: 'bottom 80%', scrub: 0.6 } });
    }

    if ($('.vote')) {
      gsap.from('.vote__eyes', { opacity: 0, scale: 0.7, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.vote', start: 'top 70%', onEnter: () => setTimeout(blink, 700) } });
      gsap.from('.vote h2', { y: 40, opacity: 0, duration: 1.2, delay: 0.2, ease: 'expo.out', scrollTrigger: { trigger: '.vote', start: 'top 70%' } });
    }

    document.fonts && document.fonts.ready.then(() => { drawTree(); ScrollTrigger.refresh(); });
  };

  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();
