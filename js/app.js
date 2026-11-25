(() => {
  'use strict';

  const API_BASE = 'https://phim.maniakov.bond';
  const CF_DOWN = 'https://speed.cloudflare.com/__down';
  const CF_UP = 'https://speed.cloudflare.com/__up';

  const THEME_PRESETS = [
    { id: 'webos-midnight', name: 'ManiFlix TV Tối', mode: 'dark', accent: '#FA2D48', bg: '#0b0f19', surface: '#151b2b' },
    { id: 'oled-black', name: 'OLED Đen Tuyền', mode: 'oled', accent: '#FA2D48', bg: '#000000', surface: '#121216' },
    { id: 'midnight-indigo', name: 'Midnight Indigo', mode: 'custom', accent: '#5E5CE6', bg: '#0B1020', surface: '#151C32' },
    { id: 'forest-emerald', name: 'Forest Emerald', mode: 'custom', accent: '#30D158', bg: '#0B1612', surface: '#14241D' },
    { id: 'cyberpunk-rose', name: 'Cyberpunk Rose', mode: 'custom', accent: '#FF2D55', bg: '#16091A', surface: '#26112E' },
    { id: 'pure-light', name: 'Sáng TV', mode: 'light', accent: '#FA2D48', bg: '#F2F3F7', surface: '#FFFFFF' }
  ];

  const ACCENT_PRESETS = [
    { id: 'crimson', name: 'Đỏ', hex: '#FA2D48' },
    { id: 'amber', name: 'Cam', hex: '#FF6448' },
    { id: 'sky', name: 'Xanh dương', hex: '#0A84FF' },
    { id: 'violet', name: 'Tím', hex: '#5E5CE6' },
    { id: 'emerald', name: 'Xanh lá', hex: '#30D158' }
  ];

  const CATEGORIES = [
    { id: 'all', label: 'Tất cả' },
    { id: 'cat:phim-bo', label: 'Phim bộ' },
    { id: 'cat:phim-le', label: 'Phim lẻ' },
    { id: 'cat:hoat-hinh', label: 'Hoạt hình' },
    { id: 'cat:tv-shows', label: 'TV Shows' },
    { id: 'genre:hanh-dong', label: 'Hành động' },
    { id: 'genre:co-trang', label: 'Cổ trang' },
    { id: 'genre:tinh-cam', label: 'Tình cảm' },
    { id: 'genre:kinh-di', label: 'Kinh dị' },
    { id: 'genre:vien-tuong', label: 'Viễn tưởng' }
  ];

  const KBD_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SPACE', 'DEL', 'CLEAR', 'SEARCH']
  ];

  const IMG_FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="#141926"/><rect x="64" y="114" width="72" height="52" rx="8" fill="none" stroke="#3f4659" stroke-width="4"/><polygon points="92,130 116,140 92,150" fill="#525b70"/></svg>'
    );

  function svgIcon(name, size) {
    const s = size || 18;
    const paths = {
      play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
      pause: '<rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
      bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
      eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
      back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      forward: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
      chevLeft: '<polyline points="15 18 9 12 15 6"/>',
      chevRight: '<polyline points="9 18 15 12 9 6"/>',
      chevUp: '<polyline points="18 15 12 9 6 15"/>',
      chevDown: '<polyline points="6 9 12 15 18 9"/>',
      cloudUp: '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
      close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      prev: '<polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/><line x1="5" y1="19" x2="5" y2="5"/>',
      next: '<polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/><line x1="19" y1="5" x2="19" y2="19"/>',
      rew: '<polygon points="11 19 2 12 11 5 11 19" fill="currentColor"/><polygon points="22 19 13 12 22 5 22 19" fill="currentColor"/>',
      ff: '<polygon points="13 19 22 12 13 5 13 19" fill="currentColor"/><polygon points="2 19 11 12 2 5 2 19" fill="currentColor"/>',
      list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
      user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
      trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      backspace: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>'
    };
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">' + (paths[name] || '') + '</svg>';
  }

  function safeJsonParse(str, fallback) {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  const state = {
    tab: 'discover',
    detailSlug: null,
    detailStack: [],
    detailData: null,
    detailFranchise: [],
    detailRelated: [],
    selectedServerIdx: 0,
    franchiseExpanded: true,
    settingsSubPage: 'main',
    librarySeg: 'history',
    category: 'all',
    heroIdx: 0,
    heroMovies: [],
    discoverPage: 1,
    categoryPage: 1,
    loadingMore: false,
    seriesMovies: [],
    singleMovies: [],
    animeMovies: [],
    filteredMovies: [],
    searchQuery: '',
    searchResults: [],
    searchPage: 1,
    token: localStorage.getItem('mf.token') || '',
    user: null,
    history: safeJsonParse(localStorage.getItem('mf.history'), []),
    favorites: [],
    blocked: safeJsonParse(localStorage.getItem('mf.blocked'), []),
    prefs: Object.assign({
      themeMode: 'dark',
      presetId: 'webos-midnight',
      accent: '#FA2D48',
      bg: '#0b0f19',
      surface: '#151b2b',
      ambient: true,
      ultraSmooth: true,
      autoCutAds: true,
      introSkip: 'button',
      autoNext: true
    }, safeJsonParse(localStorage.getItem('mf.prefs'), {})),
    monitor: {
      testing: false,
      source: 'Chưa đo',
      dlMbps: 0,
      ulMbps: 0,
      pingMs: 0,
      jitterMs: 0,
      netStats: null,
      dlSeries: [],
      ulSeries: [],
      pingSeries: [],
      serverCpuSeries: []
    },
    player: null,
    lastFocusKey: 'nav:discover'
  };

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    const step = img.getAttribute('data-fb-step') || '0';
    const altSrc = img.getAttribute('data-fallback');
    if (step === '0' && altSrc && img.src !== altSrc) {
      img.setAttribute('data-fb-step', '1');
      img.src = altSrc;
    } else if (step !== '2') {
      img.setAttribute('data-fb-step', '2');
      img.src = IMG_FALLBACK_SVG;
    }
  }, true);

  function hexToRgba(hex, alpha) {
    const h = String(hex || '#FA2D48').replace('#', '');
    if (h.length !== 6) return 'rgba(250,45,72,' + alpha + ')';
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function hexLuminance(hex) {
    const h = String(hex || '#0b0f19').replace('#', '');
    if (h.length !== 6) return 0;
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function resolvedPalette() {
    const p = state.prefs;
    let bg = p.bg;
    let surface = p.surface;
    const accent = p.accent || '#FA2D48';
    if (p.themeMode === 'oled') { bg = '#000000'; surface = '#121216'; }
    else if (p.themeMode === 'dark') { bg = '#0b0f19'; surface = '#151b2b'; }
    else if (p.themeMode === 'light') { bg = '#F2F3F7'; surface = '#FFFFFF'; }
    const isLight = hexLuminance(bg) > 0.55;
    return { bg, surface, accent, isLight };
  }

  function applyTheme() {
    const pal = resolvedPalette();
    const root = document.documentElement.style;
    root.setProperty('--accent', pal.accent);
    root.setProperty('--accent-soft', hexToRgba(pal.accent, 0.22));
    root.setProperty('--accent-border', hexToRgba(pal.accent, 0.6));
    root.setProperty('--bg', pal.bg);
    root.setProperty('--surface', pal.surface);
    root.setProperty('--text-primary', pal.isLight ? '#161822' : '#FFFFFF');
    root.setProperty('--text-secondary', pal.isLight ? '#5A6072' : '#A8B0C4');
    root.setProperty('--card-fill', pal.isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.07)');
    root.setProperty('--card-stroke', pal.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.13)');
    root.setProperty('--sidebar-bg', pal.isLight ? 'rgba(242,243,247,0.95)' : 'rgba(13,18,30,0.94)');
    const amb = document.getElementById('ambientBackdrop');
    if (amb) amb.style.display = state.prefs.ambient ? 'block' : 'none';
    document.body.classList.toggle('ultra-smooth', state.prefs.ultraSmooth !== false);
  }

  function savePrefs() {
    localStorage.setItem('mf.prefs', JSON.stringify(state.prefs));
    applyTheme();
  }

  function resolveImg(raw) {
    if (!raw) return '';
    let s = String(raw).trim();
    if (!s) return '';
    if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0) return s;
    if (s.indexOf('//') === 0) return 'https:' + s;
    if (s.charAt(0) === '/') s = s.slice(1);
    if (s.indexOf('upload/') === 0 || s.indexOf('uploads/') === 0 || s.indexOf('/') !== -1) {
      return 'https://phimimg.com/' + s;
    }
    return 'https://phimimg.com/upload/vod/' + s;
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  function toast(msg) {
    const el = document.getElementById('toastBanner');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.add('hidden'), 2600);
  }

  async function api(path, opts) {
    const o = opts || {};
    const headers = Object.assign({ Accept: 'application/json' }, o.headers || {});
    if (state.token) headers.Authorization = 'Bearer ' + state.token;
    const fetchOpts = Object.assign({}, o, { headers });
    if (o.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      fetchOpts.body = JSON.stringify(o.json);
    }
    const url = path.indexOf('http') === 0 ? path : API_BASE + path;
    const res = await fetch(url, fetchOpts);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('HTTP ' + res.status + ': ' + txt.slice(0, 120));
    }
    return res.json();
  }

  function setAmbientUrl() {
    // Pure CSS radial-gradient backdrop uses zero-blur GPU tinting without bitmap compositing
  }

  function isBlocked(slug) {
    return state.blocked.some((b) => b.slug === slug);
  }

  function isFavorite(slug) {
    return state.favorites.some((f) => f.slug === slug);
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    const total = Math.floor(sec);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n) => (n < 10 ? '0' + n : String(n));
    return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
  }

  async function bootstrapAuth() {
    if (!state.token) {
      updateAccountUI();
      return;
    }
    try {
      const me = await api('/api/auth/me');
      state.user = me.user || null;
      if (state.user && state.user.themeConfig) {
        const tc = state.user.themeConfig;
        if (tc.accent) state.prefs.accent = tc.accent;
        if (tc.bg) state.prefs.bg = tc.bg;
        if (tc.surface) state.prefs.surface = tc.surface;
        if (tc.presetId) state.prefs.presetId = tc.presetId;
        savePrefs();
      }
      await refreshLibrary();
    } catch (e) {
      state.token = '';
      localStorage.removeItem('mf.token');
    }
    updateAccountUI();
  }

  async function refreshLibrary() {
    if (!state.token) return;
    try {
      const pair = await Promise.all([
        api('/api/user/history').catch(() => ({})),
        api('/api/user/favorites').catch(() => ({}))
      ]);
      if (Array.isArray(pair[0].history)) {
        state.history = pair[0].history;
        localStorage.setItem('mf.history', JSON.stringify(state.history));
      }
      if (Array.isArray(pair[1].favorites)) {
        state.favorites = pair[1].favorites;
      }
    } catch (e) {}
  }

  function updateAccountUI() {
    const card = document.getElementById('sidebarUserCard');
    if (!card) return;
    if (state.user) {
      card.innerHTML = '<div class="su-row">' + svgIcon('user', 20) + '<div style="min-width:0;text-align:left"><div class="su-title">' + esc(state.user.displayName || state.user.username) + '</div><div class="su-sub">@' + esc(state.user.username) + '</div></div></div>';
    } else {
      card.innerHTML = '<div class="su-row">' + svgIcon('user', 20) + '<div style="min-width:0;text-align:left"><div class="su-title">Khách</div><div class="su-sub">Đăng nhập đồng bộ</div></div></div>';
    }
  }

  async function loadDiscover() {
    try {
      const res = await Promise.all([
        api('/api/movies?page=1'),
        api('/api/category?type=phim-bo&page=1').catch(() => ({ items: [] })),
        api('/api/category?type=phim-le&page=1').catch(() => ({ items: [] })),
        api('/api/category?type=hoat-hinh&page=1').catch(() => ({ items: [] }))
      ]);
      state.heroMovies = res[0].items || [];
      state.discoverPage = 1;
      state.seriesMovies = res[1].items || [];
      state.singleMovies = res[2].items || [];
      state.animeMovies = res[3].items || [];
      if (state.heroMovies[0]) {
        setAmbientUrl(resolveImg(state.heroMovies[0].poster_url || state.heroMovies[0].thumb_url));
      }
      render();
      focusByKey('hero:play') || focusFirstInMain();
    } catch (e) {
      const mc = document.getElementById('mainContent');
      mc.innerHTML = '<div class="glass-box">Không tải được dữ liệu: ' + esc(e.message) + ' <button id="btnRetryDiscover" class="btn-accent tv-focus" data-focus-key="discover:retry" tabindex="-1" style="margin-left:12px">Thử lại</button></div>';
      const btn = document.getElementById('btnRetryDiscover');
      if (btn) btn.onclick = loadDiscover;
      focusByKey('discover:retry');
    }
  }

  async function loadMoreDiscover() {
    if (state.loadingMore) return;
    state.loadingMore = true;
    const moreBtn = document.getElementById('btnLoadMore');
    if (moreBtn) moreBtn.textContent = 'Đang tải...';
    try {
      let added = [];
      if (state.category === 'all') {
        const nextPage = state.discoverPage + 1;
        const r = await api('/api/movies?page=' + nextPage);
        const items = r.items || [];
        if (items.length) {
          const seen = new Set(state.heroMovies.map((x) => x.slug));
          for (let i = 0; i < items.length; i++) {
            if (!seen.has(items[i].slug)) {
              state.heroMovies.push(items[i]);
              if (!isBlocked(items[i].slug)) added.push(items[i]);
            }
          }
          state.discoverPage = nextPage;
        } else {
          toast('Đã tải hết danh sách phim');
        }
      } else {
        const nextPage = state.categoryPage + 1;
        const path = state.category.indexOf('cat:') === 0
          ? '/api/category?type=' + encodeURIComponent(state.category.slice(4)) + '&page=' + nextPage
          : '/api/the-loai?slug=' + encodeURIComponent(state.category.slice(6)) + '&page=' + nextPage;
        const r = await api(path);
        const items = r.items || [];
        if (items.length) {
          const seen = new Set(state.filteredMovies.map((x) => x.slug));
          for (let i = 0; i < items.length; i++) {
            if (!seen.has(items[i].slug)) {
              state.filteredMovies.push(items[i]);
              if (!isBlocked(items[i].slug)) added.push(items[i]);
            }
          }
          state.categoryPage = nextPage;
        } else {
          toast('Đã tải hết danh sách phim');
        }
      }
      const grid = document.getElementById('discoverGrid');
      if (grid && added.length) {
        const prefix = state.category === 'all' ? 'latest' : 'catgrid';
        grid.insertAdjacentHTML('beforeend', added.map((m) => movieCardHtml(m, prefix)).join(''));
      }
    } catch (e) {
      toast('Lỗi tải thêm phim');
    } finally {
      state.loadingMore = false;
      const btn = document.getElementById('btnLoadMore');
      if (btn) btn.textContent = 'Tải thêm phim';
    }
  }

  async function selectCategory(catId) {
    state.category = catId;
    state.categoryPage = 1;
    if (catId === 'all') {
      render();
      return;
    }
    state.filteredMovies = [];
    render();
    try {
      const path = catId.indexOf('cat:') === 0
        ? '/api/category?type=' + encodeURIComponent(catId.slice(4)) + '&page=1'
        : '/api/the-loai?slug=' + encodeURIComponent(catId.slice(6)) + '&page=1';
      const data = await api(path);
      state.filteredMovies = data.items || [];
      render();
    } catch (e) {
      toast('Lỗi tải danh mục');
    }
  }

  async function playMovieDirect(slug) {
    try {
      toast('Đang chuẩn bị phát...');
      const res = await api('/api/movie/' + encodeURIComponent(slug));
      if (!res || !res.movie) {
        openDetail(slug);
        return;
      }
      const servers = res.episodes || [];
      const srv = servers[0] || { server_data: [] };
      const hist = state.history.find((h) => h.slug === slug);
      const epIdx = hist && Number.isInteger(hist.episodeIndex) && hist.episodeIndex < srv.server_data.length ? hist.episodeIndex : 0;
      const resumeSec = hist && hist.episodeIndex === epIdx && hist.currentTime > 5 ? hist.currentTime : 0;
      if (srv.server_data && srv.server_data[epIdx]) {
        openPlayer(res.movie, servers, 0, epIdx, resumeSec);
      } else {
        openDetail(slug);
      }
    } catch (e) {
      openDetail(slug);
    }
  }

  function movieCardHtml(m, focusPrefix) {
    const primary = resolveImg(m.poster_url || m.thumb_url) || IMG_FALLBACK_SVG;
    const secondary = resolveImg(m.thumb_url || m.poster_url) || '';
    const badge = m.quality || m.episode_current || '';
    const yr = m.year ? m.year + ' / ' : '';
    const fk = (focusPrefix || 'card') + ':' + m.slug;
    return '<button class="movie-card tv-focus" data-slug="' + esc(m.slug) + '" data-focus-key="' + esc(fk) + '" tabindex="-1">' +
      '<div class="poster-wrap">' +
        '<img width="210" height="315" decoding="async" loading="lazy" src="' + esc(primary) + '" data-fallback="' + esc(secondary) + '" alt="' + esc(m.name) + '" />' +
        (badge ? '<span class="poster-badge">' + esc(badge) + '</span>' : '') +
      '</div>' +
      '<div class="movie-name">' + esc(m.name) + '</div>' +
      '<div class="movie-meta">' + esc(yr + (m.lang || 'Vietsub')) + '</div>' +
    '</button>';
  }

  function updateHeroInPlace() {
    const heroEl = document.getElementById('heroCard');
    if (!heroEl) return;
    const visibleHero = state.heroMovies.filter((m) => !isBlocked(m.slug));
    const featured = visibleHero.slice(0, 6);
    const hero = featured[state.heroIdx] || featured[0];
    if (!hero) return;

    const bg = resolveImg(hero.thumb_url || hero.poster_url) || IMG_FALLBACK_SVG;
    const bgFb = resolveImg(hero.poster_url) || '';
    const imgEl = heroEl.querySelector('.hero-bg');
    if (imgEl) {
      imgEl.removeAttribute('data-fb-step');
      imgEl.setAttribute('data-fallback', bgFb);
      imgEl.src = bg;
    }
    const tagEl = heroEl.querySelector('.hero-tag');
    if (tagEl) tagEl.textContent = 'PHIM MỚI / ' + (hero.quality || 'HD');
    const titleEl = heroEl.querySelector('.hero-title');
    if (titleEl) titleEl.textContent = hero.name || '';
    const subEl = heroEl.querySelector('.hero-sub');
    if (subEl) subEl.textContent = (hero.origin_name || '') + (hero.year ? ' (' + hero.year + ')' : '');

    const playBtn = heroEl.querySelector('[data-play-direct]');
    if (playBtn) playBtn.setAttribute('data-play-direct', hero.slug);
    const detBtn = heroEl.querySelector('[data-open-slug]');
    if (detBtn) detBtn.setAttribute('data-open-slug', hero.slug);
    const favBtn = heroEl.querySelector('[data-fav-slug]');
    if (favBtn) {
      favBtn.setAttribute('data-fav-slug', hero.slug);
      const favActive = isFavorite(hero.slug);
      favBtn.innerHTML = svgIcon(favActive ? 'check' : 'plus', 18) + '<span>' + (favActive ? 'Đã lưu' : 'Tủ phim') + '</span>';
    }
    document.querySelectorAll('.hero-dot').forEach((dot) => {
      const idx = parseInt(dot.getAttribute('data-hero-idx'), 10);
      dot.classList.toggle('active', idx === state.heroIdx);
    });
  }

  function renderDiscover() {
    const visibleHero = state.heroMovies.filter((m) => !isBlocked(m.slug));
    const featured = visibleHero.slice(0, 6);
    const hero = featured[state.heroIdx] || featured[0];

    let html = '<div class="chips-row">';
    for (let i = 0; i < CATEGORIES.length; i++) {
      const c = CATEGORIES[i];
      html += '<button class="chip tv-focus ' + (state.category === c.id ? 'active' : '') + '" data-cat="' + c.id + '" data-focus-key="cat:' + c.id + '" tabindex="-1">' + esc(c.label) + '</button>';
    }
    html += '</div>';

    if (state.category === 'all') {
      if (hero) {
        const bg = resolveImg(hero.thumb_url || hero.poster_url) || IMG_FALLBACK_SVG;
        const bgFb = resolveImg(hero.poster_url) || '';
        const favActive = isFavorite(hero.slug);
        html += '<div id="heroCard" class="hero-card">' +
          '<img class="hero-bg" decoding="async" src="' + esc(bg) + '" data-fallback="' + esc(bgFb) + '" alt="" />' +
          '<div class="hero-grad"></div>' +
          '<div class="hero-body">' +
            '<span class="hero-tag">PHIM MỚI / ' + esc(hero.quality || 'HD') + '</span>' +
            '<h2 class="hero-title">' + esc(hero.name) + '</h2>' +
            '<div class="hero-sub">' + esc(hero.origin_name || '') + (hero.year ? ' (' + hero.year + ')' : '') + '</div>' +
            '<div class="hero-actions">' +
              '<button class="btn-accent tv-focus" data-play-direct="' + esc(hero.slug) + '" data-focus-key="hero:play" tabindex="-1">' + svgIcon('play', 18) + '<span>Xem ngay</span></button>' +
              '<button class="btn-glass tv-focus" data-open-slug="' + esc(hero.slug) + '" data-focus-key="hero:detail" tabindex="-1">' + svgIcon('info', 18) + '<span>Chi tiết</span></button>' +
              '<button class="btn-glass tv-focus" data-fav-slug="' + esc(hero.slug) + '" data-focus-key="hero:fav" tabindex="-1">' + svgIcon(favActive ? 'check' : 'plus', 18) + '<span>' + (favActive ? 'Đã lưu' : 'Tủ phim') + '</span></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="hero-nav-row">' +
          '<button class="hero-arrow tv-focus" id="btnHeroPrev" data-focus-key="hero:prev" tabindex="-1" aria-label="Slide trước">' + svgIcon('chevLeft', 18) + '</button>' +
          featured.map((_, idx) => '<button class="hero-dot tv-focus ' + (idx === state.heroIdx ? 'active' : '') + '" data-hero-idx="' + idx + '" data-focus-key="hero:dot:' + idx + '" tabindex="-1" aria-label="Slide ' + (idx + 1) + '"></button>').join('') +
          '<button class="hero-arrow tv-focus" id="btnHeroNext" data-focus-key="hero:next" tabindex="-1" aria-label="Slide sau">' + svgIcon('chevRight', 18) + '</button>' +
        '</div>';
      }

      if (state.history.length > 0) {
        html += '<div class="section-hdr"><h3 class="section-title">Tiếp tục xem</h3></div><div class="rail">';
        const histSlice = state.history.slice(0, 12);
        for (let i = 0; i < histSlice.length; i++) {
          const h = histSlice[i];
          const pct = h.duration > 1 ? Math.min(100, Math.round((h.currentTime || 0) / h.duration * 100)) : 0;
          html += '<button class="movie-card tv-focus" data-slug="' + esc(h.slug) + '" data-focus-key="hist:' + esc(h.slug) + '" tabindex="-1">' +
            '<div class="poster-wrap">' +
              '<img width="210" height="315" decoding="async" loading="lazy" src="' + esc(resolveImg(h.poster) || IMG_FALLBACK_SVG) + '" alt="" />' +
              '<span class="poster-badge">' + esc(h.episodeName || 'Tập 1') + '</span>' +
            '</div>' +
            '<div class="movie-name">' + esc(h.name || h.slug) + '</div>' +
            '<div class="movie-meta">Đã xem ' + pct + '%</div>' +
          '</button>';
        }
        html += '</div>';
      }

      const rails = [
        ['Phim bộ mới', 'series', state.seriesMovies],
        ['Phim lẻ', 'single', state.singleMovies],
        ['Hoạt hình & Anime', 'anime', state.animeMovies]
      ];
      for (let r = 0; r < rails.length; r++) {
        const title = rails[r][0];
        const prefix = rails[r][1];
        const vis = (rails[r][2] || []).filter((m) => !isBlocked(m.slug)).slice(0, 14);
        if (!vis.length) continue;
        html += '<div class="section-hdr"><h3 class="section-title">' + title + '</h3></div><div class="rail">' + vis.map((m) => movieCardHtml(m, prefix)).join('') + '</div>';
      }

      html += '<div class="section-hdr"><h3 class="section-title">Mới cập nhật</h3></div><div id="discoverGrid" class="movie-grid">' + visibleHero.map((m) => movieCardHtml(m, 'latest')).join('') + '</div>';
      html += '<div class="load-more-wrap"><button id="btnLoadMore" class="btn-glass tv-focus" data-focus-key="discover:more" tabindex="-1">' + (state.loadingMore ? 'Đang tải...' : 'Tải thêm phim') + '</button></div>';
    } else {
      const catObj = CATEGORIES.find((c) => c.id === state.category);
      const catLabel = catObj ? catObj.label : '';
      const list = state.filteredMovies.filter((m) => !isBlocked(m.slug));
      html += '<div class="section-hdr"><h3 class="section-title">' + esc(catLabel) + '</h3></div>';
      if (list.length) {
        html += '<div id="discoverGrid" class="movie-grid">' + list.map((m) => movieCardHtml(m, 'catgrid')).join('') + '</div>';
        html += '<div class="load-more-wrap"><button id="btnLoadMore" class="btn-glass tv-focus" data-focus-key="discover:more" tabindex="-1">' + (state.loadingMore ? 'Đang tải...' : 'Tải thêm phim') + '</button></div>';
      } else {
        html += '<div class="glass-box">Đang tải danh sách phim...</div>';
      }
    }

    return html;
  }

  async function openDetail(slug, pushHistory) {
    if (pushHistory !== false && state.detailSlug && state.detailSlug !== slug) {
      state.detailStack.push(state.detailSlug);
    }
    state.detailSlug = slug;
    state.detailData = null;
    state.detailFranchise = [];
    state.detailRelated = [];
    state.selectedServerIdx = 0;
    render();
    try {
      const pair = await Promise.all([
        api('/api/movie/' + encodeURIComponent(slug)),
        api('/api/franchise?slug=' + encodeURIComponent(slug)).catch(() => ({ seasons: [] }))
      ]);
      state.detailData = pair[0];
      state.detailFranchise = pair[1].seasons || [];
      if (pair[0].movie) {
        setAmbientUrl(resolveImg(pair[0].movie.poster_url || pair[0].movie.thumb_url));
        const gSlug = pair[0].movie.category && pair[0].movie.category[0] ? pair[0].movie.category[0].slug : '';
        if (gSlug) {
          api('/api/the-loai?slug=' + encodeURIComponent(gSlug) + '&page=1').then((r) => {
            state.detailRelated = (r.items || []).filter((i) => i.slug !== slug).slice(0, 12);
            if (state.detailSlug === slug) render();
          }).catch(() => {});
        }
      }
      render();
      focusByKey('detail:play');
    } catch (e) {
      toast('Lỗi tải phim: ' + e.message);
    }
  }

  function formatPeopleList(val) {
    if (!val) return '';
    if (Array.isArray(val)) return val.filter(Boolean).join(', ');
    return String(val);
  }

  function renderDetail() {
    const res = state.detailData;
    let html = '<button class="detail-back tv-focus" id="btnDetailBack" data-focus-key="detail:back" tabindex="-1">' + svgIcon('back', 18) + '<span>Quay lại</span></button>';
    if (!res || !res.movie) {
      return html + '<div class="glass-box">Đang tải chi tiết phim...</div>';
    }
    const m = res.movie;
    const servers = res.episodes || [];
    const srv = servers[state.selectedServerIdx] || { server_data: [] };
    const hist = state.history.find((h) => h.slug === m.slug);
    const synopsis = (m.content || '').replace(/<[^>]+>/g, '').trim();
    const poster = resolveImg(m.poster_url || m.thumb_url) || IMG_FALLBACK_SVG;
    const posterFb = resolveImg(m.thumb_url || m.poster_url) || '';
    const actors = formatPeopleList(m.actor);
    const directors = formatPeopleList(m.director);
    const countries = Array.isArray(m.country) ? m.country.map((c) => c.name).filter(Boolean).join(', ') : '';

    const leftCol = '<div>' +
      '<div class="detail-poster-wrap"><img src="' + esc(poster) + '" data-fallback="' + esc(posterFb) + '" alt="" /></div>' +
      '<h2 class="detail-title">' + esc(m.name) + '</h2>' +
      (m.origin_name ? '<div class="detail-origin">' + esc(m.origin_name) + (m.year ? ' / ' + esc(m.year) : '') + (m.lang ? ' / ' + esc(m.lang) : '') + '</div>' : '') +
      '<div class="detail-actions">' +
        '<button class="btn-accent tv-focus" id="btnDetailPlay" data-focus-key="detail:play" tabindex="-1">' + svgIcon('play', 18) + '<span>' + (hist ? 'Xem tiếp: ' + esc(hist.episodeName || 'Tập 1') : 'Xem ngay') + '</span></button>' +
        '<button class="btn-glass tv-focus" id="btnDetailFav" data-focus-key="detail:fav" tabindex="-1">' + svgIcon(isFavorite(m.slug) ? 'check' : 'bookmark', 18) + '<span>' + (isFavorite(m.slug) ? 'Đã lưu' : 'Lưu') + '</span></button>' +
        '<button class="btn-glass tv-focus" id="btnDetailBlock" data-focus-key="detail:block" tabindex="-1">' + svgIcon('eyeOff', 18) + '<span>Ẩn</span></button>' +
      '</div>' +
      '<div class="chips-row">' +
        (m.quality ? '<span class="chip">' + esc(m.quality) + '</span>' : '') +
        (m.episode_current ? '<span class="chip">' + esc(m.episode_current) + '</span>' : '') +
        (m.time ? '<span class="chip">' + esc(m.time) + '</span>' : '') +
        (m.category || []).slice(0, 4).map((c) => '<span class="chip">' + esc(c.name) + '</span>').join('') +
      '</div>' +
      '<div class="glass-box">' +
        (directors ? '<div class="meta-line"><strong>Đạo diễn:</strong> ' + esc(directors) + '</div>' : '') +
        (actors ? '<div class="meta-line"><strong>Diễn viên:</strong> ' + esc(actors) + '</div>' : '') +
        (countries ? '<div class="meta-line"><strong>Quốc gia:</strong> ' + esc(countries) + '</div>' : '') +
        (synopsis ? '<div style="margin-top:10px;font-size:15px;line-height:1.55;color:var(--text-secondary)">' + esc(synopsis) + '</div>' : '') +
      '</div>' +
    '</div>';

    let franchiseHtml = '';
    if (state.detailFranchise.length > 1) {
      franchiseHtml = '<div class="glass-box">' +
        '<button class="s-row tv-focus" id="btnToggleFranchise" data-focus-key="detail:franchise" tabindex="-1" style="padding:4px 6px">' +
          '<strong>Các phần phim (' + state.detailFranchise.length + ')</strong>' +
          '<span style="display:inline-flex;align-items:center;color:var(--accent)">' + (state.franchiseExpanded ? 'Thu gọn ' + svgIcon('chevUp', 16) : 'Mở rộng ' + svgIcon('chevDown', 16)) + '</span>' +
        '</button>' +
        (state.franchiseExpanded ? '<div class="franchise-list">' + state.detailFranchise.map((s) =>
          '<button class="season-chip tv-focus ' + (s.slug === m.slug ? 'active' : '') + '" data-slug="' + esc(s.slug) + '" data-focus-key="season:' + esc(s.slug) + '" tabindex="-1">' + esc(s.fullTitle || s.name || s.slug) + '</button>'
        ).join('') + '</div>' : '') +
      '</div>';
    }

    const rightCol = '<div>' +
      franchiseHtml +
      '<div class="glass-box">' +
        '<div class="chips-row" style="padding:4px 2px 10px;margin-bottom:8px">' +
          servers.map((s, i) => '<button class="chip tv-focus ' + (i === state.selectedServerIdx ? 'active' : '') + '" data-srv-idx="' + i + '" data-focus-key="srv:' + i + '" tabindex="-1">' + esc(s.server_name) + '</button>').join('') +
        '</div>' +
        '<div style="font-weight:800;font-size:19px;margin-bottom:14px">Danh sách tập (' + (srv.server_data ? srv.server_data.length : 0) + ')</div>' +
        '<div class="ep-grid">' +
          (srv.server_data || []).map((ep, idx) => '<button class="ep-btn tv-focus ' + (hist && hist.episodeIndex === idx ? 'active' : '') + '" data-play-ep="' + idx + '" data-focus-key="ep:' + idx + '" tabindex="-1">' + esc(ep.name) + '</button>').join('') +
        '</div>' +
      '</div>' +
      (state.detailRelated.length ? '<div class="section-hdr"><h3 class="section-title">Có thể bạn cũng thích</h3></div><div class="rail">' + state.detailRelated.map((rm) => movieCardHtml(rm, 'rel')).join('') + '</div>' : '') +
    '</div>';

    return html + '<div class="detail-layout">' + leftCol + rightCol + '</div>';
  }

  function renderSearch() {
    const topics = ['Hành động', 'Khoa học viễn tưởng', 'Hình sự', 'Tâm lý', 'Hoạt hình', 'Kinh dị', 'Cổ trang', 'Tình cảm'];
    const vis = state.searchResults.filter((m) => !isBlocked(m.slug));

    let kbdHtml = '<div class="tv-keyboard">';
    for (let r = 0; r < KBD_ROWS.length; r++) {
      kbdHtml += '<div class="kbd-row">';
      const row = KBD_ROWS[r];
      for (let c = 0; c < row.length; c++) {
        const key = row[c];
        let label = key;
        let cls = 'kbd-key tv-focus';
        if (key === 'SPACE') { label = 'Dấu cách'; cls += ' wide'; }
        else if (key === 'DEL') { label = svgIcon('backspace', 18) + '<span style="margin-left:6px">Xoá</span>'; cls += ' wide'; }
        else if (key === 'CLEAR') { label = 'Xoá hết'; cls += ' wide'; }
        else if (key === 'SEARCH') { label = 'Tìm kiếm'; cls += ' wide accent'; }
        kbdHtml += '<button class="' + cls + '" data-kbd="' + key + '" data-focus-key="kbd:' + key + '" tabindex="-1">' + label + '</button>';
      }
      kbdHtml += '</div>';
    }
    kbdHtml += '</div>';

    let html = '<div class="search-bar">' +
      '<input id="searchInput" class="search-input tv-focus" data-focus-key="search:input" placeholder="Nhập tên phim hoặc dùng bàn phím bên dưới..." value="' + esc(state.searchQuery) + '" />' +
      '<button id="btnRunSearch" class="btn-accent tv-focus" data-focus-key="search:go" tabindex="-1">Tìm</button>' +
    '</div>' +
    kbdHtml +
    '<div class="chips-row">' +
      topics.map((t, idx) => '<button class="chip tv-focus" data-search-topic="' + esc(t) + '" data-focus-key="topic:' + idx + '" tabindex="-1">' + esc(t) + '</button>').join('') +
    '</div>';

    if (vis.length) {
      html += '<div class="movie-grid">' + vis.map((m) => movieCardHtml(m, 'srch')).join('') + '</div>';
      html += '<div class="load-more-wrap"><button id="btnLoadMoreSearch" class="btn-glass tv-focus" data-focus-key="search:more" tabindex="-1">' + (state.loadingMore ? 'Đang tải...' : 'Tải thêm kết quả') + '</button></div>';
    } else {
      html += '<div class="glass-box" style="text-align:center;color:var(--text-secondary)">' + (state.searchQuery ? 'Không tìm thấy phim phù hợp.' : 'Dùng bàn phím D-Pad hoặc chọn chủ đề để tìm phim.') + '</div>';
    }
    return html;
  }

  let searchDebounce = null;
  async function runSearch(q, page) {
    state.searchQuery = q;
    const p = page || 1;
    const trimmed = q.trim();
    if (!trimmed) {
      state.searchResults = [];
      state.searchPage = 1;
      render();
      return;
    }
    try {
      const r = await api('/api/search?q=' + encodeURIComponent(trimmed) + '&page=' + p);
      const items = r.items || [];
      if (p === 1) {
        state.searchResults = items;
        state.searchPage = 1;
      } else if (items.length) {
        const seen = new Set(state.searchResults.map((x) => x.slug));
        for (let i = 0; i < items.length; i++) {
          if (!seen.has(items[i].slug)) state.searchResults.push(items[i]);
        }
        state.searchPage = p;
      } else {
        toast('Đã hết kết quả tìm kiếm');
      }
      render();
    } catch (e) {
      toast('Lỗi tìm kiếm');
    }
  }

  function renderLibrary() {
    const segs = [
      ['history', 'Đang xem (' + state.history.length + ')'],
      ['favorites', 'Đã lưu (' + state.favorites.length + ')'],
      ['blocked', 'Đã ẩn (' + state.blocked.length + ')']
    ];
    let html = '<div class="seg-tabs">' + segs.map((pair) =>
      '<button class="seg-btn tv-focus ' + (state.librarySeg === pair[0] ? 'active' : '') + '" data-lib-seg="' + pair[0] + '" data-focus-key="lib:' + pair[0] + '" tabindex="-1">' + pair[1] + '</button>'
    ).join('') + '</div>';

    if (state.librarySeg === 'history') {
      if (!state.history.length) return html + '<div class="glass-box">Chưa có phim đang xem.</div>';
      html += state.history.map((h) => {
        const pct = h.duration > 1 ? Math.min(100, Math.round((h.currentTime || 0) / h.duration * 100)) : 0;
        return '<div class="hist-row">' +
          '<button class="hist-main tv-focus" data-slug="' + esc(h.slug) + '" data-focus-key="histrow:' + esc(h.slug) + '" tabindex="-1">' +
            '<img class="hist-thumb" src="' + esc(resolveImg(h.poster) || IMG_FALLBACK_SVG) + '" alt="" />' +
            '<div style="flex:1;min-width:0">' +
              '<div class="movie-name">' + esc(h.name || h.slug) + '</div>' +
              '<div class="movie-meta">' + esc(h.episodeName || 'Tập 1') + ' (' + pct + '%)</div>' +
              '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '</div>' +
          '</button>' +
          '<button class="tb-btn tv-focus" data-del-hist="' + esc(h.slug) + '" data-focus-key="histdel:' + esc(h.slug) + '" tabindex="-1">' + svgIcon('trash', 16) + '<span>Xoá</span></button>' +
        '</div>';
      }).join('');
    } else if (state.librarySeg === 'favorites') {
      if (!state.user) return html + '<div class="glass-box">Đăng nhập để đồng bộ và xem tủ phim đã lưu. <button class="btn-accent tv-focus" id="btnLibLogin" data-focus-key="lib:login" tabindex="-1" style="margin-left:14px">Đăng nhập</button></div>';
      if (!state.favorites.length) return html + '<div class="glass-box">Chưa có phim đã lưu.</div>';
      html += '<div class="movie-grid">' + state.favorites.map((f) => movieCardHtml({
        slug: f.slug,
        name: f.name || f.slug,
        poster_url: f.poster,
        year: f.year,
        quality: f.quality,
        lang: f.lang
      }, 'fav')).join('') + '</div>';
    } else {
      if (!state.blocked.length) return html + '<div class="glass-box">Chưa có phim nào bị ẩn.</div>';
      html += state.blocked.map((b) =>
        '<div class="hist-row">' +
          '<div class="hist-main" style="cursor:default">' +
            '<img class="hist-thumb" style="width:68px;height:96px" src="' + esc(resolveImg(b.poster) || IMG_FALLBACK_SVG) + '" alt="" />' +
            '<div style="flex:1;min-width:0">' +
              '<div class="movie-name">' + esc(b.name) + '</div>' +
              '<div class="movie-meta">Đang ẩn khỏi Trang chủ & Tìm kiếm</div>' +
            '</div>' +
          '</div>' +
          '<button class="btn-accent tv-focus" data-unblock="' + esc(b.slug) + '" data-focus-key="unblock:' + esc(b.slug) + '" tabindex="-1">Hiện lại</button>' +
        '</div>'
      ).join('');
    }
    return html;
  }

  function renderMonitorPage() {
    const m = state.monitor;
    const ns = m.netStats;
    const score = Math.min(100, Math.round(
      Math.min(70, m.dlMbps * 1.4) +
      Math.max(0, 30 - Math.min(30, m.pingMs / 5))
    ));
    const t720 = m.dlMbps >= 5;
    const t1080 = m.dlMbps >= 12;
    const t4k = m.dlMbps >= 28;
    const tvRes = window.innerWidth + 'x' + window.innerHeight;
    const hasWebOS = typeof window.webOSSystem !== 'undefined';

    return '<div class="settings-wrap">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
        '<div>' +
          '<h2 style="margin:0 0 4px;font-size:28px">Kiểm tra Mạng TV</h2>' +
          '<div class="s-sub">Đo trực tiếp 4 luồng Cloudflare Edge + máy chủ phim.maniakov.bond (' + esc(m.source) + ')</div>' +
        '</div>' +
        '<button class="btn-accent tv-focus" id="btnRunSpeedtest" data-focus-key="mon:run" tabindex="-1">' + svgIcon('wifi', 18) + '<span>' + (m.testing ? 'Đang đo...' : 'Đo Speedtest TV') + '</span></button>' +
      '</div>' +

      '<div class="kpi-grid">' +
        '<div class="kpi-card"><div class="kpi-lbl">Tải xuống (4 luồng)</div><div class="kpi-val" style="color:#30D158">' + m.dlMbps.toFixed(1) + ' Mbps</div></div>' +
        '<div class="kpi-card"><div class="kpi-lbl">Tải lên (2 luồng)</div><div class="kpi-val" style="color:#0A84FF">' + m.ulMbps.toFixed(1) + ' Mbps</div></div>' +
        '<div class="kpi-card"><div class="kpi-lbl">Ping / Jitter</div><div class="kpi-val">' + Math.round(m.pingMs) + ' / ' + Math.round(m.jitterMs) + ' ms</div></div>' +
        '<div class="kpi-card"><div class="kpi-lbl">Server API</div><div class="kpi-val" style="color:' + (ns && ns.ok ? '#30D158' : '#FF9F0A') + '">' + (ns && ns.ok ? 'Trực tuyến' : 'Đang đo') + '</div></div>' +
      '</div>' +

      '<div class="charts-grid">' +
        '<div class="chart-box">' +
          '<div style="font-size:16px;font-weight:700;margin-bottom:8px">Băng thông Tải xuống (Xanh lá) / Tải lên (Xanh dương) — Mbps</div>' +
          '<canvas id="canvasNetSpeed" width="500" height="155"></canvas>' +
        '</div>' +
        '<div class="chart-box">' +
          '<div style="font-size:16px;font-weight:700;margin-bottom:8px">Ping (Vàng, ms) & CPU Máy chủ (Đỏ, %)</div>' +
          '<canvas id="canvasPingLoad" width="500" height="155"></canvas>' +
        '</div>' +
      '</div>' +

      '<div class="glass-box">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<strong>Khả năng phát trực tuyến trên Smart TV</strong>' +
          '<span style="font-weight:800;font-size:20px;color:var(--accent)">' + score + '%</span>' +
        '</div>' +
        '<div class="progress-track" style="height:10px;margin-bottom:14px"><div class="progress-fill" style="width:' + score + '%"></div></div>' +
        '<div class="chips-row" style="margin:0;padding:0">' +
          '<span class="chip ' + (t720 ? 'active' : '') + '">720p HD ' + (t720 ? svgIcon('check', 14) : '') + '</span>' +
          '<span class="chip ' + (t1080 ? 'active' : '') + '">1080p60 FHD ' + (t1080 ? svgIcon('check', 14) : '') + '</span>' +
          '<span class="chip ' + (t4k ? 'active' : '') + '">4K UHD ' + (t4k ? svgIcon('check', 14) : '') + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="spec-grid">' +
        '<div class="glass-box">' +
          '<div style="font-weight:800;font-size:18px;margin-bottom:10px">Thông số Smart TV</div>' +
          '<div class="spec-kv"><span>Nền tảng</span><strong>' + (hasWebOS ? 'LG webOS TV' : 'Trình duyệt TV') + '</strong></div>' +
          '<div class="spec-kv"><span>Độ phân giải giao diện</span><strong>' + esc(tvRes) + '</strong></div>' +
          '<div class="spec-kv"><span>Trình phát HLS</span><strong>' + (window.Hls && window.Hls.isSupported() ? 'HLS.js + MSE' : 'Native Video HLS') + '</strong></div>' +
          '<div class="spec-kv"><span>Phiên bản App</span><strong>ManiFlix v1.1.0</strong></div>' +
        '</div>' +
        '<div class="glass-box">' +
          '<div style="font-weight:800;font-size:18px;margin-bottom:10px">Máy chủ phim.maniakov.bond</div>' +
          '<div class="spec-kv"><span>Trạng thái API</span><strong>' + (ns && ns.ok ? 'Trực tuyến (OK)' : 'Chờ phản hồi') + '</strong></div>' +
          '<div class="spec-kv"><span>Server RX / TX</span><strong>' + (ns ? ns.rxMbps + ' / ' + ns.txMbps + ' Mbps' : '--') + '</strong></div>' +
          '<div class="spec-kv"><span>Server CPU / RAM</span><strong>' + (ns ? ns.cpuPct + '% / ' + ns.memPct + '%' : '--') + '</strong></div>' +
          '<div class="spec-kv"><span>Uptime Server</span><strong>' + (ns ? Math.floor(ns.uptimeSec / 60) + ' phút' : '--') + '</strong></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function drawChart(canvasId, seriesA, seriesB, colorA, colorB) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    const maxVal = Math.max.apply(null, [10].concat(seriesA, seriesB));
    const plot = (arr, color) => {
      if (arr.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let idx = 0; idx < arr.length; idx++) {
        const x = (idx / Math.max(1, arr.length - 1)) * (w - 12) + 6;
        const y = h - 10 - (arr[idx] / maxVal) * (h - 22);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    plot(seriesA, colorA);
    plot(seriesB, colorB);
  }

  async function measureStreamBytes(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const tStart = performance.now();
    let totalBytes = 0;
    if (res.body && typeof res.body.getReader === 'function') {
      const reader = res.body.getReader();
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        totalBytes += chunk.value ? chunk.value.byteLength : 0;
      }
    } else {
      const buf = await res.arrayBuffer();
      totalBytes = buf.byteLength;
    }
    return { bytes: totalBytes, tStart, tEnd: performance.now() };
  }

  async function runTvSpeedtest() {
    if (state.monitor.testing) return;
    state.monitor.testing = true;
    state.monitor.source = 'Đang đo...';
    if (state.tab === 'monitor') render();

    try {
      const nsPromise = api('/api/net-stats').catch(() => null);

      let useCloudflare = true;
      const pings = [];
      try {
        await fetch(CF_DOWN + '?bytes=0&_w=' + Date.now(), { cache: 'no-store' });
        for (let i = 0; i < 4; i++) {
          const t0 = performance.now();
          await fetch(CF_DOWN + '?bytes=0&_p=' + Date.now() + '_' + i, { cache: 'no-store' });
          pings.push(Math.max(1, performance.now() - t0));
        }
      } catch (e) {
        useCloudflare = false;
        await fetch(API_BASE + '/api/net-probe?kb=1&_w=' + Date.now(), { cache: 'no-store' }).catch(() => {});
        for (let i = 0; i < 4; i++) {
          const t0 = performance.now();
          await fetch(API_BASE + '/api/net-probe?kb=1&_p=' + Date.now() + '_' + i, { cache: 'no-store' });
          pings.push(Math.max(1, performance.now() - t0));
        }
      }

      const avgPing = pings.reduce((a, b) => a + b, 0) / Math.max(1, pings.length);
      let jitterSum = 0;
      for (let i = 1; i < pings.length; i++) jitterSum += Math.abs(pings[i] - pings[i - 1]);
      const jitter = pings.length > 1 ? jitterSum / (pings.length - 1) : 0;
      state.monitor.pingMs = avgPing;
      state.monitor.jitterMs = jitter;

      // 4-stream download speedtest (6MB x 4 on Cloudflare Edge, fallback 2MB x 4 on API)
      const dlCount = 4;
      const dlTasks = [];
      for (let i = 0; i < dlCount; i++) {
        const u = useCloudflare
          ? CF_DOWN + '?bytes=6000000&_r=' + Date.now() + '_' + i
          : API_BASE + '/api/net-probe?kb=2048&_r=' + Date.now() + '_' + i;
        dlTasks.push(measureStreamBytes(u));
      }
      const dlResults = await Promise.all(dlTasks);
      let totalDlBytes = 0;
      let minStart = Infinity;
      let maxEnd = 0;
      for (let i = 0; i < dlResults.length; i++) {
        totalDlBytes += dlResults[i].bytes;
        if (dlResults[i].tStart < minStart) minStart = dlResults[i].tStart;
        if (dlResults[i].tEnd > maxEnd) maxEnd = dlResults[i].tEnd;
      }
      const dlSec = Math.max(0.02, (maxEnd - minStart) / 1000);
      state.monitor.dlMbps = (totalDlBytes * 8) / (dlSec * 1000000);
      state.monitor.source = useCloudflare ? 'Cloudflare Edge (4 luồng)' : 'phim.maniakov.bond (4 luồng)';

      // 2-stream upload test (1.5MB x 2 on Cloudflare, fallback 512KB x 2)
      try {
        const upSize = useCloudflare ? 1500000 : 524288;
        const upUrl = useCloudflare ? CF_UP : API_BASE + '/api/net-up';
        const payloadA = new Uint8Array(upSize);
        const payloadB = new Uint8Array(upSize);
        const u0 = performance.now();
        await Promise.all([
          fetch(upUrl, { method: 'POST', body: payloadA, headers: { 'Content-Type': 'application/octet-stream' } }),
          fetch(upUrl, { method: 'POST', body: payloadB, headers: { 'Content-Type': 'application/octet-stream' } })
        ]);
        const uSec = Math.max(0.02, (performance.now() - u0) / 1000);
        state.monitor.ulMbps = (upSize * 2 * 8) / (uSec * 1000000);
      } catch (e) {
        state.monitor.ulMbps = 0;
      }

      const ns = await nsPromise;
      if (ns) state.monitor.netStats = ns;

      const push = (arr, v) => { arr.push(v); if (arr.length > 20) arr.shift(); };
      push(state.monitor.dlSeries, state.monitor.dlMbps);
      push(state.monitor.ulSeries, state.monitor.ulMbps);
      push(state.monitor.pingSeries, state.monitor.pingMs);
      push(state.monitor.serverCpuSeries, ns && ns.cpuPct ? ns.cpuPct : 0);
    } catch (e) {
      toast('Không đo được tốc độ mạng: ' + e.message);
    } finally {
      state.monitor.testing = false;
      if (state.tab === 'monitor') {
        render();
        drawChart('canvasNetSpeed', state.monitor.dlSeries, state.monitor.ulSeries, '#30D158', '#0A84FF');
        drawChart('canvasPingLoad', state.monitor.pingSeries, state.monitor.serverCpuSeries, '#FF9F0A', '#FA2D48');
      }
    }
  }

  function renderSettings() {
    if (state.settingsSubPage === 'theme') return renderThemeSubPage();

    const modeLabels = { dark: 'Tối', oled: 'Đen OLED', light: 'Sáng', custom: 'Tuỳ chỉnh' };
    const skipLabels = { button: 'Hiện nút bỏ qua (OK)', auto: 'Tự động bỏ qua', off: 'Tắt' };

    return '<div class="settings-wrap">' +
      '<div class="settings-section">' +
        '<div class="settings-label">Tài khoản & Đồng bộ</div>' +
        '<div class="settings-card">' +
          '<button class="s-row tv-focus" id="btnSettingsAuth" data-focus-key="set:auth" tabindex="-1">' +
            '<div>' +
              '<div style="font-weight:700">' + (state.user ? esc(state.user.displayName || state.user.username) : 'Đăng nhập hoặc tạo tài khoản') + '</div>' +
              '<div class="s-sub">' + (state.user ? '@' + esc(state.user.username) + ' — Đang đồng bộ tủ phim & lịch sử' : 'Đồng bộ tủ phim, lịch sử xem & giao diện') + '</div>' +
            '</div>' +
            '<span style="color:var(--accent);font-weight:700">' + (state.user ? 'Đăng xuất' : svgIcon('chevRight', 20)) + '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="settings-label">Giao diện & Chẩn đoán</div>' +
        '<div class="settings-card">' +
          '<button class="s-row tv-focus" data-subpage="theme" data-focus-key="set:theme" tabindex="-1">' +
            '<div>' +
              '<div style="font-weight:700">Giao diện & Chủ đề TV</div>' +
              '<div class="s-sub">Chế độ hiện tại: ' + (modeLabels[state.prefs.themeMode] || 'Tối') + '</div>' +
            '</div>' +
            '<span style="color:var(--accent)">' + svgIcon('chevRight', 20) + '</span>' +
          '</button>' +
          '<button class="s-row tv-focus" id="btnSettingsMonitor" data-focus-key="set:monitor" tabindex="-1">' +
            '<div>' +
              '<div style="font-weight:700">Kiểm tra mạng TV (Cloudflare Speedtest)</div>' +
              '<div class="s-sub">Đo băng thông 4 luồng, Ping/Jitter & khả năng phát 4K</div>' +
            '</div>' +
            '<span style="color:var(--accent)">' + svgIcon('chevRight', 20) + '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="settings-label">Trình phát TV</div>' +
        '<div class="settings-card">' +
          '<button class="s-row tv-focus" id="btnToggleAutoAds" data-focus-key="set:autoads" tabindex="-1">' +
            '<span>Tự cắt đoạn quảng cáo (TheIntroDB)</span>' +
            '<span class="pill-toggle ' + (state.prefs.autoCutAds ? 'on' : '') + '">' + (state.prefs.autoCutAds ? 'BẬT' : 'TẮT') + '</span>' +
          '</button>' +
          '<button class="s-row tv-focus" id="btnCycleIntroSkip" data-focus-key="set:introskip" tabindex="-1">' +
            '<span>Mở đầu & kết thúc (TheIntroDB)</span>' +
            '<span class="pill-toggle on">' + (skipLabels[state.prefs.introSkip] || 'Hiện nút') + '</span>' +
          '</button>' +
          '<button class="s-row tv-focus" id="btnToggleAutoNext" data-focus-key="set:autonext" tabindex="-1">' +
            '<span>Tự chuyển tập tiếp theo</span>' +
            '<span class="pill-toggle ' + (state.prefs.autoNext ? 'on' : '') + '">' + (state.prefs.autoNext ? 'BẬT' : 'TẮT') + '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="settings-label">Ứng dụng</div>' +
        '<div class="settings-card">' +
          '<div class="s-row" style="cursor:default"><span>Phiên bản</span><span class="s-sub">1.1.0 (bond.maniakov.maniflix)</span></div>' +
          '<button class="s-row tv-focus" id="btnResetPrefs" data-focus-key="set:reset" tabindex="-1">' +
            '<span style="color:#ff453a;font-weight:700">Đặt lại cài đặt mặc định</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderThemeSubPage() {
    const modes = [
      ['dark', 'Tối'],
      ['oled', 'Đen OLED'],
      ['light', 'Sáng'],
      ['custom', 'Tuỳ chỉnh']
    ];
    return '<div class="settings-wrap">' +
      '<button class="detail-back tv-focus" data-subpage="main" data-focus-key="theme:back" tabindex="-1">' + svgIcon('back', 18) + '<span>Cài đặt</span></button>' +
      '<h2 style="margin:0 0 16px;font-size:28px">Giao diện & Chủ đề TV</h2>' +

      '<div class="glass-box">' +
        '<div style="font-weight:700;margin-bottom:12px">Chế độ hiển thị</div>' +
        '<div class="chips-row" style="margin:0">' +
          modes.map((m) => '<button class="chip tv-focus ' + (state.prefs.themeMode === m[0] ? 'active' : '') + '" data-theme-mode="' + m[0] + '" data-focus-key="tmode:' + m[0] + '" tabindex="-1">' + m[1] + '</button>').join('') +
        '</div>' +
      '</div>' +

      '<div class="glass-box">' +
        '<div style="font-weight:700;margin-bottom:12px">Bộ chủ đề gợi ý</div>' +
        '<div class="chips-row" style="margin:0">' +
          THEME_PRESETS.map((pr) => '<button class="chip tv-focus ' + (state.prefs.presetId === pr.id ? 'active' : '') + '" data-preset="' + pr.id + '" data-focus-key="preset:' + pr.id + '" tabindex="-1">' + esc(pr.name) + '</button>').join('') +
        '</div>' +
      '</div>' +

      '<div class="settings-card">' +
        '<div class="s-row" style="cursor:default">' +
          '<span>Màu nhấn nổi bật</span>' +
          '<div class="swatch-row">' +
            ACCENT_PRESETS.map((a) => '<button class="swatch tv-focus ' + (state.prefs.accent.toLowerCase() === a.hex.toLowerCase() ? 'active' : '') + '" style="background:' + a.hex + '" data-accent="' + a.hex + '" data-focus-key="accent:' + a.id + '" tabindex="-1" title="' + a.name + '"></button>').join('') +
          '</div>' +
        '</div>' +
        '<button class="s-row tv-focus" id="btnToggleUltraSmooth" data-focus-key="theme:ultrasmooth" tabindex="-1">' +
          '<div><div>Chế độ Siêu Mượt TV</div><div class="s-sub">Tối ưu 60fps trên TV GPU, tắt đổ bóng nặng khi cuộn</div></div>' +
          '<span class="pill-toggle ' + (state.prefs.ultraSmooth !== false ? 'on' : '') + '">' + (state.prefs.ultraSmooth !== false ? 'BẬT' : 'TẮT') + '</span>' +
        '</button>' +
        '<button class="s-row tv-focus" id="btnToggleAmbient" data-focus-key="theme:ambient" tabindex="-1">' +
          '<span>Ánh nền theo màu chủ đạo</span>' +
          '<span class="pill-toggle ' + (state.prefs.ambient ? 'on' : '') + '">' + (state.prefs.ambient ? 'BẬT' : 'TẮT') + '</span>' +
        '</button>' +
        (state.user ? '<button class="s-row tv-focus" id="btnSyncTheme" data-focus-key="theme:sync" tabindex="-1"><span style="display:inline-flex;align-items:center;color:var(--accent);font-weight:700">' + svgIcon('cloudUp', 18) + '<span style="margin-left:8px">Đồng bộ giao diện lên tài khoản</span></span></button>' : '') +
      '</div>' +
    '</div>';
  }

  function openPlayer(movie, servers, serverIndex, episodeIndex, resumeTime) {
    const srv = servers[serverIndex] || { server_data: [] };
    const ep = srv.server_data[episodeIndex];
    if (!ep || !ep.link_m3u8) {
      toast('Tập này chưa có luồng HLS');
      return;
    }

    if (state.player && typeof state.player.destroy === 'function') {
      state.player.destroy();
    }

    const root = document.getElementById('playerRoot');
    const rawUrl = ep.link_m3u8.trim();
    const cleanUrl = API_BASE + '/api/clean-m3u8?url=' + encodeURIComponent(rawUrl);

    let hls = null;
    let markers = [];
    const skippedIds = new Set();
    let lastSave = -999;
    let hudHidden = false;
    let hudTimer = null;
    let osdTimer = null;
    let drawerOpen = false;
    let activeSkipObj = null;
    let resumeApplied = false;
    let levels = [];
    let currentLevel = -1;
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    let speedIdx = 1;
    const aspects = [
      ['fit', 'Gốc', ''],
      ['16x9', '16:9', 'aspect-16x9'],
      ['4x3', '4:3', 'aspect-4x3'],
      ['21x9', '21:9', 'aspect-21x9'],
      ['fill', 'Tràn viền', 'aspect-fill']
    ];
    let aspectIdx = 0;

    root.innerHTML = '<div id="playerOverlay" class="player-overlay">' +
      '<div id="playerStage" class="player-stage">' +
        '<video id="videoEl" autoplay playsinline></video>' +
        '<div id="seekOsd" class="seek-osd hidden"></div>' +
        '<button id="btnSkipMarker" class="skip-floating tv-focus hidden" data-focus-key="player:skip" tabindex="-1"><span>Bỏ qua mở đầu</span>' + svgIcon('forward', 18) + '</button>' +
      '</div>' +
      '<div class="player-hud-top">' +
        '<div style="min-width:0">' +
          '<div style="font-weight:800;font-size:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(movie.name) + ' — ' + esc(ep.name) + '</div>' +
          '<div id="playerSourceLbl" style="font-size:15px;color:#a8b0c4;margin-top:3px">Nguồn: Chuẩn (clean-m3u8)</div>' +
        '</div>' +
        '<div class="player-btn-group">' +
          '<button class="tb-btn tv-focus" id="btnPlayerDrawer" data-focus-key="player:drawer" tabindex="-1">' + svgIcon('list', 18) + '<span>Tập & Nguồn</span></button>' +
          '<button class="tb-btn tv-focus" id="btnPlayerClose" data-focus-key="player:close" tabindex="-1">' + svgIcon('close', 18) + '<span>Đóng</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="player-hud-bottom">' +
        '<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;margin-bottom:4px">' +
          '<span id="lblCurTime">00:00</span>' +
          '<span id="lblDurTime">00:00</span>' +
        '</div>' +
        '<div id="playerScrubber" class="player-scrubber tv-focus" data-focus-key="player:scrub" tabindex="-1">' +
          '<div id="scrubBuf" class="player-scrubber-buf" style="width:0%"></div>' +
          '<div id="scrubFill" class="player-scrubber-fill" style="width:0%"></div>' +
          '<div id="scrubMarkers"></div>' +
        '</div>' +
        '<div class="player-btn-row">' +
          '<div class="player-btn-group">' +
            '<button class="tb-btn tv-focus" id="btnPlayPause" data-focus-key="player:play" tabindex="-1">' + svgIcon('pause', 18) + '<span>Tạm dừng</span></button>' +
            '<button class="tb-btn tv-focus" id="btnSeekBack" data-focus-key="player:rew" tabindex="-1">' + svgIcon('rew', 18) + '<span>-15s</span></button>' +
            '<button class="tb-btn tv-focus" id="btnSeekFwd" data-focus-key="player:ff" tabindex="-1">' + svgIcon('ff', 18) + '<span>+15s</span></button>' +
            '<button class="tb-btn tv-focus" id="btnPrevEp" data-focus-key="player:prev" tabindex="-1"' + (episodeIndex <= 0 ? ' disabled style="opacity:0.4"' : '') + '>' + svgIcon('prev', 18) + '<span>Tập trước</span></button>' +
            '<button class="tb-btn tv-focus" id="btnNextEp" data-focus-key="player:next" tabindex="-1"' + (episodeIndex + 1 >= srv.server_data.length ? ' disabled style="opacity:0.4"' : '') + '>' + svgIcon('next', 18) + '<span>Tập sau</span></button>' +
          '</div>' +
          '<div class="player-btn-group">' +
            '<button class="tb-btn tv-focus" id="btnPlayerQuality" data-focus-key="player:quality" tabindex="-1">Chất lượng: Tự động</button>' +
            '<button class="tb-btn tv-focus" id="btnPlayerSpeed" data-focus-key="player:speed" tabindex="-1">Tốc độ: 1x</button>' +
            '<button class="tb-btn tv-focus" id="btnPlayerAspect" data-focus-key="player:aspect" tabindex="-1">Tỉ lệ: Gốc</button>' +
            '<button class="tb-btn tv-focus" id="btnFailover" data-focus-key="player:failover" tabindex="-1">Đổi nguồn</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="playerDrawer" class="player-drawer hidden"></div>' +
    '</div>';

    const overlay = document.getElementById('playerOverlay');
    const video = document.getElementById('videoEl');
    const stage = document.getElementById('playerStage');
    const skipBtn = document.getElementById('btnSkipMarker');
    const drawer = document.getElementById('playerDrawer');
    const osd = document.getElementById('seekOsd');

    function showHud(autoHide) {
      hudHidden = false;
      overlay.classList.remove('hud-hidden');
      clearTimeout(hudTimer);
      if (autoHide !== false && !video.paused && !drawerOpen) {
        hudTimer = setTimeout(() => {
          hudHidden = true;
          overlay.classList.add('hud-hidden');
        }, 4200);
      }
    }

    function showOsd(text) {
      osd.textContent = text;
      osd.classList.remove('hidden');
      clearTimeout(osdTimer);
      osdTimer = setTimeout(() => osd.classList.add('hidden'), 1200);
    }

    function seekBy(delta) {
      const dur = video.duration || 0;
      const target = Math.max(0, Math.min(dur || Infinity, (video.currentTime || 0) + delta));
      video.currentTime = target;
      showOsd((delta > 0 ? '+' : '') + delta + 's (' + formatTime(target) + ')');
      showHud(true);
    }

    function saveProgress(force) {
      const t = video.currentTime || 0;
      const dur = video.duration || 0;
      if (!force && (t <= 5 || Math.abs(t - lastSave) < 12)) return;
      if (t <= 3) return;
      lastSave = t;
      const entry = {
        slug: movie.slug,
        name: movie.name,
        poster: movie.poster_url || movie.thumb_url,
        episodeIndex,
        episodeName: ep.name,
        currentTime: t,
        duration: dur
      };
      state.history = [entry].concat(state.history.filter((x) => x.slug !== movie.slug)).slice(0, 40);
      localStorage.setItem('mf.history', JSON.stringify(state.history));
      if (state.token) {
        api('/api/user/history', { method: 'POST', json: entry }).catch(() => {});
      }
    }

    function renderMarkersOnScrubber() {
      const box = document.getElementById('scrubMarkers');
      const dur = video.duration || 0;
      if (!box || !dur || !markers.length) return;
      box.innerHTML = markers.map((mk) => {
        const startPct = Math.max(0, Math.min(100, (mk.start / dur) * 100));
        const end = mk.openEnd ? dur : Math.min(dur, mk.end);
        const widthPct = Math.max(0.6, ((end - mk.start) / dur) * 100);
        return '<div class="player-marker-tick" style="left:' + startPct + '%;width:' + widthPct + '%"></div>';
      }).join('');
    }

    function updateQualityButton() {
      const btn = document.getElementById('btnPlayerQuality');
      if (!btn) return;
      if (!levels.length) {
        btn.textContent = 'Chất lượng: Tự động';
        return;
      }
      if (currentLevel < 0 || !levels[currentLevel]) {
        btn.textContent = 'Chất lượng: Tự động';
      } else {
        const h = levels[currentLevel].height;
        btn.textContent = 'Chất lượng: ' + (h ? h + 'p' : 'Mức ' + (currentLevel + 1));
      }
    }

    function attachStream(srcUrl, label) {
      const lbl = document.getElementById('playerSourceLbl');
      if (lbl) lbl.textContent = 'Nguồn: ' + label;
      if (hls) { hls.destroy(); hls = null; }
      levels = [];
      currentLevel = -1;
      updateQualityButton();

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          maxBufferLength: 24,
          maxMaxBufferLength: 45,
          backBufferLength: 10
        });
        hls.loadSource(srcUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, (_, data) => {
          levels = (data && data.levels) ? data.levels : (hls.levels || []);
          updateQualityButton();
        });
        hls.on(window.Hls.Events.ERROR, (_, data) => {
          if (data && data.fatal) {
            if (srcUrl !== rawUrl) {
              attachStream(rawUrl, 'Dự phòng (gốc)');
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              if (hls) { hls.destroy(); hls = null; }
              video.src = rawUrl;
            }
          }
        });
      } else {
        video.src = srcUrl;
      }
    }

    attachStream(cleanUrl, 'Chuẩn (clean-m3u8)');

    const epDigits = (ep.slug || String(episodeIndex + 1)).replace(/\D+/g, '') || '1';
    const titleHint = movie.origin_name || movie.name || '';
    api('/api/ads/' + encodeURIComponent(movie.slug) + '/' + encodeURIComponent(epDigits) + '?title=' + encodeURIComponent(titleHint))
      .then((r) => {
        markers = r.markers || [];
        renderMarkersOnScrubber();
      })
      .catch(() => {});

    function renderDrawer() {
      const curSrv = servers[serverIndex] || { server_data: [] };
      drawer.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<strong style="font-size:22px">Chọn tập & Nguồn</strong>' +
        '<button class="tb-btn tv-focus" id="btnCloseDrawer" data-focus-key="drawer:close" tabindex="-1">' + svgIcon('close', 18) + '<span>Đóng</span></button>' +
      '</div>' +
      '<div class="chips-row" style="margin-bottom:12px">' +
        servers.map((s, idx) => '<button class="chip tv-focus ' + (idx === serverIndex ? 'active' : '') + '" data-dsrv="' + idx + '" data-focus-key="dsrv:' + idx + '" tabindex="-1">' + esc(s.server_name) + '</button>').join('') +
      '</div>' +
      '<div class="player-drawer-body">' +
        '<div class="ep-grid">' +
          (curSrv.server_data || []).map((item, idx) => '<button class="ep-btn tv-focus ' + (idx === episodeIndex ? 'active' : '') + '" data-dep="' + idx + '" data-focus-key="dep:' + idx + '" tabindex="-1">' + esc(item.name) + '</button>').join('') +
        '</div>' +
      '</div>';

      document.getElementById('btnCloseDrawer').onclick = () => {
        drawerOpen = false;
        drawer.classList.add('hidden');
        showHud(true);
        focusByKey('player:drawer');
      };
      drawer.querySelectorAll('[data-dsrv]').forEach((el) => {
        el.onclick = () => {
          const newSrv = parseInt(el.getAttribute('data-dsrv'), 10) || 0;
          closePlayer();
          openPlayer(movie, servers, newSrv, 0, 0);
        };
      });
      drawer.querySelectorAll('[data-dep]').forEach((el) => {
        el.onclick = () => {
          const newEp = parseInt(el.getAttribute('data-dep'), 10) || 0;
          closePlayer();
          openPlayer(movie, servers, serverIndex, newEp, 0);
        };
      });
    }

    function openDrawer() {
      drawerOpen = true;
      drawer.classList.remove('hidden');
      renderDrawer();
      focusByKey('dep:' + episodeIndex) || focusByKey('drawer:close');
    }

    function closePlayer() {
      clearTimeout(hudTimer);
      clearTimeout(osdTimer);
      saveProgress(true);
      if (hls) { hls.destroy(); hls = null; }
      video.pause();
      video.removeAttribute('src');
      root.innerHTML = '';
      state.player = null;
      if (state.detailSlug) render();
      else focusByKey(state.lastFocusKey) || focusFirstInMain();
    }

    function togglePlayPause() {
      if (video.paused) {
        video.play().catch(() => {});
        showOsd('Phát');
      } else {
        video.pause();
        showOsd('Tạm dừng');
      }
      showHud(true);
    }

    document.getElementById('btnPlayPause').onclick = togglePlayPause;
    document.getElementById('btnSeekBack').onclick = () => seekBy(-15);
    document.getElementById('btnSeekFwd').onclick = () => seekBy(15);
    document.getElementById('btnPlayerClose').onclick = closePlayer;
    document.getElementById('btnPlayerDrawer').onclick = openDrawer;
    document.getElementById('btnPrevEp').onclick = () => {
      if (episodeIndex > 0) { closePlayer(); openPlayer(movie, servers, serverIndex, episodeIndex - 1, 0); }
    };
    document.getElementById('btnNextEp').onclick = () => {
      if (episodeIndex + 1 < srv.server_data.length) { closePlayer(); openPlayer(movie, servers, serverIndex, episodeIndex + 1, 0); }
    };
    document.getElementById('btnPlayerAspect').onclick = () => {
      aspectIdx = (aspectIdx + 1) % aspects.length;
      stage.className = 'player-stage ' + aspects[aspectIdx][2];
      document.getElementById('btnPlayerAspect').textContent = 'Tỉ lệ: ' + aspects[aspectIdx][1];
      showHud(true);
    };
    document.getElementById('btnPlayerSpeed').onclick = () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      video.playbackRate = speeds[speedIdx];
      document.getElementById('btnPlayerSpeed').textContent = 'Tốc độ: ' + speeds[speedIdx] + 'x';
      showHud(true);
    };
    document.getElementById('btnPlayerQuality').onclick = () => {
      if (!hls || !levels.length) {
        toast('Đang phát chất lượng tự động');
        return;
      }
      if (currentLevel < 0) currentLevel = levels.length - 1;
      else currentLevel = currentLevel - 1;
      hls.currentLevel = currentLevel;
      updateQualityButton();
      showHud(true);
    };
    document.getElementById('btnFailover').onclick = () => {
      const lbl = document.getElementById('playerSourceLbl');
      const isClean = lbl && lbl.textContent.indexOf('Chuẩn') !== -1;
      attachStream(isClean ? rawUrl : cleanUrl, isClean ? 'Dự phòng (gốc)' : 'Chuẩn (clean-m3u8)');
      showHud(true);
    };
    document.getElementById('playerScrubber').onclick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
      if (video.duration) video.currentTime = ratio * video.duration;
      showHud(true);
    };

    video.onloadedmetadata = () => {
      if (!resumeApplied && resumeTime && resumeTime > 5 && (!video.duration || resumeTime < video.duration - 15)) {
        resumeApplied = true;
        video.currentTime = resumeTime;
        toast('Tiếp tục từ ' + formatTime(resumeTime));
      }
      renderMarkersOnScrubber();
    };
    video.onplay = () => {
      const btn = document.getElementById('btnPlayPause');
      if (btn) btn.innerHTML = svgIcon('pause', 18) + '<span>Tạm dừng</span>';
      showHud(true);
    };
    video.onpause = () => {
      const btn = document.getElementById('btnPlayPause');
      if (btn) btn.innerHTML = svgIcon('play', 18) + '<span>Phát</span>';
      showHud(false);
    };

    video.ontimeupdate = () => {
      const t = video.currentTime || 0;
      const dur = video.duration || 0;
      const lblCur = document.getElementById('lblCurTime');
      const lblDur = document.getElementById('lblDurTime');
      const fill = document.getElementById('scrubFill');
      const buf = document.getElementById('scrubBuf');
      if (lblCur) lblCur.textContent = formatTime(t);
      if (lblDur) lblDur.textContent = formatTime(dur);
      if (fill && dur > 0) fill.style.width = Math.min(100, (t / dur) * 100) + '%';
      if (buf && dur > 0 && video.buffered && video.buffered.length > 0) {
        const endBuf = video.buffered.end(video.buffered.length - 1);
        buf.style.width = Math.min(100, (endBuf / dur) * 100) + '%';
      }

      activeSkipObj = null;
      for (let i = 0; i < markers.length; i++) {
        const mk = markers[i];
        const end = mk.openEnd && dur > mk.start ? dur : mk.end;
        const mode = mk.mode || (mk.type === 'ad' ? 'cut' : 'skip');
        if (mode === 'cut' && state.prefs.autoCutAds && !skippedIds.has(mk.id) && t >= mk.start && t < end) {
          skippedIds.add(mk.id);
          video.currentTime = end + 0.1;
          toast('Đã tự động bỏ qua quảng cáo');
          return;
        }
        if (mode === 'skip' && state.prefs.introSkip !== 'off' && t >= mk.start && t < end - 0.5 && !skippedIds.has(mk.id)) {
          if (state.prefs.introSkip === 'auto') {
            skippedIds.add(mk.id);
            video.currentTime = end + 0.1;
            toast('Đã tự động bỏ qua mở đầu');
            return;
          }
          activeSkipObj = { mk, end };
        }
      }

      if (activeSkipObj) {
        const wasHidden = skipBtn.classList.contains('hidden');
        const lbl = activeSkipObj.mk.type === 'outro' ? 'Bỏ qua kết thúc (OK)' : (activeSkipObj.mk.label || 'Bỏ qua mở đầu (OK)');
        skipBtn.innerHTML = '<span>' + esc(lbl) + '</span>' + svgIcon('forward', 18);
        skipBtn.classList.remove('hidden');
        skipBtn.onclick = () => {
          if (!activeSkipObj) return;
          skippedIds.add(activeSkipObj.mk.id);
          video.currentTime = activeSkipObj.end + 0.1;
          skipBtn.classList.add('hidden');
          activeSkipObj = null;
        };
        if (wasHidden && hudHidden) {
          skipBtn.focus({ preventScroll: true });
        }
      } else {
        skipBtn.classList.add('hidden');
      }

      saveProgress(false);
    };

    video.onended = () => {
      if (state.prefs.autoNext && episodeIndex + 1 < srv.server_data.length) {
        closePlayer();
        openPlayer(movie, servers, serverIndex, episodeIndex + 1, 0);
      } else {
        showHud(false);
      }
    };

    overlay.onmousemove = () => showHud(true);

    state.player = {
      isHudHidden: () => hudHidden,
      isDrawerOpen: () => drawerOpen,
      hasActiveSkip: () => Boolean(activeSkipObj),
      triggerSkip: () => { if (skipBtn && !skipBtn.classList.contains('hidden')) skipBtn.click(); },
      closeDrawer: () => {
        drawerOpen = false;
        drawer.classList.add('hidden');
        showHud(true);
        focusByKey('player:drawer');
      },
      showHud,
      togglePlayPause,
      play: () => { video.play().catch(() => {}); showOsd('Phát'); showHud(true); },
      pause: () => { video.pause(); showOsd('Tạm dừng'); showHud(true); },
      seekBy,
      close: closePlayer
    };

    showHud(true);
    focusByKey('player:play');
  }

  function openAuthModal() {
    const root = document.getElementById('modalRoot');
    let reg = false;
    const draw = () => {
      root.innerHTML = '<div class="modal-backdrop" id="authBackdrop">' +
        '<div class="modal-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
            '<strong style="font-size:22px">' + (state.user ? 'Tài khoản ManiFlix' : (reg ? 'Đăng ký' : 'Đăng nhập')) + '</strong>' +
            '<button class="tb-btn tv-focus" id="btnCloseAuth" data-focus-key="auth:close" tabindex="-1" style="margin:0">' + svgIcon('close', 18) + '</button>' +
          '</div>' +
          (state.user ?
            '<div class="s-sub" style="margin-bottom:16px;font-size:16px">Đang đăng nhập: <strong>@' + esc(state.user.username) + '</strong></div>' +
            '<button class="btn-accent tv-focus" style="width:100%;margin:0" id="btnDoLogout" data-focus-key="auth:logout" tabindex="-1">Đăng xuất</button>'
            :
            '<div class="seg-tabs" style="grid-template-columns:1fr 1fr;margin-bottom:16px">' +
              '<button class="seg-btn tv-focus ' + (!reg ? 'active' : '') + '" id="tabLogin" data-focus-key="auth:tlogin" tabindex="-1">Đăng nhập</button>' +
              '<button class="seg-btn tv-focus ' + (reg ? 'active' : '') + '" id="tabReg" data-focus-key="auth:treg" tabindex="-1">Đăng ký</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column">' +
              '<input id="authUser" class="search-input tv-focus" data-focus-key="auth:user" placeholder="Tên đăng nhập" style="margin:0 0 10px" />' +
              (reg ? '<input id="authDisp" class="search-input tv-focus" data-focus-key="auth:disp" placeholder="Tên hiển thị" style="margin:0 0 10px" />' : '') +
              '<input id="authPass" type="password" class="search-input tv-focus" data-focus-key="auth:pass" placeholder="Mật khẩu" style="margin:0 0 10px" />' +
              '<div id="authErr" style="color:#ff453a;font-size:15px;margin-bottom:10px"></div>' +
              '<button class="btn-accent tv-focus" id="btnAuthSubmit" data-focus-key="auth:submit" tabindex="-1" style="margin:0">' + (reg ? 'Tạo tài khoản' : 'Đăng nhập') + '</button>' +
            '</div>'
          ) +
        '</div>' +
      '</div>';

      const closeModal = () => {
        root.innerHTML = '';
        focusByKey(state.lastFocusKey) || focusFirstInMain();
      };
      document.getElementById('btnCloseAuth').onclick = closeModal;
      document.getElementById('authBackdrop').onclick = (e) => { if (e.target.id === 'authBackdrop') closeModal(); };
      if (state.user) {
        document.getElementById('btnDoLogout').onclick = () => {
          state.token = '';
          state.user = null;
          state.favorites = [];
          localStorage.removeItem('mf.token');
          updateAccountUI();
          closeModal();
          render();
        };
        focusByKey('auth:logout');
      } else {
        document.getElementById('tabLogin').onclick = () => { reg = false; draw(); };
        document.getElementById('tabReg').onclick = () => { reg = true; draw(); };
        document.getElementById('btnAuthSubmit').onclick = async () => {
          const username = document.getElementById('authUser').value.trim();
          const password = document.getElementById('authPass').value;
          const displayName = reg ? document.getElementById('authDisp').value.trim() : '';
          try {
            const r = await api(reg ? '/api/auth/register' : '/api/auth/login', {
              method: 'POST',
              json: reg ? { username, password, displayName: displayName || username } : { username, password }
            });
            if (r.token) {
              state.token = r.token;
              state.user = r.user;
              localStorage.setItem('mf.token', r.token);
              await refreshLibrary();
              updateAccountUI();
              closeModal();
              render();
              toast('Đăng nhập thành công');
            } else {
              document.getElementById('authErr').textContent = r.error || 'Lỗi đăng nhập';
            }
          } catch (e) {
            document.getElementById('authErr').textContent = e.message;
          }
        };
        focusByKey('auth:user');
      }
    };
    draw();
  }

  function render() {
    const activeEl = document.activeElement;
    if (activeEl && activeEl.dataset && activeEl.dataset.focusKey) {
      state.lastFocusKey = activeEl.dataset.focusKey;
    }

    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === state.tab);
    });

    const mc = document.getElementById('mainContent');
    if (state.detailSlug) {
      mc.innerHTML = renderDetail();
    } else if (state.tab === 'discover') {
      mc.innerHTML = renderDiscover();
    } else if (state.tab === 'search') {
      mc.innerHTML = renderSearch();
    } else if (state.tab === 'library') {
      mc.innerHTML = renderLibrary();
    } else if (state.tab === 'monitor') {
      mc.innerHTML = renderMonitorPage();
    } else {
      mc.innerHTML = renderSettings();
    }
    bindDynamicEvents();
    if (!state.player && !document.getElementById('modalRoot').innerHTML) {
      focusByKey(state.lastFocusKey);
    }
    if (state.tab === 'monitor' && !state.detailSlug && state.monitor.dlSeries.length) {
      drawChart('canvasNetSpeed', state.monitor.dlSeries, state.monitor.ulSeries, '#30D158', '#0A84FF');
      drawChart('canvasPingLoad', state.monitor.pingSeries, state.monitor.serverCpuSeries, '#FF9F0A', '#FA2D48');
    }
  }

  function bindDynamicEvents() {
    const mc = document.getElementById('mainContent');
    mc.onclick = (e) => {
      const slugBtn = e.target && e.target.closest ? e.target.closest('[data-slug]') : null;
      if (slugBtn) { openDetail(slugBtn.dataset.slug); return; }
      const openBtn = e.target && e.target.closest ? e.target.closest('[data-open-slug]') : null;
      if (openBtn) { openDetail(openBtn.dataset.openSlug); return; }
      const playDirectBtn = e.target && e.target.closest ? e.target.closest('[data-play-direct]') : null;
      if (playDirectBtn) { playMovieDirect(playDirectBtn.dataset.playDirect); return; }
    };
    mc.querySelectorAll('[data-cat]').forEach((el) => {
      el.onclick = () => selectCategory(el.dataset.cat);
    });
    mc.querySelectorAll('[data-hero-idx]').forEach((el) => {
      el.onclick = () => { state.heroIdx = parseInt(el.dataset.heroIdx, 10) || 0; updateHeroInPlace(); };
    });
    const hPrev = document.getElementById('btnHeroPrev');
    if (hPrev) hPrev.onclick = () => {
      const len = Math.min(6, state.heroMovies.filter((m) => !isBlocked(m.slug)).length);
      if (len) { state.heroIdx = (state.heroIdx - 1 + len) % len; updateHeroInPlace(); }
    };
    const hNext = document.getElementById('btnHeroNext');
    if (hNext) hNext.onclick = () => {
      const len = Math.min(6, state.heroMovies.filter((m) => !isBlocked(m.slug)).length);
      if (len) { state.heroIdx = (state.heroIdx + 1) % len; updateHeroInPlace(); }
    };
    const btnMore = document.getElementById('btnLoadMore');
    if (btnMore) btnMore.onclick = loadMoreDiscover;

    mc.querySelectorAll('[data-fav-slug]').forEach((el) => {
      el.onclick = async () => {
        if (!state.token) { openAuthModal(); return; }
        const slug = el.getAttribute('data-fav-slug');
        const m = state.heroMovies.find((x) => x.slug === slug);
        if (!m) return;
        try {
          const r = await api('/api/user/favorites/toggle', {
            method: 'POST',
            json: { slug: m.slug, name: m.name, poster: m.poster_url || m.thumb_url || '', year: m.year || 0, quality: m.quality || 'HD', lang: m.lang || 'Vietsub' }
          });
          if (Array.isArray(r.favorites)) state.favorites = r.favorites;
          const favActive = isFavorite(m.slug);
          el.innerHTML = svgIcon(favActive ? 'check' : 'plus', 18) + '<span>' + (favActive ? 'Đã lưu' : 'Tủ phim') + '</span>';
          toast(favActive ? 'Đã lưu vào tủ phim' : 'Đã xoá khỏi tủ phim');
        } catch (e) {}
      };
    });

    const backBtn = document.getElementById('btnDetailBack');
    if (backBtn) backBtn.onclick = navigateBack;
    const toggleFr = document.getElementById('btnToggleFranchise');
    if (toggleFr) toggleFr.onclick = () => { state.franchiseExpanded = !state.franchiseExpanded; render(); };
    mc.querySelectorAll('[data-srv-idx]').forEach((el) => {
      el.onclick = () => { state.selectedServerIdx = parseInt(el.dataset.srvIdx, 10) || 0; render(); };
    });
    mc.querySelectorAll('[data-play-ep]').forEach((el) => {
      el.onclick = () => {
        const epIdx = parseInt(el.dataset.playEp, 10) || 0;
        openPlayer(state.detailData.movie, state.detailData.episodes || [], state.selectedServerIdx, epIdx, 0);
      };
    });
    const dPlay = document.getElementById('btnDetailPlay');
    if (dPlay) dPlay.onclick = () => {
      const m = state.detailData.movie;
      const srv = (state.detailData.episodes || [])[state.selectedServerIdx] || { server_data: [] };
      const hist = state.history.find((h) => h.slug === m.slug);
      const epIdx = hist && Number.isInteger(hist.episodeIndex) && hist.episodeIndex < srv.server_data.length ? hist.episodeIndex : 0;
      const resumeSec = hist && hist.episodeIndex === epIdx && hist.currentTime > 5 ? hist.currentTime : 0;
      openPlayer(m, state.detailData.episodes || [], state.selectedServerIdx, epIdx, resumeSec);
    };
    const dFav = document.getElementById('btnDetailFav');
    if (dFav) dFav.onclick = async () => {
      if (!state.token) { openAuthModal(); return; }
      const m = state.detailData.movie;
      const r = await api('/api/user/favorites/toggle', {
        method: 'POST',
        json: { slug: m.slug, name: m.name, poster: m.poster_url || m.thumb_url || '', year: m.year || 0, quality: m.quality || 'HD', lang: m.lang || 'Vietsub' }
      });
      if (Array.isArray(r.favorites)) state.favorites = r.favorites;
      const favActive = isFavorite(m.slug);
      dFav.innerHTML = svgIcon(favActive ? 'check' : 'bookmark', 18) + '<span>' + (favActive ? 'Đã lưu' : 'Lưu') + '</span>';
      toast(favActive ? 'Đã lưu vào tủ phim' : 'Đã xoá khỏi tủ phim');
    };
    const dBlock = document.getElementById('btnDetailBlock');
    if (dBlock) dBlock.onclick = () => {
      const m = state.detailData.movie;
      if (!isBlocked(m.slug)) {
        state.blocked.unshift({ slug: m.slug, name: m.name, poster: m.poster_url || m.thumb_url });
        localStorage.setItem('mf.blocked', JSON.stringify(state.blocked));
      }
      state.detailSlug = null;
      toast('Đã ẩn "' + m.name + '"');
      render();
    };

    const sInput = document.getElementById('searchInput');
    if (sInput) {
      sInput.oninput = (e) => {
        clearTimeout(searchDebounce);
        const val = e.target.value;
        state.searchQuery = val;
        searchDebounce = setTimeout(() => runSearch(val, 1), 360);
      };
      sInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.stopPropagation();
          runSearch(sInput.value, 1);
        }
      };
    }
    const sBtn = document.getElementById('btnRunSearch');
    if (sBtn) sBtn.onclick = () => runSearch(state.searchQuery, 1);
    const sMore = document.getElementById('btnLoadMoreSearch');
    if (sMore) sMore.onclick = () => runSearch(state.searchQuery, state.searchPage + 1);
    mc.querySelectorAll('[data-search-topic]').forEach((el) => {
      el.onclick = () => runSearch(el.dataset.searchTopic, 1);
    });
    mc.querySelectorAll('[data-kbd]').forEach((el) => {
      el.onclick = () => {
        const k = el.dataset.kbd;
        if (k === 'SPACE') state.searchQuery += ' ';
        else if (k === 'DEL') state.searchQuery = state.searchQuery.slice(0, -1);
        else if (k === 'CLEAR') { state.searchQuery = ''; state.searchResults = []; }
        else if (k === 'SEARCH') { runSearch(state.searchQuery, 1); return; }
        else state.searchQuery += k.toLowerCase();
        const inp = document.getElementById('searchInput');
        if (inp) inp.value = state.searchQuery;
      };
    });

    mc.querySelectorAll('[data-lib-seg]').forEach((el) => {
      el.onclick = () => { state.librarySeg = el.dataset.libSeg; render(); };
    });
    const libLogin = document.getElementById('btnLibLogin');
    if (libLogin) libLogin.onclick = openAuthModal;
    mc.querySelectorAll('[data-del-hist]').forEach((el) => {
      el.onclick = () => {
        const slug = el.dataset.delHist;
        state.history = state.history.filter((x) => x.slug !== slug);
        localStorage.setItem('mf.history', JSON.stringify(state.history));
        if (state.token) api('/api/user/history/delete', { method: 'POST', json: { slug } }).catch(() => {});
        render();
      };
    });
    mc.querySelectorAll('[data-unblock]').forEach((el) => {
      el.onclick = () => {
        state.blocked = state.blocked.filter((b) => b.slug !== el.dataset.unblock);
        localStorage.setItem('mf.blocked', JSON.stringify(state.blocked));
        render();
      };
    });

    const sAuth = document.getElementById('btnSettingsAuth');
    if (sAuth) sAuth.onclick = openAuthModal;
    const sMon = document.getElementById('btnSettingsMonitor');
    if (sMon) sMon.onclick = () => switchTab('monitor');
    mc.querySelectorAll('[data-subpage]').forEach((el) => {
      el.onclick = () => { state.settingsSubPage = el.dataset.subpage; render(); focusFirstInMain(); };
    });

    const btnAds = document.getElementById('btnToggleAutoAds');
    if (btnAds) btnAds.onclick = () => { state.prefs.autoCutAds = !state.prefs.autoCutAds; savePrefs(); render(); };
    const btnSkip = document.getElementById('btnCycleIntroSkip');
    if (btnSkip) btnSkip.onclick = () => {
      const order = ['button', 'auto', 'off'];
      const idx = (order.indexOf(state.prefs.introSkip) + 1) % order.length;
      state.prefs.introSkip = order[idx];
      savePrefs();
      render();
    };
    const btnNext = document.getElementById('btnToggleAutoNext');
    if (btnNext) btnNext.onclick = () => { state.prefs.autoNext = !state.prefs.autoNext; savePrefs(); render(); };
    const btnReset = document.getElementById('btnResetPrefs');
    if (btnReset) btnReset.onclick = () => {
      state.prefs = { themeMode: 'dark', presetId: 'webos-midnight', accent: '#FA2D48', bg: '#0b0f19', surface: '#151b2b', ambient: true, ultraSmooth: true, autoCutAds: true, introSkip: 'button', autoNext: true };
      savePrefs();
      toast('Đã đặt lại mặc định');
      render();
    };

    mc.querySelectorAll('[data-theme-mode]').forEach((el) => {
      el.onclick = () => { state.prefs.themeMode = el.dataset.themeMode; savePrefs(); render(); };
    });
    mc.querySelectorAll('[data-preset]').forEach((el) => {
      el.onclick = () => {
        const pr = THEME_PRESETS.find((p) => p.id === el.dataset.preset);
        if (!pr) return;
        state.prefs.presetId = pr.id;
        state.prefs.themeMode = pr.mode;
        state.prefs.accent = pr.accent;
        state.prefs.bg = pr.bg;
        state.prefs.surface = pr.surface;
        savePrefs();
        render();
      };
    });
    mc.querySelectorAll('[data-accent]').forEach((el) => {
      el.onclick = () => { state.prefs.accent = el.dataset.accent; savePrefs(); render(); };
    });
    const btnUltra = document.getElementById('btnToggleUltraSmooth');
    if (btnUltra) btnUltra.onclick = () => { state.prefs.ultraSmooth = !(state.prefs.ultraSmooth !== false); savePrefs(); render(); };
    const btnAmb = document.getElementById('btnToggleAmbient');
    if (btnAmb) btnAmb.onclick = () => { state.prefs.ambient = !state.prefs.ambient; savePrefs(); render(); };
    const btnSyncTheme = document.getElementById('btnSyncTheme');
    if (btnSyncTheme) btnSyncTheme.onclick = async () => {
      try {
        await api('/api/user/theme', { method: 'POST', json: { presetId: state.prefs.presetId, accent: state.prefs.accent, bg: state.prefs.bg, surface: state.prefs.surface } });
        toast('Đã đồng bộ giao diện lên tài khoản');
      } catch (e) { toast('Lỗi đồng bộ giao diện'); }
    };

    const btnSpeed = document.getElementById('btnRunSpeedtest');
    if (btnSpeed) btnSpeed.onclick = runTvSpeedtest;
  }

  function switchTab(tab) {
    if (state.player) state.player.close();
    const modal = document.getElementById('modalRoot');
    if (modal) modal.innerHTML = '';
    state.tab = tab;
    state.detailSlug = null;
    state.detailStack = [];
    if (tab !== 'settings') state.settingsSubPage = 'main';
    state.lastFocusKey = 'nav:' + tab;
    render();
    if (tab === 'monitor' && !state.monitor.testing) {
      runTvSpeedtest();
      focusByKey('mon:run');
    } else {
      focusFirstInMain() || focusByKey('nav:' + tab);
    }
  }

  function navigateBack() {
    const modal = document.getElementById('modalRoot');
    if (modal && modal.innerHTML.trim() !== '') {
      modal.innerHTML = '';
      focusByKey(state.lastFocusKey) || focusFirstInMain();
      return;
    }
    if (state.player) {
      if (state.player.isDrawerOpen()) {
        state.player.closeDrawer();
      } else {
        state.player.close();
      }
      return;
    }
    if (state.detailSlug) {
      if (state.detailStack.length > 0) {
        const prevSlug = state.detailStack.pop();
        openDetail(prevSlug, false);
      } else {
        state.detailSlug = null;
        render();
        focusFirstInMain();
      }
      return;
    }
    if (state.tab === 'settings' && state.settingsSubPage !== 'main') {
      state.settingsSubPage = 'main';
      render();
      focusByKey('set:theme');
      return;
    }
    if (state.tab !== 'discover') {
      switchTab('discover');
      return;
    }
    if (state.category !== 'all') {
      selectCategory('all');
      focusByKey('cat:all');
      return;
    }
    if (window.webOSSystem && typeof window.webOSSystem.platformBack === 'function') {
      window.webOSSystem.platformBack();
    } else {
      window.close();
    }
  }

  /* 2D Spatial Focus Navigation Engine */
  function getFocusContainer() {
    if (state.player) {
      if (state.player.isDrawerOpen()) return document.getElementById('playerDrawer');
      return document.getElementById('playerOverlay');
    }
    const modal = document.getElementById('modalRoot');
    if (modal && modal.innerHTML.trim() !== '') return modal;
    return document.getElementById('appShell');
  }

  function getFocusables(container) {
    if (!container) return [];
    const nodes = container.querySelectorAll('.tv-focus');
    const out = [];
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el.disabled || el.classList.contains('hidden')) continue;
      if (el.offsetWidth > 0 && el.offsetHeight > 0) out.push(el);
    }
    return out;
  }

  function getRelativeOffsetTop(el, root) {
    let top = 0;
    let node = el;
    while (node && node !== root) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  }

  function focusElement(el) {
    if (!el) return false;
    el.focus({ preventScroll: true });
    if (el.dataset && el.dataset.focusKey) {
      state.lastFocusKey = el.dataset.focusKey;
    }
    // Zero-reflow horizontal centering for rails/chips using offsetLeft
    const rail = el.closest('.rail, .chips-row');
    if (rail) {
      const targetLeft = Math.max(0, el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2);
      rail.scrollLeft = targetLeft;
    }
    // Zero-reflow vertical scroll for mainContent / drawer using accumulated offsetTop
    const mc = el.closest('#mainContent, .player-drawer-body');
    if (mc) {
      const relTop = getRelativeOffsetTop(el, mc);
      const viewTop = mc.scrollTop;
      const viewBottom = viewTop + mc.clientHeight;
      const elBottom = relTop + el.offsetHeight;
      if (relTop < viewTop + 36) {
        mc.scrollTop = Math.max(0, relTop - 36);
      } else if (elBottom > viewBottom - 36) {
        mc.scrollTop = elBottom - mc.clientHeight + 36;
      }
    }
    return true;
  }

  function focusByKey(key) {
    if (!key) return false;
    const container = getFocusContainer();
    if (!container) return false;
    const nodes = getFocusables(container);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].dataset && nodes[i].dataset.focusKey === key) {
        return focusElement(nodes[i]);
      }
    }
    return false;
  }

  function focusFirstInMain() {
    const mc = document.getElementById('mainContent');
    const items = getFocusables(mc);
    return items.length ? focusElement(items[0]) : false;
  }

  function jumpToActiveSidebar() {
    const activeNav = document.querySelector('#sidebar .nav-item.active') || document.querySelector('#sidebar .nav-item');
    return activeNav ? focusElement(activeNav) : false;
  }

  function getGridCols(gridEl, items) {
    if (gridEl.classList.contains('movie-grid')) return 6;
    if (!items.length) return 1;
    const firstTop = items[0].offsetTop;
    let cols = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].offsetTop === firstTop) cols++;
      else break;
    }
    return Math.max(1, cols);
  }

  function moveFocusSpatial(dir) {
    const container = getFocusContainer();
    const list = getFocusables(container);
    if (!list.length) return;

    const cur = document.activeElement;
    if (!cur || list.indexOf(cur) === -1) {
      focusElement(list[0]);
      return;
    }

    const inSidebar = Boolean(cur.closest('#sidebar'));
    const inMain = Boolean(cur.closest('#mainContent'));

    // O(1) indexed navigation for Sidebar vertical stack
    if (inSidebar) {
      if (dir === 'up' || dir === 'down') {
        const navItems = getFocusables(document.getElementById('sidebar'));
        const idx = navItems.indexOf(cur);
        if (idx !== -1) {
          if (dir === 'up' && idx > 0) { focusElement(navItems[idx - 1]); return; }
          if (dir === 'down' && idx + 1 < navItems.length) { focusElement(navItems[idx + 1]); return; }
        }
        return;
      }
      if (dir === 'right') {
        const mainList = getFocusables(document.getElementById('mainContent'));
        if (mainList.length) {
          const curRect = cur.getBoundingClientRect();
          let best = mainList[0];
          let bestDist = Infinity;
          for (let i = 0; i < mainList.length; i++) {
            const r = mainList[i].getBoundingClientRect();
            const d = Math.abs((r.top + r.height / 2) - (curRect.top + curRect.height / 2)) * 2 + r.left;
            if (d < bestDist) { bestDist = d; best = mainList[i]; }
          }
          focusElement(best);
          return;
        }
      }
    }

    // O(1) indexed navigation inside horizontal rows
    const hRow = cur.closest('.rail, .chips-row, .kbd-row, .detail-actions, .player-btn-group, .swatch-row, .hero-actions, .hero-nav-row');
    if (hRow && (dir === 'left' || dir === 'right')) {
      const rowItems = getFocusables(hRow);
      const idx = rowItems.indexOf(cur);
      if (idx !== -1) {
        if (dir === 'left') {
          if (idx > 0) { focusElement(rowItems[idx - 1]); return; }
          if (inMain) { jumpToActiveSidebar(); return; }
        } else if (dir === 'right') {
          if (idx + 1 < rowItems.length) { focusElement(rowItems[idx + 1]); return; }
        }
      }
    }

    // O(1) indexed navigation inside grids (.movie-grid, .ep-grid)
    const grid = cur.closest('.movie-grid, .ep-grid');
    if (grid) {
      const gridItems = getFocusables(grid);
      const idx = gridItems.indexOf(cur);
      if (idx !== -1) {
        const cols = getGridCols(grid, gridItems);
        const col = idx % cols;
        if (dir === 'left') {
          if (col > 0) { focusElement(gridItems[idx - 1]); return; }
          if (inMain) { jumpToActiveSidebar(); return; }
        } else if (dir === 'right') {
          if (col + 1 < cols && idx + 1 < gridItems.length) { focusElement(gridItems[idx + 1]); return; }
        } else if (dir === 'up') {
          if (idx - cols >= 0) { focusElement(gridItems[idx - cols]); return; }
        } else if (dir === 'down') {
          if (idx + cols < gridItems.length) { focusElement(gridItems[idx + cols]); return; }
        }
      }
    }

    // O(1) indexed navigation inside .settings-card vertical stack
    const sCard = cur.closest('.settings-card');
    if (sCard && (dir === 'up' || dir === 'down')) {
      const cardItems = getFocusables(sCard);
      const idx = cardItems.indexOf(cur);
      if (idx !== -1) {
        if (dir === 'up' && idx > 0) { focusElement(cardItems[idx - 1]); return; }
        if (dir === 'down' && idx + 1 < cardItems.length) { focusElement(cardItems[idx + 1]); return; }
      }
    }

    // Fallback 2D spatial scan ONLY when crossing sections (cached rects in single pass)
    const rects = new Array(list.length);
    for (let i = 0; i < list.length; i++) rects[i] = list[i].getBoundingClientRect();
    const curIdx = list.indexOf(cur);
    const cr = rects[curIdx];
    const cx = cr.left + cr.width / 2;
    const cy = cr.top + cr.height / 2;

    let bestEl = null;
    let bestScore = Infinity;

    for (let i = 0; i < list.length; i++) {
      if (i === curIdx) continue;
      const r = rects[i];
      const tx = r.left + r.width / 2;
      const ty = r.top + r.height / 2;
      const dx = tx - cx;
      const dy = ty - cy;

      let primary = 0;
      let perp = 0;
      let overlap = false;

      if (dir === 'right') {
        if (dx <= 6 || r.left < cr.left + 6) continue;
        primary = Math.max(1, r.left - cr.right) + dx * 0.25;
        perp = Math.abs(dy);
        overlap = !(r.bottom < cr.top || r.top > cr.bottom);
      } else if (dir === 'left') {
        if (dx >= -6 || r.right > cr.right - 6) continue;
        primary = Math.max(1, cr.left - r.right) + (-dx) * 0.25;
        perp = Math.abs(dy);
        overlap = !(r.bottom < cr.top || r.top > cr.bottom);
      } else if (dir === 'down') {
        if (dy <= 6 || r.top < cr.top + 6) continue;
        primary = Math.max(1, r.top - cr.bottom) + dy * 0.25;
        perp = Math.abs(dx);
        overlap = !(r.right < cr.left || r.left > cr.right);
      } else if (dir === 'up') {
        if (dy >= -6 || r.bottom > cr.bottom - 6) continue;
        primary = Math.max(1, cr.top - r.bottom) + (-dy) * 0.25;
        perp = Math.abs(dx);
        overlap = !(r.right < cr.left || r.left > cr.right);
      }

      const penalty = overlap ? perp * 0.85 : perp * 2.8 + 180;
      const score = primary + penalty;
      if (score < bestScore) {
        bestScore = score;
        bestEl = list[i];
      }
    }

    if (bestEl) {
      focusElement(bestEl);
    } else if (inMain && dir === 'left') {
      jumpToActiveSidebar();
    }
  }

  /* Magic Remote Pointer Sync (delta > 10px prevents cursor fighting D-Pad) */
  let lastMouseX = -1;
  let lastMouseY = -1;
  document.addEventListener('mousemove', (e) => {
    if (lastMouseX < 0) {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      return;
    }
    const dx = Math.abs(e.clientX - lastMouseX);
    const dy = Math.abs(e.clientY - lastMouseY);
    if (dx <= 10 && dy <= 10) return;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    document.body.classList.remove('dpad-mode');
    const t = e.target && e.target.closest ? e.target.closest('.tv-focus') : null;
    if (t && !t.disabled) {
      t.focus({ preventScroll: true });
      if (t.dataset && t.dataset.focusKey) state.lastFocusKey = t.dataset.focusKey;
    }
  }, { passive: true });

  /* Full LG webOS Remote + Keyboard Engine */
  let lastDpadTs = 0;
  document.addEventListener('keydown', (e) => {
    const code = e.keyCode || e.which;
    const active = document.activeElement;
    const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

    if (code === 37 || code === 38 || code === 39 || code === 40) {
      const now = performance.now();
      if (e.repeat && now - lastDpadTs < 75) {
        e.preventDefault();
        return;
      }
      lastDpadTs = now;
      document.body.classList.add('dpad-mode');
    } else if (code === 13 || code === 461 || (code >= 403 && code <= 417)) {
      document.body.classList.add('dpad-mode');
    }

    // LG Color Keys
    if (code === 403) { e.preventDefault(); switchTab('discover'); return; }
    if (code === 404) { e.preventDefault(); switchTab('search'); return; }
    if (code === 405) { e.preventDefault(); switchTab('library'); return; }
    if (code === 406) { e.preventDefault(); switchTab('monitor'); return; }

    // Back / Escape / Backspace
    if (code === 461 || code === 27 || (code === 8 && !isInput)) {
      e.preventDefault();
      navigateBack();
      return;
    }

    // Media Keys when player open
    if (state.player) {
      if (code === 415) { e.preventDefault(); state.player.play(); return; }
      if (code === 19) { e.preventDefault(); state.player.pause(); return; }
      if (code === 413) { e.preventDefault(); state.player.close(); return; }
      if (code === 412) { e.preventDefault(); state.player.seekBy(-15); return; }
      if (code === 417) { e.preventDefault(); state.player.seekBy(15); return; }
      if (code === 32 || code === 179) { e.preventDefault(); state.player.togglePlayPause(); return; }

      if (!state.player.isDrawerOpen()) {
        if (state.player.isHudHidden()) {
          if (code === 37) { e.preventDefault(); state.player.seekBy(-15); return; }
          if (code === 39) { e.preventDefault(); state.player.seekBy(15); return; }
          if (code === 13) {
            e.preventDefault();
            if (state.player.hasActiveSkip()) state.player.triggerSkip();
            else state.player.togglePlayPause();
            return;
          }
          if (code === 38 || code === 40) {
            e.preventDefault();
            state.player.showHud(true);
            focusByKey('player:play');
            return;
          }
        } else {
          state.player.showHud(true);
          if (active && active.id === 'playerScrubber') {
            if (code === 37) { e.preventDefault(); state.player.seekBy(-15); return; }
            if (code === 39) { e.preventDefault(); state.player.seekBy(15); return; }
          }
        }
      }
    }

    // D-Pad 37/38/39/40
    if (code === 37) {
      if (isInput && active.selectionStart > 0) return;
      e.preventDefault();
      moveFocusSpatial('left');
      return;
    }
    if (code === 39) {
      if (isInput && active.selectionStart < active.value.length) return;
      e.preventDefault();
      moveFocusSpatial('right');
      return;
    }
    if (code === 38) {
      e.preventDefault();
      moveFocusSpatial('up');
      return;
    }
    if (code === 40) {
      e.preventDefault();
      moveFocusSpatial('down');
      return;
    }

    // OK / Enter (13)
    if (code === 13) {
      if (isInput) return;
      if (active && active.classList.contains('tv-focus')) {
        e.preventDefault();
        active.click();
      }
    }
  });

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });
  document.getElementById('sidebarUserCard').onclick = openAuthModal;

  // Auto-rotate hero banner in-place every 8s when on Discover home and near top
  setInterval(() => {
    const mc = document.getElementById('mainContent');
    if (mc && mc.scrollTop < 220 && state.tab === 'discover' && state.category === 'all' && !state.detailSlug && !state.player && !document.getElementById('modalRoot').innerHTML) {
      const len = Math.min(6, state.heroMovies.filter((m) => !isBlocked(m.slug)).length);
      if (len > 1) {
        const active = document.activeElement;
        if (!active || !active.closest('.hero-card, .hero-nav-row')) {
          state.heroIdx = (state.heroIdx + 1) % len;
          updateHeroInPlace();
        }
      }
    }
  }, 8000);

  applyTheme();
  bootstrapAuth();
  loadDiscover();
})();
