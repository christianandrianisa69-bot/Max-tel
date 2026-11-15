/* Max tel — application sans dépendance (HTML + CSS + JavaScript)
   Données stockées uniquement dans le localStorage du navigateur. */
(function () {
  'use strict';

  /* ---------- Configuration Google ----------
     Colle ici ton "ID client OAuth" (type : Application Web) créé sur
     https://console.cloud.google.com/apis/credentials
     et ajoute l'adresse de ton site dans "Origines JavaScript autorisées". */
  var GOOGLE_CLIENT_ID = '';

  /* ---------- Données statiques ---------- */
  var RESOURCES = [
    { id: 'khan-academy', cat: 'Études', title: 'Apprendre avec Khan Academy', desc: 'Des leçons et des exercices gratuits dans plusieurs matières. Les langues et les sujets disponibles varient selon les cours.', org: 'Khan Academy', url: 'https://www.khanacademy.org/' },
    { id: 'openlearn', cat: 'Formation', title: 'Découvrir les cours OpenLearn', desc: 'Des cours gratuits proposés par The Open University, principalement en anglais.', org: 'The Open University', url: 'https://www.open.edu/openlearn/' },
    { id: 'freecodecamp', cat: 'Compétences numériques', title: 'Apprendre à coder', desc: 'Des exercices pratiques gratuits pour découvrir le développement web et programmer à son rythme.', org: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/' },
    { id: 'ibm-skillsbuild', cat: 'Compétences numériques', title: 'Explorer les compétences numériques', desc: 'Des cours et des parcours de formation gratuits sur les compétences professionnelles et numériques.', org: 'IBM SkillsBuild', url: 'https://skillsbuild.org/' },
    { id: 'alison', cat: 'Formation', title: 'Suivre un cours sur Alison', desc: 'Un large choix de cours en ligne. L’accès aux cours est gratuit; certains certificats peuvent être payants.', org: 'Alison', url: 'https://alison.com/' },
    { id: 'indeed-career', cat: 'Emploi', title: 'Préparer son parcours professionnel', desc: 'Des conseils pratiques pour le CV, les candidatures, les entretiens et les prochaines étapes de carrière.', org: 'Indeed Career Guide', url: 'https://www.indeed.com/career-advice' },
    { id: 'applied-digital-skills', cat: 'Compétences numériques', title: 'S’exercer avec Applied Digital Skills', desc: 'Des activités pratiques pour développer des compétences numériques utiles aux études et au travail.', org: 'Google', url: 'https://applieddigitalskills.withgoogle.com/' },
    { id: 'w3schools', cat: 'Compétences numériques', title: 'Découvrir les technologies du web', desc: 'Des tutoriels et exercices pour apprendre les bases du web, notamment HTML, CSS et JavaScript.', org: 'W3Schools', url: 'https://www.w3schools.com/' }
  ];

  var AREA_LABEL = { study: 'Études', work: 'Emploi' };

  var PAGES = {
    '/': { title: 'Mon espace', nav: 'home' },
    '/objectifs': { title: 'Mes objectifs', nav: 'goals' },
    '/ressources': { title: 'Ressources utiles', nav: 'resources' },
    '/a-propos': { title: 'À propos', nav: 'about' },
    '/parametres': { title: 'Paramètres', nav: 'settings' },
    '/inscription': { title: 'Inscription', nav: 'settings' },
    '/connexion': { title: 'Connexion', nav: 'settings' }
  };

  /* ---------- Icônes (SVG inline) ---------- */
  function icon(paths, size) {
    size = size || 18;
    return '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }
  var P = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    goals: '<path d="M4 22V4m0 0c5-4 9 4 15 0v11c-6 4-10-4-15 0"/>',
    book: '<path d="M12 7v14m0-14C10 5 7 4 3 5v14c4-1 7 0 9 2m0-14c2-2 5-3 9-2v14c-4-1-7 0-9 2"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.2 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.2a7 7 0 0 1-.1 1.8Z"/>',
    heart: '<path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11a4.5 4.5 0 0 1 8.8-1.3 4.5 4.5 0 0 1 8.8 1.3Z"/><path d="M3 21h18"/>',
    plus: '<path d="M12 5v14m-7-7h14"/>',
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.5 5.9-5.9 2.5 2.5-5.9Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2m-6.8 7 6.8 4.2"/>',
    external: '<path d="M14 3h7v7m0-7-9 9"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>'
  };
  function ic(name, size) { return icon(P[name], size); }

  /* ---------- État + stockage local ---------- */
  var KEY = 'maxtel.v1';
  var state = load();
  var ui = { goalFilter: 'all', resCat: 'Tout', resQuery: '' };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        return {
          name: typeof d.name === 'string' ? d.name : '',
          goals: Array.isArray(d.goals) ? d.goals : []
        };
      }
    } catch (e) { /* stockage indisponible ou corrompu */ }
    return { name: '', goals: [] };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
  }
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  /* ---------- Comptes (stockés sur cet appareil) ---------- */
  var ACC_KEY = 'maxtel.accounts.v1';
  var accounts = loadAccounts();

  function loadAccounts() {
    try {
      var d = JSON.parse(localStorage.getItem(ACC_KEY));
      if (d && Array.isArray(d.users)) return { users: d.users, session: d.session || null };
    } catch (e) { /* ignoré */ }
    return { users: [], session: null };
  }
  function saveAccounts() {
    try { localStorage.setItem(ACC_KEY, JSON.stringify(accounts)); return true; } catch (e) { return false; }
  }
  function currentUser() {
    return accounts.users.find(function (u) { return u.id === accounts.session; }) || null;
  }
  function findUserByEmail(email) {
    return accounts.users.find(function (u) { return u.email === email; }) || null;
  }
  function toHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function fromHex(hex) {
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }
  /* Le mot de passe n'est jamais stocké en clair : seulement son empreinte PBKDF2 + un sel aléatoire */
  function hashPassword(password, saltHex) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject(new Error('nocrypto'));
    return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
      .then(function (key) {
        return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: fromHex(saltHex), iterations: 150000, hash: 'SHA-256' }, key, 256);
      })
      .then(toHex);
  }
  function randomSalt() {
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return toHex(a);
  }

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function plural(n, one, many) { return n + ' ' + (n > 1 ? many : one); }
  function formatDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function goalStats(g) {
    var total = g.steps.length;
    var done = g.steps.filter(function (s) { return s.done; }).length;
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function globalStats() {
    var total = 0, done = 0;
    state.goals.forEach(function (g) { var s = goalStats(g); total += s.total; done += s.done; });
    return { goals: state.goals.length, total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function normalize(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* ---------- Gabarits ---------- */
  var app = document.getElementById('app');

  function shell(route, content) {
    var cur = PAGES[route] ? PAGES[route].nav : 'home';
    function link(key, href, iconName, label) {
      var active = cur === key;
      return '<a class="nav-link' + (active ? ' active' : '') + '" href="' + href + '"' + (active ? ' aria-current="page"' : '') + '>' + ic(iconName) + '<span>' + label + '</span></a>';
    }
    return '<div class="app-shell">' +
      '<aside class="side-nav" aria-label="Navigation principale">' +
        '<a class="brand" href="#/"><span class="brand-mark">M</span><span>Max tel</span></a>' +
        '<div class="nav-label">Ton espace</div>' +
        link('home', '#/', 'home', 'Mon espace') +
        link('goals', '#/objectifs', 'goals', 'Mes objectifs') +
        link('resources', '#/ressources', 'book', 'Ressources') +
        link('about', '#/a-propos', 'help', 'À propos') +
        link('settings', '#/parametres', 'settings', 'Paramètres') +
        '<div class="nav-footer">' + ic('heart', 17) + '<p>Un pas à la fois.<br>À ton rythme, à ta façon.</p></div>' +
      '</aside>' +
      '<main class="main-area" id="main-content" tabindex="-1">' +
        '<div class="page-topline"><span>Un espace pour avancer</span><span class="privacy-note"><span class="privacy-dot"></span>Tes données restent sur cet appareil</span></div>' +
        content +
      '</main>' +
      '<div id="modal-root"></div>' +
    '</div>';
  }

  function goalCard(g, opts) {
    var s = goalStats(g);
    var steps = g.steps.map(function (st) {
      return '<label class="step-row"><input type="checkbox" data-action="toggle-step" data-goal-id="' + esc(g.id) + '" data-step-id="' + esc(st.id) + '"' + (st.done ? ' checked' : '') + '>' +
        '<span class="' + (st.done ? 'step-completed' : '') + '">' + esc(st.text) + '</span></label>';
    }).join('');
    var date = g.targetDate ? '<span class="subtle">Pour le ' + esc(formatDate(g.targetDate)) + '</span>' : '';
    var progressLabel = s.total ? s.done + ' étape' + (s.done > 1 ? 's' : '') + ' sur ' + s.total + ' réalisée' + (s.done > 1 ? 's' : '') : 'Aucune étape pour l’instant';
    return '<article class="goal-card">' +
      '<div>' +
        '<div class="goal-top"><span class="tag' + (g.area === 'work' ? ' work' : '') + '">' + AREA_LABEL[g.area] + '</span>' + date + '</div>' +
        '<div class="goal-title">' + esc(g.title) + '</div>' +
        '<div class="progress-track" role="progressbar" aria-label="Progression de l’objectif" aria-valuenow="' + s.pct + '" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:' + s.pct + '%"></div></div>' +
        '<div class="subtle">' + progressLabel + '</div>' +
        (steps ? '<div class="steps-list">' + steps + '</div>' : '') +
      '</div>' +
      '<div class="goal-actions">' +
        '<button class="icon-btn" type="button" aria-label="Modifier l’objectif" title="Modifier" data-action="edit-goal" data-id="' + esc(g.id) + '">' + ic('edit', 15) + '</button>' +
        (opts && opts.canDelete ? '<button class="icon-btn" type="button" aria-label="Supprimer l’objectif" title="Supprimer" data-action="delete-goal" data-id="' + esc(g.id) + '">' + ic('trash', 15) + '</button>' : '') +
      '</div>' +
    '</article>';
  }

  function resourceCard(r) {
    return '<article class="resource-card">' +
      '<div class="eyebrow">' + esc(r.cat) + '</div>' +
      '<h3>' + esc(r.title) + '</h3>' +
      '<p>' + esc(r.desc) + '</p>' +
      '<div class="resource-meta"><span>' + esc(r.org) + ' · Accès gratuit</span><div class="resource-actions">' +
        '<button class="icon-btn" type="button" aria-label="Partager ' + esc(r.title) + '" title="Partager la ressource" data-action="share-resource" data-id="' + r.id + '">' + ic('share', 15) + '</button>' +
        '<a class="icon-btn" href="' + r.url + '" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir ' + esc(r.title) + '" title="Ouvrir la ressource">' + ic('external', 15) + '</a>' +
      '</div></div>' +
    '</article>';
  }

  function inspiration() {
    return '<div class="section-heading inspiration-heading"><div><div class="eyebrow">Pour t’inspirer</div><h2>Une ressource, un nouvel élan</h2></div>' +
      '<a href="#/ressources" class="btn ghost small">Explorer ' + ic('chevron', 15) + '</a></div>' +
      '<div class="resource-grid">' + RESOURCES.slice(0, 2).map(resourceCard).join('') + '</div>';
  }

  /* ---------- Pages ---------- */
  function pageHome() {
    var st = globalStats();
    var has = st.goals > 0;
    var eyebrow = state.name ? 'Bonjour ' + esc(state.name) + ' · Bienvenue dans ton espace' : 'Bienvenue dans ton espace';
    var lead = has
      ? 'Garde le cap sur ce qui compte pour toi. Tes projets avancent à ton rythme, étape après étape.'
      : 'Une idée d’étude ou de métier en tête ? On la transforme en étapes simples, concrètes et à ta mesure.';
    var cta = has ? 'Ajouter un objectif' : 'Créer mon premier objectif';
    var plus = ic('plus', has ? 16 : 17);

    var list;
    if (has) {
      list = '<div class="goal-list">' + state.goals.slice(0, 3).map(function (g) { return goalCard(g); }).join('') + '</div>' +
        '<div class="share-row"><button class="btn ghost small" type="button" data-action="share-progress">' + ic('share', 15) + 'Partager mon avancée</button></div>';
    } else {
      list = '<section class="empty-card"><div class="empty-icon">' + ic('compass', 22) + '</div>' +
        '<h3>Tout commence par une envie</h3>' +
        '<p>Choisis un objectif qui te ressemble. Il n’a pas besoin d’être parfaitement défini pour commencer.</p>' +
        '<button class="btn secondary small" type="button" data-action="new-goal">Poser une première idée ' + ic('arrow', 14) + '</button></section>';
    }

    return '<section class="hero-panel"><div>' +
        '<div class="eyebrow">' + eyebrow + '</div>' +
        '<h1>Ton prochain chapitre commence ici.<br><span class="hero-accent">un petit pas suffit.</span></h1>' +
        '<p class="lead">' + lead + '</p>' +
        '<button class="btn" type="button" data-action="new-goal">' + plus + cta + ic('arrow', 15) + '</button>' +
      '</div><div class="hero-aside"><div class="orbit"><div class="orbit-core">' + st.pct + '%</div></div></div></section>' +
      '<section class="stat-strip" aria-label="Résumé de ta progression">' +
        '<div class="stat-box"><div class="stat-value">' + st.goals + '</div><div class="stat-label">' + (st.goals > 1 ? 'objectifs en tête' : 'objectif en tête') + '</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + st.done + '<span class="stat-denominator"> / ' + st.total + '</span></div><div class="stat-label">' + (st.done > 1 ? 'petits pas accomplis' : 'petit pas accompli') + '</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + st.pct + '<span class="stat-percent">%</span></div><div class="stat-label">de ton chemin parcouru</div></div>' +
      '</section>' +
      '<div class="section-heading"><div><div class="eyebrow">Là où tu en es</div><h2>Tes prochains pas</h2></div>' +
        '<a class="btn ghost small" href="#/objectifs">Tous mes objectifs ' + ic('chevron', 15) + '</a></div>' +
      list + inspiration();
  }

  function pageGoals() {
    return '<div class="eyebrow">Tes idées prennent forme</div>' +
      '<div class="section-heading page-heading"><div><h1>Mes objectifs</h1><p class="lead">Découpe chaque envie en étapes réalistes. Tu peux ajuster ton cap à tout moment.</p></div>' +
        '<button class="btn" type="button" data-action="new-goal">' + ic('plus', 16) + 'Nouvel objectif</button></div>' +
      '<div id="goals-body">' + goalsBody() + '</div>';
  }
  function goalsBody() {
    var shown = state.goals.filter(function (g) { return ui.goalFilter === 'all' || g.area === ui.goalFilter; });
    var count = '<div class="subtle">' + plural(state.goals.length, 'objectif', 'objectifs') + ' au total</div>';
    var select = '<select aria-label="Filtrer les objectifs" data-action="filter-goals">' +
      '<option value="all"' + (ui.goalFilter === 'all' ? ' selected' : '') + '>Tous les objectifs</option>' +
      '<option value="study"' + (ui.goalFilter === 'study' ? ' selected' : '') + '>Études</option>' +
      '<option value="work"' + (ui.goalFilter === 'work' ? ' selected' : '') + '>Emploi</option></select>';
    var body;
    if (!state.goals.length) {
      body = '<section class="empty-card"><div class="empty-icon">' + ic('compass', 22) + '</div><h3>Tu peux commencer quand tu veux</h3>' +
        '<p>Commence par une intention, même toute petite. On trouvera les étapes ensuite.</p>' +
        '<button class="btn small" type="button" data-action="new-goal">' + ic('plus', 15) + 'Créer un objectif</button></section>';
    } else if (!shown.length) {
      body = '<section class="empty-card"><div class="empty-icon">' + ic('search', 22) + '</div><h3>Rien dans cette catégorie</h3>' +
        '<p>Aucun objectif ne correspond à ce filtre pour le moment.</p></section>';
    } else {
      body = '<div class="goal-list">' + shown.map(function (g) { return goalCard(g, { canDelete: true }); }).join('') + '</div>';
    }
    return '<div class="toolbar">' + count + select + '</div>' + body;
  }

  function pageResources() {
    var cats = ['Tout', 'Études', 'Formation', 'Compétences numériques', 'Emploi'];
    var opts = cats.map(function (c) {
      return '<option value="' + c + '"' + (ui.resCat === c ? ' selected' : '') + '>' + (c === 'Tout' ? 'Tous les sujets' : c) + '</option>';
    }).join('');
    return '<div class="eyebrow">Des repères pour avancer</div><h1>Ressources utiles</h1>' +
      '<p class="lead">Des pistes pour apprendre, choisir et préparer la suite. Les cours, langues et conditions d’accès varient selon les organismes et les pays.</p>' +
      '<div class="toolbar resource-toolbar"><div class="search-wrap">' + ic('search', 16) +
        '<input class="field" type="search" value="' + esc(ui.resQuery) + '" placeholder="Chercher un sujet, un métier…" aria-label="Rechercher une ressource" data-action="search-resources"></div>' +
        '<select aria-label="Filtrer les ressources" data-action="filter-resources">' + opts + '</select></div>' +
      '<div id="resource-results">' + resourceResults() + '</div>' +
      '<section class="content-card resource-note"><div class="resource-note-icon">' + ic('info', 20) + '</div><div><strong>Un lien a changé ?</strong>' +
        '<p class="subtle">Les sites et leurs conditions évoluent. Vérifie les informations directement auprès de l’organisme indiqué.</p></div></section>';
  }
  function resourceResults() {
    var q = normalize(ui.resQuery.trim());
    var list = RESOURCES.filter(function (r) {
      var okCat = ui.resCat === 'Tout' || r.cat === ui.resCat;
      var okQ = !q || normalize(r.title + ' ' + r.desc + ' ' + r.org + ' ' + r.cat).indexOf(q) !== -1;
      return okCat && okQ;
    });
    var count = '<div class="subtle resource-count">' + plural(list.length, 'ressource', 'ressources') + ' à découvrir</div>';
    if (!list.length) {
      return count + '<section class="empty-card"><div class="empty-icon">' + ic('search', 22) + '</div><h3>Aucun résultat</h3>' +
        '<p>Essaie un autre mot ou choisis « Tous les sujets » pour tout revoir.</p></section>';
    }
    return count + '<div class="resource-grid">' + list.map(resourceCard).join('') + '</div>';
  }

  function pageAbout() {
    return '<div class="eyebrow">Le créateur de Max tel</div>' +
      '<section class="creator-panel">' +
        '<div class="creator-photo-frame"><img class="creator-photo" src="creator.jpg" alt="Photo de ANDRIANISA Tolojanahary Christian"></div>' +
        '<div class="creator-copy"><span class="tag">Parcours · Développeur web</span>' +
          '<h1>ANDRIANISA<br><span class="creator-name-second">Tolojanahary Christian</span></h1>' +
          '<p class="lead">Bonjour, je m’appelle ANDRIANISA Tolojanahary Christian. Je suis un parcours de développeur web et je crée Max tel pour aider chacun à avancer vers ses projets.</p>' +
          '<a class="btn" href="#/">Découvrir Max tel ' + ic('arrow', 15) + '</a></div>' +
      '</section>' +
      '<section class="about-project-card"><div class="eyebrow">À propos du projet</div>' +
        '<h2>Chaque grand projet commence par un petit pas.</h2>' +
        '<p>Max tel est un espace pour organiser ses objectifs d’études ou de travail, les découper en étapes concrètes et suivre ses progrès à son rythme.</p>' +
        '<p>Le projet propose aussi des ressources pour apprendre et préparer la suite. Il a été imaginé pour être simple à utiliser et utile à chacun.</p></section>';
  }

  var GOOGLE_SVG = '<svg aria-hidden="true" viewBox="0 0 48 48" width="19" height="19"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.08 13.22l7.98 6.19C12.96 13.72 18.03 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.97 46.98 31.84 46.98 24.55z"/><path fill="#FBBC05" d="M10.06 28.59A14.4 14.4 0 0 1 9.3 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.58 10.78l7.48-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.97 0-11.04-4.22-12.94-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"/></svg>';

  function textField(id, name, label, type, ac, ph, wide) {
    return '<div' + (wide ? ' class="signup-full"' : '') + '><label class="form-label" for="' + id + '">' + label + '</label>' +
      '<input class="field" id="' + id + '" type="' + type + '" name="' + name + '" autocomplete="' + ac + '" placeholder="' + ph + '" maxlength="' + (type === 'email' ? 120 : 60) + '" required aria-describedby="' + id + '-err">' +
      '<div class="form-error" id="' + id + '-err" data-error="' + name + '" hidden></div></div>';
  }
  function passwordField(id, label, ac, ph) {
    return '<div class="signup-full"><label class="form-label" for="' + id + '">' + label + '</label>' +
      '<div class="pw-wrap"><input class="field" id="' + id + '" type="password" name="password" autocomplete="' + ac + '" placeholder="' + ph + '" maxlength="128" required aria-describedby="' + id + '-err">' +
      '<button class="pw-toggle" type="button" data-action="toggle-password" aria-label="Afficher le mot de passe" aria-pressed="false" title="Afficher le mot de passe">' + ic('eye', 18) + '</button></div>' +
      '<div class="form-error" id="' + id + '-err" data-error="password" hidden></div></div>';
  }
  function googleBlock(mode) {
    if (GOOGLE_CLIENT_ID) return '<div class="google-slot" id="google-btn" data-mode="' + mode + '"></div>';
    return '<button class="google-button" type="button" data-action="google-signup">' + GOOGLE_SVG + 'Continuer avec Google</button>';
  }

  function pageAuth(mode) {
    var user = currentUser();
    if (user) {
      return '<div class="eyebrow">Ton compte</div>' +
        '<section class="signup-wrap"><div class="signup-intro"><span class="tag">Connecté</span><h1>Content de te revoir, <span class="hero-accent">' + esc(user.givenName || 'ami(e)') + '.</span></h1>' +
        '<p class="lead">Tu es connecté avec ' + esc(user.email) + '.</p></div>' +
        '<div class="signup-card"><a class="btn signup-submit" href="#/">Aller à mon espace ' + ic('arrow', 15) + '</a>' +
        '<button class="btn ghost signup-submit" type="button" data-action="logout">' + ic('logout', 15) + 'Me déconnecter</button></div></section>';
    }
    var signup = mode === 'signup';
    var fields = signup
      ? textField('su-surname', 'surname', 'Nom', 'text', 'family-name', 'Ton nom') +
        textField('su-given', 'givenName', 'Prénom', 'text', 'given-name', 'Ton prénom') +
        textField('su-email', 'email', 'Adresse e-mail', 'email', 'email', 'exemple@email.com', true) +
        passwordField('su-password', 'Mot de passe', 'new-password', '8 caractères minimum')
      : textField('li-email', 'email', 'Adresse e-mail', 'email', 'email', 'exemple@email.com', true) +
        passwordField('li-password', 'Mot de passe', 'current-password', 'Ton mot de passe');
    return '<div class="eyebrow">Bienvenue sur Max tel</div>' +
      '<section class="signup-wrap">' +
        '<div class="signup-intro"><span class="tag">' + (signup ? 'Créer mon compte' : 'Me connecter') + '</span>' +
          '<h1>' + (signup ? 'Rejoins <span class="hero-accent">Max tel.</span>' : 'Content de te <span class="hero-accent">revoir.</span>') + '</h1>' +
          '<p class="lead">' + (signup
            ? 'Crée ton espace personnel pour organiser tes objectifs et suivre tes progrès, un petit pas à la fois.'
            : 'Connecte-toi pour retrouver ton espace et tes objectifs.') + '</p></div>' +
        '<form class="signup-card" data-form="' + (signup ? 'signup' : 'login') + '" novalidate>' +
          '<div class="form-error form-error-top" data-error="form" role="alert" hidden></div>' +
          '<div class="signup-fields">' + fields + '</div>' +
          '<button class="btn signup-submit" type="submit">' + (signup ? 'Créer mon compte ' : 'Me connecter ') + ic('arrow', 15) + '</button>' +
          '<div class="signup-divider"><span>ou</span></div>' +
          googleBlock(mode) +
          '<p class="signup-note">Ton compte est enregistré sur cet appareil et ton mot de passe est protégé (jamais gardé en clair). Pour retrouver ton compte sur un autre appareil, il faudra un serveur.</p>' +
          '<p class="signup-back">' + (signup
            ? 'Tu as déjà un compte ? <a href="#/connexion">Se connecter</a>'
            : 'Pas encore de compte ? <a href="#/inscription">Créer un compte</a>') + '</p>' +
          '<p class="signup-back"><a href="#/parametres">← Retour aux paramètres</a></p>' +
        '</form></section>';
  }
  function pageSignup() { return pageAuth('signup'); }
  function pageLogin() { return pageAuth('login'); }

  function accountCard() {
    var u = currentUser();
    if (u) {
      var who = esc(((u.givenName || '') + ' ' + (u.surname || '')).trim() || u.email);
      return '<section class="settings-card"><div class="empty-icon setting-icon">' + ic('user', 22) + '</div><h3>Mon compte</h3>' +
        '<p>Connecté en tant que <strong>' + who + '</strong><br>' + esc(u.email) + (u.provider === 'google' ? ' · via Google' : '') + '</p>' +
        '<button class="btn secondary small setting-button" type="button" data-action="logout">' + ic('logout', 15) + 'Me déconnecter</button></section>';
    }
    return '<section class="settings-card"><div class="empty-icon setting-icon">' + ic('user', 22) + '</div><h3>Créer un compte</h3>' +
      '<p>Inscris-toi avec ton nom, ton prénom, ton e-mail et un mot de passe, ou continue avec Google.</p>' +
      '<div class="setting-actions"><a class="btn small setting-button" href="#/inscription">Créer un compte ' + ic('arrow', 15) + '</a>' +
      '<a class="btn ghost small setting-button" href="#/connexion">Se connecter</a></div></section>';
  }

  function pageSettings() {
    var steps = state.goals.reduce(function (n, g) { return n + g.steps.length; }, 0);
    return '<div class="eyebrow">À ta façon</div><h1>Paramètres</h1><p class="lead">Ton espace est personnel. Modifie ton accueil et garde la main sur tes données.</p>' +
      '<div class="settings-grid settings-page">' +
        accountCard() +
        '<section class="settings-card"><div class="empty-icon setting-icon">' + ic('user', 22) + '</div><h3>Un accueil qui te ressemble</h3>' +
          '<p>Ajoute ton prénom si tu veux une petite salutation personnalisée. Il reste uniquement sur cet appareil.</p>' +
          '<form data-form="preferences"><label><span class="form-label">Prénom ou surnom <span class="subtle">(facultatif)</span></span>' +
          '<input class="field" name="name" value="' + esc(state.name) + '" maxlength="32" placeholder="Comment t’appeler ?"></label>' +
          '<button class="btn small setting-button" type="submit">Enregistrer mes préférences ' + ic('check', 15) + '</button></form></section>' +
        '<section class="settings-card"><div class="empty-icon setting-icon">' + ic('download', 22) + '</div><h3>Emporter mes données</h3>' +
          '<p>Télécharge une copie de tes objectifs et préférences au format JSON. Rien n’est envoyé à un serveur.</p>' +
          '<div class="subtle setting-count">' + plural(state.goals.length, 'objectif', 'objectifs') + ' · ' + plural(steps, 'étape', 'étapes') + '</div>' +
          '<button class="btn secondary small" type="button" data-action="export-data">' + ic('download', 15) + 'Télécharger mes données</button></section>' +
        '<section class="settings-card reset-card"><h3>Repartir de zéro</h3>' +
          '<p>Efface tes objectifs et préférences enregistrés sur cet appareil. Tu pourras toujours recommencer ensuite.</p>' +
          '<button class="btn danger small" type="button" data-action="reset-data">' + ic('trash', 15) + 'Effacer mes données locales</button></section>' +
      '</div>' +
      '<section class="content-card privacy-card"><div class="privacy-icon">' + ic('shield', 20) + '</div>' +
        '<p>Tes objectifs et préférences sont enregistrés dans le stockage local de ton navigateur. Ton compte, tes objectifs et tes préférences restent sur cet appareil et ne sont pas transmis à Max tel. Le mot de passe n’est jamais enregistré en clair.</p></section>';
  }

  /* ---------- Rendu + routage ---------- */
  function currentRoute() {
    var h = (location.hash || '#/').replace(/^#/, '');
    if (h.charAt(0) !== '/') h = '/' + h;
    return PAGES[h] ? h : '/';
  }
  var lastRoute = null;
  function render(opts) {
    var route = currentRoute();
    var views = { '/': pageHome, '/objectifs': pageGoals, '/ressources': pageResources, '/a-propos': pageAbout, '/parametres': pageSettings, '/inscription': pageSignup, '/connexion': pageLogin };
    var y = window.scrollY;
    app.innerHTML = shell(route, views[route]());
    document.title = PAGES[route].title + ' · Max tel';
    if (route !== lastRoute) {
      window.scrollTo(0, 0);
      if (!(opts && opts.keepFocus)) document.getElementById('main-content').focus({ preventScroll: true });
    } else {
      window.scrollTo(0, y);
    }
    lastRoute = route;
    if (route === '/inscription' || route === '/connexion') initGoogle();
  }
  window.addEventListener('hashchange', function () { closeModal(); render(); });

  /* ---------- Connexion / inscription avec Google ---------- */
  var gsiPromise = null;
  function loadGoogleScript() {
    if (gsiPromise) return gsiPromise;
    gsiPromise = new Promise(function (resolve, reject) {
      if (window.google && google.accounts && google.accounts.id) return resolve();
      var s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client?hl=fr';
      s.async = true; s.defer = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { gsiPromise = null; reject(new Error('gsi')); };
      document.head.appendChild(s);
    });
    return gsiPromise;
  }
  var gsiInitialized = false;
  function initGoogle() {
    if (!GOOGLE_CLIENT_ID) return;
    var holder = document.getElementById('google-btn');
    if (!holder) return;
    loadGoogleScript().then(function () {
      if (!gsiInitialized) {
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential, ux_mode: 'popup' });
        gsiInitialized = true;
      }
      var holderNow = document.getElementById('google-btn');
      if (!holderNow) return;
      var w = Math.max(200, Math.min(400, holderNow.clientWidth || 320));
      google.accounts.id.renderButton(holderNow, {
        theme: 'outline', size: 'large', shape: 'rectangular', width: w,
        text: holderNow.getAttribute('data-mode') === 'login' ? 'signin_with' : 'signup_with'
      });
    }).catch(function () {
      var h = document.getElementById('google-btn');
      if (h) h.innerHTML = '<p class="form-error">Google n’a pas pu être chargé. Vérifie ta connexion internet puis recharge la page.</p>';
    });
  }
  function parseJwt(token) {
    var p = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (p.length % 4) p += '=';
    var json = decodeURIComponent(Array.prototype.map.call(atob(p), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  }
  function onGoogleCredential(resp) {
    var p;
    try { p = parseJwt(resp.credential); } catch (e) { toast('Connexion Google impossible. Réessaie.'); return; }
    if (!p || p.aud !== GOOGLE_CLIENT_ID || !p.email || (p.exp && p.exp * 1000 < Date.now())) {
      toast('Connexion Google refusée. Réessaie.'); return;
    }
    var email = String(p.email).toLowerCase();
    var u = findUserByEmail(email);
    var created = false;
    if (!u) {
      u = { id: uid(), email: email, givenName: p.given_name || p.name || '', surname: p.family_name || '',
            provider: 'google', googleId: p.sub, picture: p.picture || '', createdAt: new Date().toISOString() };
      accounts.users.push(u);
      created = true;
    } else {
      if (!u.googleId) u.googleId = p.sub;
      if (!u.picture && p.picture) u.picture = p.picture;
    }
    accounts.session = u.id;
    if (!saveAccounts()) { toast('Impossible d’enregistrer le compte sur cet appareil.'); return; }
    if (!state.name && u.givenName) { state.name = u.givenName.slice(0, 32); save(); }
    toast(created ? 'Compte créé avec Google. Bienvenue !' : 'Connecté avec Google.');
    if (location.hash === '#/' || location.hash === '') render(); else location.hash = '#/';
  }

  /* ---------- Erreurs de formulaire ---------- */
  function showError(form, name, msg) {
    var el = form.querySelector('[data-error="' + name + '"]');
    if (el) { el.textContent = msg; el.hidden = false; }
    var input = form.querySelector('[name="' + name + '"]');
    if (input) input.setAttribute('aria-invalid', 'true');
  }
  function clearErrors(form, name) {
    var sel = name ? '[data-error="' + name + '"], [data-error="form"]' : '[data-error]';
    Array.prototype.forEach.call(form.querySelectorAll(sel), function (el) { el.hidden = true; el.textContent = ''; });
    var inputs = name ? [form.querySelector('[name="' + name + '"]')] : Array.prototype.slice.call(form.querySelectorAll('[aria-invalid]'));
    inputs.forEach(function (i) { if (i) i.removeAttribute('aria-invalid'); });
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function handleSignup(form, data) {
    clearErrors(form);
    var surname = String(data.get('surname') || '').trim();
    var givenName = String(data.get('givenName') || '').trim();
    var email = String(data.get('email') || '').trim().toLowerCase();
    var password = String(data.get('password') || '');
    var first = null;
    function bad(name, msg) { showError(form, name, msg); if (!first) first = name; }
    if (!surname) bad('surname', 'Écris ton nom.');
    if (!givenName) bad('givenName', 'Écris ton prénom.');
    if (!email) bad('email', 'Écris ton adresse e-mail.');
    else if (!EMAIL_RE.test(email)) bad('email', 'Cette adresse e-mail ne semble pas valide.');
    if (password.length < 8) bad('password', 'Le mot de passe doit contenir au moins 8 caractères.');
    if (first) { form.querySelector('[name="' + first + '"]').focus(); return; }
    if (findUserByEmail(email)) {
      showError(form, 'email', 'Un compte existe déjà avec cette adresse. Connecte-toi plutôt.');
      form.querySelector('[name="email"]').focus();
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    var salt;
    try { salt = randomSalt(); } catch (e) { btn.disabled = false; showError(form, 'form', 'Ton navigateur ne permet pas de protéger le mot de passe. Ouvre le site en https ou en localhost.'); return; }
    hashPassword(password, salt).then(function (hash) {
      var user = { id: uid(), email: email, givenName: givenName, surname: surname, provider: 'password',
                   salt: salt, hash: hash, createdAt: new Date().toISOString() };
      accounts.users.push(user);
      accounts.session = user.id;
      if (!saveAccounts()) {
        accounts.users.pop(); accounts.session = null;
        btn.disabled = false;
        showError(form, 'form', 'Impossible d’enregistrer le compte sur cet appareil (stockage indisponible).');
        return;
      }
      if (!state.name) { state.name = givenName.slice(0, 32); save(); }
      toast('Compte créé. Bienvenue, ' + givenName + ' !');
      location.hash = '#/';
    }).catch(function () {
      btn.disabled = false;
      showError(form, 'form', 'Ton navigateur ne permet pas de protéger le mot de passe. Ouvre le site en https ou en localhost.');
    });
  }

  function handleLogin(form, data) {
    clearErrors(form);
    var email = String(data.get('email') || '').trim().toLowerCase();
    var password = String(data.get('password') || '');
    var first = null;
    if (!email) { showError(form, 'email', 'Écris ton adresse e-mail.'); first = 'email'; }
    if (!password) { showError(form, 'password', 'Écris ton mot de passe.'); first = first || 'password'; }
    if (first) { form.querySelector('[name="' + first + '"]').focus(); return; }
    var user = findUserByEmail(email);
    if (user && !user.hash) { showError(form, 'form', 'Ce compte a été créé avec Google. Utilise le bouton « Continuer avec Google ».'); return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    // Même durée de calcul que le compte existe ou non
    hashPassword(password, user ? user.salt : '00000000000000000000000000000000').then(function (hash) {
      if (!user || hash !== user.hash) {
        btn.disabled = false;
        showError(form, 'form', 'E-mail ou mot de passe incorrect.');
        return;
      }
      accounts.session = user.id;
      saveAccounts();
      if (!state.name && user.givenName) { state.name = user.givenName.slice(0, 32); save(); }
      toast('Connecté. Content de te revoir !');
      location.hash = '#/';
    }).catch(function () {
      btn.disabled = false;
      showError(form, 'form', 'Connexion impossible sur ce navigateur. Ouvre le site en https ou en localhost.');
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.remove(); }, 2800);
  }

  /* ---------- Fenêtres modales ---------- */
  var lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    var root = document.getElementById('modal-root');
    root.innerHTML = '<div class="modal-backdrop" data-action="backdrop-close">' + html + '</div>';
    var first = root.querySelector('[autofocus], input, select, textarea, button.btn:last-child');
    if (first) first.focus();
  }
  function closeModal() {
    var root = document.getElementById('modal-root');
    if (root && root.firstChild) {
      root.innerHTML = '';
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    }
  }
  function goalModal(goal) {
    var edit = !!goal;
    var stepsText = edit ? goal.steps.map(function (s) { return s.text; }).join('\n') : '';
    openModal(
      '<section class="modal" role="dialog" aria-modal="true" aria-labelledby="goal-dialog-title">' +
        '<div class="modal-header"><h2 id="goal-dialog-title">' + (edit ? 'Ajuster mon objectif' : 'Nouvel objectif') + '</h2>' +
        '<button class="icon-btn" type="button" aria-label="Fermer" data-action="close-modal">' + ic('close', 16) + '</button></div>' +
        '<form data-form="goal"' + (edit ? ' data-edit-id="' + esc(goal.id) + '"' : '') + ' novalidate>' +
          '<div class="form-grid">' +
            '<label><span class="form-label">Qu’aimerais-tu accomplir ?</span>' +
              '<input class="field" name="title" value="' + (edit ? esc(goal.title) : '') + '" placeholder="Ex. Trouver une formation en cuisine" maxlength="90" required autofocus>' +
              '<div class="form-error" data-error="title" hidden>Donne un nom à ton objectif pour continuer.</div></label>' +
            '<label><span class="form-label">Ce projet concerne plutôt…</span><select name="area">' +
              '<option value="study"' + (!edit || goal.area === 'study' ? ' selected' : '') + '>Mes études ou une formation</option>' +
              '<option value="work"' + (edit && goal.area === 'work' ? ' selected' : '') + '>Mon projet professionnel</option></select></label>' +
            '<label><span class="form-label">Une date en tête ? <span class="subtle">(facultatif)</span></span>' +
              '<input class="field" type="date" name="targetDate" value="' + (edit ? esc(goal.targetDate || '') : '') + '"></label>' +
            '<label><span class="form-label">Des petits pas pour commencer</span>' +
              '<textarea class="field" name="steps" rows="4" placeholder="Une étape par ligne&#10;Ex. Chercher trois formations&#10;Ex. En parler avec quelqu’un">' + esc(stepsText) + '</textarea>' +
              '<span class="subtle">Tu pourras en ajouter ou en modifier plus tard.</span></label>' +
          '</div>' +
          '<div class="modal-actions"><button class="btn ghost" type="button" data-action="close-modal">Annuler</button>' +
          '<button class="btn" type="submit">Enregistrer ' + ic('check', 15) + '</button></div>' +
        '</form></section>'
    );
  }
  function confirmModal(title, text, confirmLabel, action, id) {
    openModal(
      '<section class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">' +
        '<div class="modal-header"><h2 id="confirm-title">' + title + '</h2>' +
        '<button class="icon-btn" type="button" aria-label="Fermer" data-action="close-modal">' + ic('close', 16) + '</button></div>' +
        '<p class="modal-text">' + text + '</p>' +
        '<div class="modal-actions"><button class="btn ghost" type="button" data-action="close-modal">Annuler</button>' +
        '<button class="btn danger" type="button" data-action="' + action + '"' + (id ? ' data-id="' + esc(id) + '"' : '') + '>' + confirmLabel + '</button></div>' +
      '</section>'
    );
  }

  /* ---------- Partage / export ---------- */
  function share(text, url, okMsg) {
    if (navigator.share) {
      navigator.share({ title: 'Max tel', text: text, url: url }).catch(function () {});
      return;
    }
    var full = url ? text + ' ' + url : text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(full).then(function () { toast(okMsg); }, function () { toast('Copie impossible sur cet appareil.'); });
    } else {
      toast('Le partage n’est pas disponible sur ce navigateur.');
    }
  }
  function exportData() {
    var payload = {
      application: 'Max tel',
      exportedAt: new Date().toISOString(),
      preferences: { name: state.name },
      goals: state.goals
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'max-tel-donnees.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast('Tes données ont été téléchargées.');
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var a = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');

    if (a === 'backdrop-close') { if (e.target === el) closeModal(); return; }
    if (a === 'close-modal') return closeModal();
    if (a === 'new-goal') return goalModal(null);
    if (a === 'edit-goal') {
      var g = state.goals.find(function (x) { return x.id === id; });
      return g && goalModal(g);
    }
    if (a === 'delete-goal') {
      return confirmModal('Supprimer cet objectif ?', 'Cet objectif et ses petits pas seront effacés de cet appareil. Cette action est définitive.', 'Supprimer', 'confirm-delete', id);
    }
    if (a === 'confirm-delete') {
      state.goals = state.goals.filter(function (x) { return x.id !== id; });
      save(); closeModal(); render({ keepFocus: true }); toast('Objectif supprimé.');
      return;
    }
    if (a === 'share-resource') {
      var r = RESOURCES.find(function (x) { return x.id === id; });
      return r && share(r.title + ' — ' + r.org, r.url, 'Lien copié dans le presse-papiers.');
    }
    if (a === 'share-progress') {
      var st = globalStats();
      return share('J’avance avec Max tel : ' + plural(st.goals, 'objectif', 'objectifs') + ', ' + st.done + '/' + st.total + ' petits pas accomplis (' + st.pct + ' %).', '', 'Message copié, tu peux le partager.');
    }
    if (a === 'google-signup') return toast('Google n’est pas encore configuré : ajoute ton ID client dans app.js (GOOGLE_CLIENT_ID).');
    if (a === 'toggle-password') {
      var input = el.parentNode.querySelector('input');
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      el.setAttribute('aria-pressed', show ? 'true' : 'false');
      el.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      el.setAttribute('title', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      el.innerHTML = ic(show ? 'eyeOff' : 'eye', 18);
      return;
    }
    if (a === 'logout') {
      accounts.session = null; saveAccounts();
      render({ keepFocus: true }); toast('Tu es déconnecté.');
      return;
    }
    if (a === 'export-data') return exportData();
    if (a === 'reset-data') {
      return confirmModal('Tout effacer ?', 'Tes objectifs et préférences enregistrés sur cet appareil seront supprimés. Cette action est définitive.', 'Effacer mes données', 'confirm-reset');
    }
    if (a === 'confirm-reset') {
      state = { name: '', goals: [] };
      try { localStorage.removeItem(KEY); } catch (err) { /* ignoré */ }
      closeModal(); render({ keepFocus: true }); toast('Tes données locales ont été effacées.');
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    var a = el.getAttribute && el.getAttribute('data-action');
    if (a === 'toggle-step') {
      var g = state.goals.find(function (x) { return x.id === el.getAttribute('data-goal-id'); });
      var s = g && g.steps.find(function (x) { return x.id === el.getAttribute('data-step-id'); });
      if (s) { s.done = el.checked; save(); render({ keepFocus: true }); }
    } else if (a === 'filter-goals') {
      ui.goalFilter = el.value;
      document.getElementById('goals-body').innerHTML = goalsBody();
    } else if (a === 'filter-resources') {
      ui.resCat = el.value;
      document.getElementById('resource-results').innerHTML = resourceResults();
    }
  });

  document.addEventListener('input', function (e) {
    var f = e.target.closest && e.target.closest('form[data-form="signup"], form[data-form="login"]');
    if (f && e.target.name) clearErrors(f, e.target.name);
    if (e.target.getAttribute && e.target.getAttribute('data-action') === 'search-resources') {
      ui.resQuery = e.target.value;
      document.getElementById('resource-results').innerHTML = resourceResults();
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    var type = form.getAttribute('data-form');
    var data = new FormData(form);

    if (type === 'preferences') {
      state.name = String(data.get('name') || '').trim().slice(0, 32);
      save(); toast('Préférences enregistrées.');
      return;
    }

    if (type === 'signup') return handleSignup(form, data);
    if (type === 'login') return handleLogin(form, data);

    if (type === 'goal') {
      var title = String(data.get('title') || '').trim();
      if (!title) {
        form.querySelector('[data-error="title"]').hidden = false;
        form.querySelector('[name="title"]').focus();
        return;
      }
      var lines = String(data.get('steps') || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      var editId = form.getAttribute('data-edit-id');
      var existing = editId ? state.goals.find(function (x) { return x.id === editId; }) : null;

      // Conserve l'état « fait » des étapes dont le texte n'a pas changé
      var pool = existing ? existing.steps.slice() : [];
      var steps = lines.map(function (text) {
        var i = pool.findIndex(function (s) { return s.text === text; });
        if (i !== -1) return pool.splice(i, 1)[0];
        return { id: uid(), text: text, done: false };
      });

      var values = { title: title, area: data.get('area') === 'work' ? 'work' : 'study', targetDate: String(data.get('targetDate') || ''), steps: steps };
      if (existing) {
        Object.assign(existing, values);
      } else {
        state.goals.unshift(Object.assign({ id: uid(), createdAt: new Date().toISOString() }, values));
      }
      save(); closeModal(); render({ keepFocus: true });
      toast(existing ? 'Objectif mis à jour.' : 'Objectif ajouté. Un petit pas à la fois !');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      var modal = document.querySelector('.modal');
      if (!modal) return;
      var f = modal.querySelectorAll('button, input, select, textarea, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Liens externes : s'ouvrent toujours directement sur le site de l'organisme */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[target="_blank"]');
    if (!a) return;
    e.preventDefault();
    var w = window.open(a.href, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = a.href;
  });

  /* ---------- Démarrage ---------- */
  render({ keepFocus: true });
})();
