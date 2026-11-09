/* =========================================================
   XALAM — Logique de l'application
   1. Icônes                5. Rendu des vues (pages)
   2. Comptes & sauvegarde  6. Routeur (navigation par #hash)
   3. Utilitaires           7. Lecteur audio
   4. Composants            8. Événements (clics, clavier…)
   ========================================================= */

/* ---------- 1. ICÔNES (SVG du guide de style) ---------- */
const ICON_PATHS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  lib: '<path d="M4 4v16M9 4v16M14 5l5 15"/>',
  list: '<path d="M4 6h12M4 12h12M4 18h8M18 15v6M15 18h6"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" stroke="none"/>',
  prev: '<path d="M18 5l-10 7 10 7z" fill="currentColor"/><path d="M6 5v14"/>',
  next: '<path d="M6 5l10 7-10 7z" fill="currentColor"/><path d="M18 5v14"/>',
  shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h13l-3-3M20 13v2a3 3 0 0 1-3 3H4l3 3"/>',
  repeat1: '<path d="M4 11V9a3 3 0 0 1 3-3h13l-3-3M20 13v2a3 3 0 0 1-3 3H4l3 3"/><path d="M11 10l1.5-1v6" stroke-width="1.8"/>',
  vol: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  queue: '<path d="M4 6h11M4 11h11M4 16h7M17 13v7l4-3.5z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.6 7.6A17 17 0 0 0 2 12s4 6 10 6a9.6 9.6 0 0 0 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}
function ic(name) { return `<i data-icon="${name}">${icon(name)}</i>`; }

// Remplit toutes les balises <i data-icon="..."> encore vides
function hydrateIcons(root = document) {
  root.querySelectorAll("i[data-icon]").forEach(el => {
    if (!el.firstElementChild) el.innerHTML = icon(el.dataset.icon);
  });
}
function setIcon(el, name) { if (el) { el.dataset.icon = name; el.innerHTML = icon(name); } }

/* ---------- 2. COMPTES & SAUVEGARDE (localStorage) ----------
   Démo sans serveur : les comptes sont enregistrés dans le navigateur.
   Le mot de passe n'est jamais stocké en clair (empreinte SHA-256). */
const USERS_KEY = "xalam-users";
const SESSION_KEY = "xalam-session";

function readJSON(storage, key, fallback) {
  try { const v = JSON.parse(storage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}
function writeJSON(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
}
function removeKey(storage, key) { try { storage.removeItem(key); } catch (e) { /* rien */ } }

const getUsers = () => readJSON(localStorage, USERS_KEY, []);
const findUser = email => getUsers().find(u => u.email === email.trim().toLowerCase());
function getSession() { return readJSON(localStorage, SESSION_KEY, null) || readJSON(sessionStorage, SESSION_KEY, null); }

let user = null;   // utilisateur connecté : { name, email, genres }
const state = { likes: new Set(), follows: new Set(), playlists: [], volume: 0.8, homeGenre: "Tout", region: null };

// Chaque compte a ses propres likes, playlists et abonnements
const storeKey = () => "xalam-v1-" + (user ? user.email : "invite");
function loadUserState() {
  const s = readJSON(localStorage, storeKey(), {});
  state.likes = new Set(s.likes || ["t1", "t3"]);
  state.follows = new Set(s.follows || ["youssou"]);
  state.playlists = s.playlists || structuredClone(DEFAULT_PLAYLISTS);
  state.volume = typeof s.volume === "number" ? s.volume : 0.8;
  state.homeGenre = "Tout";
  state.region = null;
}
function saveStore() {
  if (!user) return;   // rien à sauvegarder tant qu'on n'est pas connecté
  writeJSON(localStorage, storeKey(), {
    likes: [...state.likes], follows: [...state.follows], playlists: state.playlists, volume: state.volume
  });
}

async function hashPassword(email, password) {
  const data = new TextEncoder().encode(email + ":" + password);
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(String.fromCharCode(...data));   // secours si la page n'est pas en HTTPS
}

function openSession(u, remember) {
  removeKey(localStorage, SESSION_KEY);
  removeKey(sessionStorage, SESSION_KEY);
  writeJSON(remember ? localStorage : sessionStorage, SESSION_KEY, { email: u.email });
  user = { name: u.name, email: u.email, genres: u.genres || [] };
  loadUserState();
  setVolume(state.volume);
  updateUserUI();
  location.hash = "#/";
}

function logout() {
  removeKey(localStorage, SESSION_KEY);
  removeKey(sessionStorage, SESSION_KEY);
  audio.pause();
  closeFull();
  user = null;
  location.hash = "#/connexion";
  toast("Tu es déconnecté. À bientôt !");
}

function updateUserUI() {
  if (!user) return;
  $("#user-name").textContent = user.name.split(" ")[0];
  $("#user-avatar").textContent = user.name.trim().charAt(0).toUpperCase();
}

/* ---------- 3. UTILITAIRES ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const trackById = id => TRACKS.find(t => t.id === id);
const artistById = id => ARTISTS.find(a => a.id === id);
const tracksOf = artistId => TRACKS.filter(t => t.artist === artistId);
const playlistById = id => state.playlists.find(p => p.id === id);
const normalize = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function artistLine(t) {
  const a = artistById(t.artist);
  return t.feat ? `${a.name}, ${t.feat}` : a.name;
}

// Durées réelles des fichiers audio (lues une seule fois)
const durations = {};
function loadDurations() {
  [...new Set(TRACKS.map(t => t.src))].forEach(src => {
    const a = new Audio();
    a.preload = "metadata";
    a.addEventListener("loadedmetadata", () => {
      durations[src] = a.duration;
      $$(`[data-dur="${src}"]`).forEach(el => (el.textContent = fmt(a.duration)));
    });
    a.src = src;
  });
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- 4. COMPOSANTS (morceaux de HTML réutilisables) ---------- */
function coverHTML(colorIdx, size, opts = {}) {
  const [c1, c2] = PALETTES[colorIdx % PALETTES.length];
  const label = opts.label && !opts.img ? `<span class="cover-label">${esc(opts.label)}</span>` : "";
  const img = opts.img ? `background-image:url('${opts.img}');` : "";
  return `<span class="cover ${opts.img ? "has-photo" : ""} ${opts.cls || ""}" style="--c1:${c1};--c2:${c2};${size ? `--size:${size}px;` : ""}--r:${opts.r || 8}px;${img}">${label}</span>`;
}
function avatarHTML(artist, size) {
  const [c1, c2] = PALETTES[artist.color % PALETTES.length];
  const photo = artist.photo ? `background-image:url('${artist.photo}');` : "";
  return `<span class="avatar ${artist.photo ? "has-photo" : ""}" style="--c1:${c1};--c2:${c2};--size:${size}px;${photo}" role="img" aria-label="${esc(artist.name)}"></span>`;
}

// Une ligne de titre. Le parent doit porter data-queue="t1,t2,…" pour la file de lecture.
function trackRow(t, n, opts = {}) {
  const liked = state.likes.has(t.id);
  const album = opts.album ? `<span class="album">${esc(opts.albumText ? opts.albumText(t) : t.album)}</span>` : "";
  const remove = opts.playlistId ? ` data-in-playlist="${opts.playlistId}"` : "";
  return `
    <div class="track ${opts.album ? "with-album" : ""}" data-track="${t.id}" role="button" tabindex="0" aria-label="Écouter ${esc(t.title)}">
      <span class="num" data-num="${n}">${n}</span>
      ${coverHTML(t.color, 44, { r: 6, img: t.cover })}
      <div class="track-text">
        <strong>${esc(t.title)}</strong>
        <a href="#/artiste/${t.artist}" data-stop>${esc(opts.subtitle ? opts.subtitle(t) : artistLine(t))}</a>
      </div>
      ${album}
      <button class="icon-btn like-btn ${liked ? "liked" : ""}" data-like="${t.id}" aria-label="${liked ? "Ne plus aimer" : "Aimer"}">${ic("heart")}</button>
      <span class="dur" data-dur="${t.src}">${durations[t.src] ? fmt(durations[t.src]) : "--:--"}</span>
      <button class="icon-btn" data-more="${t.id}"${remove} aria-label="Plus d'options">${ic("more")}</button>
    </div>`;
}
function trackList(tracks, opts = {}) {
  if (!tracks.length) return `<div class="empty">${opts.empty || "Aucun titre pour le moment."}</div>`;
  const ids = tracks.map(t => t.id).join(",");
  const source = opts.source ? ` data-source="${esc(opts.source)}"` : "";
  return `<div class="tracks" data-queue="${ids}"${source}>${tracks.map((t, i) => trackRow(t, i + 1, opts)).join("")}</div>`;
}
function artistCard(a) {
  return `<a class="artist-card" href="#/artiste/${a.id}">${avatarHTML(a, 104)}<strong>${esc(a.name)}</strong><span>${esc(a.genre)}</span></a>`;
}
function sectionHead(title, link) {
  return `<div class="section-head"><h2 class="h2">${title}</h2>${link ? `<a class="link-gold" href="${link}">Tout voir</a>` : ""}</div>`;
}

/* ---------- 5. VUES ---------- */
function viewHome() {
  const a = artistById(FEATURED_ARTIST);
  const prefs = user ? user.genres : [];
  const genres = ["Tout", ...prefs, ...GENRES.slice(0, 6).map(g => g.name).filter(g => !prefs.includes(g))];
  const trending = TRENDING.map(trackById).filter(t => state.homeGenre === "Tout" || t.genre === state.homeGenre);
  const newgen = ARTISTS.filter(x => x.newgen);
  return `
    <section class="hero">
      <div class="hero-text">
        <span class="label">★ Artiste à la une</span>
        <h1>${esc(a.name)}</h1>
        <p>${esc(a.tagline)}</p>
        <div class="hero-actions">
          <button class="btn light" data-play-artist="${a.id}">${ic("play")}Écouter</button>
          <a class="btn ghost" href="#/artiste/${a.id}">Voir l'artiste</a>
        </div>
      </div>
      ${avatarHTML(a, 220)}
    </section>
    <div class="chips" role="tablist" aria-label="Filtrer par genre">
      ${genres.map(g => `<button class="chip ${g === state.homeGenre ? "active" : ""}" data-home-genre="${g}">${g}</button>`).join("")}
    </div>
    <div class="split">
      <section class="section">
        ${sectionHead("Tendances à Dakar", "#/explorer")}
        ${trackList(trending.slice(0, 5), { source: "Tendances à Dakar", empty: "Pas encore de tendance pour ce genre." })}
      </section>
      <section class="section">
        ${sectionHead("Nouvelle génération", "#/explorer")}
        <div class="artists spread">${newgen.map(artistCard).join("")}</div>
      </section>
    </div>`;
}

function genreCard(g, i) {
  const [c1, c2] = PALETTES[g.color];
  return `<a class="genre-card" href="#/genre/${encodeURIComponent(g.name)}" style="--c1:${c1};--c2:${c2}">
      <strong>${esc(g.name)}</strong><span>${g.artists} artistes</span>${coverHTML(i + 3, 90, { r: 10 })}</a>`;
}

function viewExplorer() {
  const artists = state.region ? ARTISTS.filter(a => a.region === state.region) : ARTISTS.slice(0, 7);
  return `
    <div><h1 class="h1">Explorer</h1><p class="lead">Découvre la musique sénégalaise par genre et par région.</p></div>
    <section class="section">
      <h2 class="h2">Genres</h2>
      <div class="genre-grid">${GENRES.map(genreCard).join("")}</div>
    </section>
    <section class="section">
      <h2 class="h2">Par région</h2>
      <div class="chips">${REGIONS.map(r => `<button class="chip ${r === state.region ? "active" : ""}" data-region="${r}">${r}</button>`).join("")}</div>
    </section>
    <section class="section">
      ${sectionHead(state.region ? `Artistes · ${esc(state.region)}` : "Artistes populaires")}
      ${artists.length ? `<div class="artists">${artists.map(artistCard).join("")}</div>`
        : `<div class="empty">Aucun artiste de ${esc(state.region)} pour l'instant. Reviens bientôt !</div>`}
    </section>`;
}

function viewGenre(name) {
  const g = GENRES.find(x => x.name === name);
  if (!g) return viewNotFound();
  const [c1, c2] = PALETTES[g.color];
  const tracks = TRACKS.filter(t => t.genre === name);
  const artists = ARTISTS.filter(a => a.genre === name);
  return `
    <a class="link-gold" href="#/explorer">← Explorer</a>
    <section class="pl-banner" style="background:linear-gradient(90deg, ${c1}, ${c2})">
      ${coverHTML(g.color, 150, { r: 14 })}
      <div class="pl-banner-text"><span class="label" style="color:var(--creme)">Genre</span><h2>${esc(g.name)}</h2><p style="color:var(--creme)">${tracks.length} titre(s) · ${artists.length} artiste(s) sur Xalam</p></div>
      ${tracks.length ? `<div class="actions"><button class="play-btn ocre" data-play-list="genre" aria-label="Tout écouter">${ic("play")}</button></div>` : ""}
    </section>
    <section class="section">
      <h2 class="h2">Titres</h2>
      ${trackList(tracks, { album: true, source: g.name, empty: "Les premiers titres de ce genre arrivent bientôt." })}
    </section>
    ${artists.length ? `<section class="section"><h2 class="h2">Artistes</h2><div class="artists">${artists.map(artistCard).join("")}</div></section>` : ""}`;
}

function viewArtist(id) {
  const a = artistById(id);
  if (!a) return viewNotFound();
  const tracks = tracksOf(id);
  const following = state.follows.has(id);
  const albums = a.albums || [...new Map(tracks.filter(t => t.album !== "Single").map(t => [t.album, { title: t.album, year: t.year, type: "Album", color: t.color, cover: t.cover }])).values()];
  return `
    <header class="artist-header">
      <div><button class="icon-btn round" data-action="back" aria-label="Retour">${ic("back")}</button></div>
      <div class="artist-id">
        ${avatarHTML(a, 200)}
        <div>
          <span class="label">${a.verified ? "✓ Artiste vérifié · " : ""}${esc(a.genre)}</span>
          <h1>${esc(a.name)}</h1>
          <span class="muted">${esc(a.region)}, Sénégal · ${esc(a.badge)}</span>
        </div>
      </div>
    </header>
    <div class="actions">
      ${tracks.length ? `<button class="play-btn ocre" data-play-artist="${id}" aria-label="Écouter ${esc(a.name)}">${ic("play")}</button>` : ""}
      <button class="btn ghost sm ${following ? "following" : ""}" data-follow="${id}">${following ? "Abonné" : "Suivre"}</button>
      ${tracks.length > 1 ? `<button class="icon-btn" data-play-artist="${id}" data-shuffle aria-label="Lecture aléatoire">${ic("shuffle")}</button>` : ""}
    </div>
    <div class="split">
      <section class="section">
        <h2 class="h2">Populaires</h2>
        ${trackList(tracks, { album: true, source: a.name, empty: "Les extraits de cet artiste arrivent bientôt sur Xalam." })}
      </section>
      <section class="section">
        ${albums.length ? `${sectionHead("Discographie")}
        <div class="albums">${albums.map(al => `<div class="album-card">${coverHTML(al.color, 150, { r: 12, img: al.cover })}<strong>${esc(al.title)}</strong><span>${al.year || ""}${al.year ? " · " : ""}${al.type}</span></div>`).join("")}</div>` : ""}
        <div class="about"><h3 class="h2" style="font-size:20px">À propos</h3><p>${esc(a.bio)}</p></div>
      </section>
    </div>`;
}

function viewLibrary(tab, selectedId) {
  const tabs = [["playlists", "Playlists", "#/playlists"], ["artistes", "Artistes suivis", "#/bibliotheque/artistes"], ["aimes", "Titres aimés", "#/bibliotheque"]];
  const head = `
    <div class="lib-head">
      <h1 class="h1">Ma bibliothèque</h1>
      <div class="chips">${tabs.map(([k, l, h]) => `<a class="chip ${k === tab ? "active" : ""}" href="${h}">${l}</a>`).join("")}</div>
    </div>`;

  if (tab === "artistes") {
    const list = ARTISTS.filter(a => state.follows.has(a.id));
    return head + (list.length ? `<div class="artists">${list.map(artistCard).join("")}</div>`
      : `<div class="empty">Tu ne suis encore aucun artiste. Va dans <a class="link-gold" href="#/explorer">Explorer</a> !</div>`);
  }

  // Playlists + Titres aimés
  const sel = tab === "aimes" ? "liked" : (selectedId || (state.playlists[0] && state.playlists[0].id) || "liked");
  const cards = `
    <div class="pl-grid">
      <div class="pl-card" data-action="new-playlist" role="button" tabindex="0">
        <div class="pl-new"><span class="play-btn">${ic("plus")}</span>Nouvelle playlist</div>
      </div>
      <a class="pl-card ${sel === "liked" ? "selected" : ""}" href="#/bibliotheque">
        <div class="pl-liked">${ic("heart")}</div><strong>Titres aimés</strong><span>${state.likes.size} titre(s)</span>
      </a>
      ${state.playlists.map(p => `
        <a class="pl-card ${sel === p.id ? "selected" : ""}" href="#/playlist/${p.id}">
          ${coverHTML(p.color, 0, { r: 16 })}<strong>${esc(p.name)}</strong><span>${p.tracks.length} titre(s) · Toi</span>
        </a>`).join("")}
    </div>`;

  let banner, list;
  if (sel === "liked") {
    const tracks = [...state.likes].map(trackById).filter(Boolean);
    banner = `<section class="pl-banner"><div class="pl-liked">${ic("heart")}</div>
      <div class="pl-banner-text"><span class="label">Playlist</span><h2>Titres aimés</h2><p>Tous les titres que tu as aimés · ${tracks.length} titre(s)</p></div>
      ${tracks.length ? `<div class="actions"><button class="icon-btn" data-play-list="current" data-shuffle aria-label="Aléatoire">${ic("shuffle")}</button><button class="play-btn ocre" data-play-list="current" aria-label="Lire">${ic("play")}</button></div>` : ""}</section>`;
    list = trackList(tracks, { album: true, source: "Titres aimés", empty: "Appuie sur ♡ à côté d'un titre pour le retrouver ici." });
  } else {
    const p = playlistById(sel);
    if (!p) return head + cards;
    const tracks = p.tracks.map(trackById).filter(Boolean);
    banner = `<section class="pl-banner">${coverHTML(p.color, 150, { r: 14 })}
      <div class="pl-banner-text"><span class="label">Playlist</span><h2>${esc(p.name)}</h2><p>${esc(p.desc || "")}${p.desc ? " · " : ""}${tracks.length} titre(s)</p></div>
      <div class="actions">
        <button class="icon-btn" data-delete-playlist="${p.id}" aria-label="Supprimer la playlist">${ic("trash")}</button>
        ${tracks.length ? `<button class="icon-btn" data-play-list="current" data-shuffle aria-label="Aléatoire">${ic("shuffle")}</button><button class="play-btn ocre" data-play-list="current" aria-label="Lire">${ic("play")}</button>` : ""}
      </div></section>`;
    list = trackList(tracks, { album: true, source: p.name, playlistId: p.id, empty: "Playlist vide. Ajoute des titres avec le bouton ••• d'un morceau." });
  }
  return head + cards + banner + list;
}

function viewSearch(q) {
  const n = normalize(q);
  const tracks = TRACKS.filter(t => normalize(`${t.title} ${artistLine(t)} ${t.genre} ${t.album}`).includes(n));
  const artists = ARTISTS.filter(a => normalize(`${a.name} ${a.genre} ${a.region}`).includes(n));
  const genres = GENRES.filter(g => normalize(g.name).includes(n));
  if (!tracks.length && !artists.length && !genres.length) {
    return `<div><h1 class="h1">Recherche</h1><p class="lead">Aucun résultat pour « ${esc(q)} ».</p></div>`;
  }
  return `
    <div><h1 class="h1">Résultats</h1><p class="lead">Pour « ${esc(q)} »</p></div>
    ${tracks.length ? `<section class="section"><h2 class="h2">Titres</h2>${trackList(tracks, { album: true, source: "Recherche" })}</section>` : ""}
    ${artists.length ? `<section class="section"><h2 class="h2">Artistes</h2><div class="artists">${artists.map(artistCard).join("")}</div></section>` : ""}
    ${genres.length ? `<section class="section"><h2 class="h2">Genres</h2><div class="genre-grid">${genres.map(genreCard).join("")}</div></section>` : ""}`;
}

/* Pages Connexion / Inscription (affichées dans #auth) */
function inputField(id, label, iconName, type, placeholder, autocomplete) {
  const eye = type === "password" ? `<button type="button" class="icon-btn" data-toggle-pw="${id}" aria-label="Afficher le mot de passe">${ic("eye")}</button>` : "";
  return `<div class="field">
      <label for="${id}">${label}</label>
      <div class="input">${ic(iconName)}<input id="${id}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}">${eye}</div>
      <span class="error" id="${id}-error"></span>
    </div>`;
}

function renderAuth(page) {
  const login = page === "connexion";
  $("#auth-title").innerHTML = login ? "Ta musique,<br>ta teranga." : "Rejoins la<br>scène sénégalaise.";
  $$("[data-auth-tab]").forEach(a => a.classList.toggle("active", a.dataset.authTab === page));
  $("#auth-form").innerHTML = login ? `
    <form class="auth-form" id="login-form" novalidate>
      <h2>Content de te revoir</h2>
      <p class="lead">Connecte-toi pour retrouver tes playlists.</p>
      <div class="form-error" id="login-error" role="alert"></div>
      ${inputField("login-email", "Adresse e-mail", "mail", "email", "alioune@exemple.sn", "email")}
      ${inputField("login-password", "Mot de passe", "lock", "password", "••••••••", "current-password")}
      <div class="form-row">
        <label class="checkbox"><input type="checkbox" id="login-remember" checked>Se souvenir de moi</label>
        <button type="button" class="link-gold" data-action="forgot">Mot de passe oublié ?</button>
      </div>
      <button class="btn full" type="submit">Se connecter</button>
      <p class="auth-switch">Pas encore de compte ? <a href="#/inscription">Créer un compte</a></p>
    </form>` : `
    <form class="auth-form" id="signup-form" novalidate>
      <h2>Crée ton compte</h2>
      <p class="lead">Gratuit. Ça prend moins d’une minute.</p>
      ${inputField("signup-name", "Nom complet", "user", "text", "Alioune B. Gueye", "name")}
      ${inputField("signup-email", "Adresse e-mail", "mail", "email", "alioune@exemple.sn", "email")}
      ${inputField("signup-password", "Mot de passe", "lock", "password", "8 caractères minimum", "new-password")}
      <div class="field">
        <label>Tes genres préférés</label>
        <div class="chips genre-pick">${GENRES.slice(0, 5).map(g => `<button type="button" class="chip" data-pick-genre="${g.name}" aria-pressed="false">${g.name}</button>`).join("")}</div>
      </div>
      <div class="field">
        <label class="checkbox"><input type="checkbox" id="signup-terms"><span class="muted">J’accepte les <b>conditions d’utilisation</b></span></label>
        <span class="error" id="signup-terms-error"></span>
      </div>
      <button class="btn full" type="submit">Créer mon compte</button>
      <p class="auth-switch">Déjà inscrit ? <a href="#/connexion">Se connecter</a></p>
    </form>`;
  hydrateIcons($("#auth"));
  const form = $("#auth-form form");
  form.addEventListener("submit", login ? handleLogin : handleSignup);
  form.addEventListener("input", e => setError(e.target.id, ""));   // efface l'erreur quand on corrige
  setTimeout(() => form.querySelector("input").focus(), 50);
}

function setError(id, msg) {
  const err = $(`#${id}-error`);
  if (err) err.textContent = msg;
  const box = $(`#${id}`) && $(`#${id}`).closest(".input");
  if (box) box.classList.toggle("invalid", !!msg);
  return !msg;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function handleSignup(e) {
  e.preventDefault();
  const name = $("#signup-name").value.trim();
  const email = $("#signup-email").value.trim().toLowerCase();
  const password = $("#signup-password").value;
  const genres = $$("[data-pick-genre].active").map(b => b.dataset.pickGenre);
  let ok = true;
  ok = setError("signup-name", name.length < 2 ? "Indique ton nom (2 caractères minimum)." : "") && ok;
  ok = setError("signup-email", !EMAIL_RE.test(email) ? "Adresse e-mail invalide." : findUser(email) ? "Un compte existe déjà avec cet e-mail." : "") && ok;
  ok = setError("signup-password", password.length < 8 ? "8 caractères minimum." : "") && ok;
  ok = setError("signup-terms", !$("#signup-terms").checked ? "Tu dois accepter les conditions d’utilisation." : "") && ok;
  if (!ok) { const first = $("#signup-form .invalid input, #signup-form .error:not(:empty)"); if (first && first.focus) first.focus(); return; }
  const btn = e.target.querySelector("[type=submit]");
  btn.disabled = true;
  const newUser = { name, email, genres, hash: await hashPassword(email, password), created: Date.now() };
  writeJSON(localStorage, USERS_KEY, [...getUsers(), newUser]);
  toast(`Bienvenue sur Xalam, ${name.split(" ")[0]} !`);
  openSession(newUser, true);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = $("#login-email").value.trim().toLowerCase();
  const password = $("#login-password").value;
  $("#login-error").textContent = "";
  let ok = true;
  ok = setError("login-email", !EMAIL_RE.test(email) ? "Adresse e-mail invalide." : "") && ok;
  ok = setError("login-password", !password ? "Entre ton mot de passe." : "") && ok;
  if (!ok) return;
  const u = findUser(email);
  if (!u || u.hash !== await hashPassword(email, password)) {
    $("#login-error").textContent = "E-mail ou mot de passe incorrect.";
    return;
  }
  toast(`Content de te revoir, ${u.name.split(" ")[0]} !`);
  openSession(u, $("#login-remember").checked);
}

function viewNotFound() {
  return `<div><h1 class="h1">Page introuvable</h1><p class="lead">Cette page n'existe pas. <a class="link-gold" href="#/">Retour à l'accueil</a></p></div>`;
}

/* ---------- 6. ROUTEUR ---------- */
function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  return { page: parts[0] || "", param: parts[1] || "" };
}

function render() {
  const { page, param } = parseRoute();
  const isAuth = page === "connexion" || page === "inscription";
  if (!user && !isAuth) { location.replace("#/connexion"); return; }   // pages protégées
  if (user && isAuth) { location.replace("#/"); return; }
  document.body.classList.toggle("auth-mode", isAuth);
  $("#auth").hidden = !isAuth;
  if (isAuth) { renderAuth(page); return; }
  let html, nav = "";
  switch (page) {
    case "": html = viewHome(); nav = "accueil"; break;
    case "explorer": html = viewExplorer(); nav = "explorer"; break;
    case "genre": html = viewGenre(param); nav = "explorer"; break;
    case "artiste": html = viewArtist(param); nav = "explorer"; break;
    case "playlists": html = viewLibrary("playlists"); nav = "playlists"; break;
    case "playlist": html = viewLibrary("playlists", param); nav = "playlists"; break;
    case "bibliotheque": html = viewLibrary(param === "artistes" ? "artistes" : "aimes"); nav = "bibliotheque"; break;
    case "recherche": html = viewSearch(param); break;
    default: html = viewNotFound();
  }
  const view = $("#view");
  view.innerHTML = html;
  view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
  hydrateIcons(view);
  $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === nav));
  if (page !== "recherche" && $("#search").value && document.activeElement !== $("#search")) $("#search").value = "";
  renderSidebar();
  refreshPlaying();
}

function renderSidebar() {
  $("#side-playlists").innerHTML = state.playlists.map(p =>
    `<li><a href="#/playlist/${p.id}">${coverHTML(p.color, 40, { r: 8 })}<div><strong>${esc(p.name)}</strong><small>${p.tracks.length} titre(s)</small></div></a></li>`
  ).join("");
}

// Re-dessine la vue en gardant la position de défilement
function rerender() {
  const main = $("#main"), y = main.scrollTop;
  render();
  main.scrollTop = y;
}

/* ---------- 7. LECTEUR AUDIO ---------- */
const audio = $("#audio");
const player = {
  queue: [],        // liste d'identifiants de titres
  index: -1,        // position dans la file
  source: "Xalam",  // d'où vient la lecture (affiché dans le plein écran)
  shuffle: false,
  repeat: "off",    // "off" | "all" | "one"
  history: []
};
const current = () => trackById(player.queue[player.index]);

function playQueue(ids, startIndex = 0, source = "Xalam", shuffle = false) {
  if (!ids.length) return;
  player.queue = [...ids];
  player.source = source;
  player.history = [];
  if (shuffle) { player.shuffle = true; startIndex = Math.floor(Math.random() * ids.length); }
  loadTrack(startIndex, true);
  updateModeButtons();
}

function loadTrack(i, autoplay = true) {
  player.index = i;
  const t = current();
  if (!t) return;
  audio.src = t.src;
  updateNowPlaying();
  if (autoplay) audio.play().catch(() => { /* lecture bloquée par le navigateur */ });
}

function togglePlay() {
  if (!current()) { playQueue(TRENDING, 0, "Tendances à Dakar"); return; }
  audio.paused ? audio.play().catch(() => {}) : audio.pause();
}

function nextIndex() {
  const n = player.queue.length;
  if (player.shuffle && n > 1) {
    let r; do { r = Math.floor(Math.random() * n); } while (r === player.index);
    return r;
  }
  if (player.index + 1 < n) return player.index + 1;
  return player.repeat === "all" ? 0 : -1;
}

function next(auto = false) {
  if (!current()) return;
  const i = nextIndex();
  if (i === -1) {             // fin de la file
    if (auto) { audio.pause(); audio.currentTime = 0; updatePlayState(); }
    else loadTrack(0);
    return;
  }
  player.history.push(player.index);
  loadTrack(i);
}

function prev() {
  if (!current()) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }   // revient au début du titre
  const i = player.history.length ? player.history.pop() : Math.max(0, player.index - 1);
  loadTrack(i);
}

function cycleRepeat() {
  player.repeat = { off: "all", all: "one", one: "off" }[player.repeat];
  toast({ off: "Répétition désactivée", all: "Répéter la file", one: "Répéter ce titre" }[player.repeat]);
  updateModeButtons();
}
function toggleShuffle() {
  player.shuffle = !player.shuffle;
  toast(player.shuffle ? "Lecture aléatoire activée" : "Lecture aléatoire désactivée");
  updateModeButtons();
}

function updateModeButtons() {
  ["#btn-shuffle", "#fp-shuffle"].forEach(s => $(s).classList.toggle("on", player.shuffle));
  ["#btn-repeat", "#fp-repeat"].forEach(s => {
    const b = $(s);
    b.classList.toggle("on", player.repeat !== "off");
    setIcon(b.querySelector("i"), player.repeat === "one" ? "repeat1" : "repeat");
  });
}

function updateNowPlaying() {
  const t = current();
  if (!t) return;
  const a = artistById(t.artist);
  const [c1, c2] = PALETTES[t.color % PALETTES.length];
  for (const id of ["#p-cover", "#fp-cover"]) {
    const el = $(id);
    el.style.setProperty("--c1", c1);
    el.style.setProperty("--c2", c2);
    el.style.backgroundImage = t.cover ? `url('${t.cover}')` : "";
    el.classList.toggle("has-photo", !!t.cover);
  }
  $("#fp-cover").innerHTML = t.cover ? "" : `<span class="cover-label">${esc(t.album === "Single" ? t.title : t.album.replace(/.*\((.*)\)/, "$1"))}</span>`;
  $("#p-title").textContent = t.title;
  $("#p-artist").textContent = artistLine(t);
  $("#fp-title").textContent = t.title;
  $("#fp-artist").textContent = artistLine(t);
  $("#fp-artist").href = `#/artiste/${a.id}`;
  $("#fp-album").textContent = [t.album !== "Single" ? `Album ${t.album}` : "Single", t.genre, t.year].filter(Boolean).join(" · ");
  $("#fp-source").textContent = player.source;
  document.title = `${t.title} · ${a.name} — Xalam`;
  updateLikeButtons();
  renderQueue();
  refreshPlaying();
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: artistLine(t), album: t.album });
  }
}

function updatePlayState() {
  const playing = !audio.paused;
  ["#btn-play", "#fp-play"].forEach(s => {
    setIcon($(s).querySelector("i"), playing ? "pause" : "play");
    $(s).setAttribute("aria-label", playing ? "Pause" : "Lecture");
  });
  refreshPlaying();
}

function updateProgress() {
  const d = audio.duration || 0, c = audio.currentTime || 0;
  const pct = d ? (c / d) * 100 : 0;
  for (const s of ["#p-seek", "#fp-seek"]) {
    const r = $(s);
    if (!r.matches(":active")) r.value = pct;
    r.style.setProperty("--val", pct + "%");
  }
  $("#p-mini").style.width = pct + "%";
  $("#p-current").textContent = $("#fp-current").textContent = fmt(c);
  $("#p-duration").textContent = $("#fp-duration").textContent = fmt(d);
}

function seekTo(pct) {
  if (audio.duration) audio.currentTime = (pct / 100) * audio.duration;
}

function setVolume(v) {
  state.volume = Math.min(1, Math.max(0, v));
  audio.volume = state.volume;
  audio.muted = false;
  const r = $("#p-volume");
  r.value = state.volume;
  r.style.setProperty("--val", state.volume * 100 + "%");
  setIcon($("#btn-mute i"), state.volume === 0 ? "mute" : "vol");
  saveStore();
}

// Met en évidence le titre en cours dans toutes les listes affichées
function refreshPlaying() {
  const t = current();
  $$(".track").forEach(row => {
    const on = t && row.dataset.track === t.id;
    row.classList.toggle("playing", !!on);
    const num = row.querySelector(".num");
    if (!num) return;
    if (on) num.innerHTML = ic(audio.paused ? "play" : "pause");
    else if (num.dataset.num) num.textContent = num.dataset.num;
  });
}

function renderQueue() {
  const upcoming = player.queue.slice(player.index + 1).map(trackById).filter(Boolean);
  $("#fp-count").textContent = upcoming.length ? `${upcoming.length} titre(s)` : "";
  $("#fp-queue").innerHTML = upcoming.length
    ? `<div class="tracks" data-queue="${player.queue.join(",")}" data-offset="${player.index + 1}" data-source="${esc(player.source)}">${upcoming.map((t, i) => trackRow(t, player.index + 2 + i)).join("")}</div>`
    : `<p class="muted" style="font-size:14px">Fin de la file. Choisis un autre titre ou active la répétition.</p>`;
  hydrateIcons($("#fp-queue"));
}

function openFull() {
  if (!current()) { toast("Choisis d'abord un titre à écouter"); return; }
  $("#fullplayer").hidden = false;
}
function closeFull() { $("#fullplayer").hidden = true; }

/* ---------- Likes, abonnements, playlists ---------- */
function toggleLike(id) {
  if (state.likes.has(id)) { state.likes.delete(id); toast("Retiré des titres aimés"); }
  else { state.likes.add(id); toast("Ajouté aux titres aimés ♥"); }
  saveStore();
  updateLikeButtons();
  const r = parseRoute();
  if (r.page === "bibliotheque" && !r.param) rerender();
}
function updateLikeButtons() {
  $$("[data-like]").forEach(b => b.classList.toggle("liked", state.likes.has(b.dataset.like)));
  const t = current();
  ["#p-like", "#fp-like"].forEach(s => $(s).classList.toggle("liked", !!t && state.likes.has(t.id)));
}

let pendingTrack = null;   // titre à ajouter après création d'une playlist
function openModal(trackId = null) {
  pendingTrack = trackId;
  $("#modal").hidden = false;
  $("#pl-name").value = "";
  $("#pl-desc").value = "";
  setTimeout(() => $("#pl-name").focus(), 50);
}
function closeModal() { $("#modal").hidden = true; }

function createPlaylist(name, desc) {
  const p = { id: "p" + Date.now(), name, desc, color: Math.floor(Math.random() * PALETTES.length), tracks: pendingTrack ? [pendingTrack] : [] };
  state.playlists.push(p);
  saveStore();
  closeModal();
  toast(`Playlist « ${name} » créée`);
  location.hash = `#/playlist/${p.id}`;
  rerender();
}

function addToPlaylist(pid, tid) {
  const p = playlistById(pid);
  if (!p) return;
  if (p.tracks.includes(tid)) { toast(`Déjà dans « ${p.name} »`); return; }
  p.tracks.push(tid);
  saveStore();
  toast(`Ajouté à « ${p.name} »`);
  rerender();
}
function removeFromPlaylist(pid, tid) {
  const p = playlistById(pid);
  if (!p) return;
  p.tracks = p.tracks.filter(x => x !== tid);
  saveStore();
  toast(`Retiré de « ${p.name} »`);
  rerender();
}
function deletePlaylist(pid) {
  const p = playlistById(pid);
  if (!p) return;
  state.playlists = state.playlists.filter(x => x.id !== pid);
  saveStore();
  toast(`Playlist « ${p.name} » supprimée`);
  location.hash = "#/playlists";
  rerender();
}

function openMenu(btn) {
  const tid = btn.dataset.more, inPl = btn.dataset.inPlaylist;
  const menu = $("#menu");
  menu.innerHTML = `
    <p>Ajouter à une playlist</p>
    ${state.playlists.map(p => `<button data-add-to="${p.id}" data-tid="${tid}">${ic(p.tracks.includes(tid) ? "check" : "list")}${esc(p.name)}</button>`).join("")}
    <button data-action="new-playlist" data-tid="${tid}">${ic("plus")}Nouvelle playlist</button>
    ${inPl ? `<button data-remove-from="${inPl}" data-tid="${tid}">${ic("trash")}Retirer de cette playlist</button>` : ""}
    <button data-goto-artist="${trackById(tid).artist}">${ic("search")}Voir l'artiste</button>`;
  menu.hidden = false;
  const r = btn.getBoundingClientRect();
  const w = menu.offsetWidth, h = menu.offsetHeight;
  menu.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w)) + "px";
  menu.style.top = (r.bottom + h + 8 > window.innerHeight ? r.top - h - 6 : r.bottom + 6) + "px";
}
function closeMenu() { $("#menu").hidden = true; }

function openUserMenu(btn) {
  const menu = $("#menu");
  menu.innerHTML = `
    <p>${esc(user.name)}</p>
    <button data-goto="#/bibliotheque">${ic("heart")}Titres aimés</button>
    <button data-goto="#/bibliotheque/artistes">${ic("user")}Artistes suivis</button>
    <button data-action="logout">${ic("logout")}Se déconnecter</button>`;
  menu.hidden = false;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.max(8, r.right - menu.offsetWidth) + "px";
  menu.style.top = r.bottom + 8 + "px";
}

/* ---------- 8. ÉVÉNEMENTS ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("button, a, [data-action], .track");
  if (!el) { closeMenu(); return; }
  if (!el.closest("#menu") && !el.dataset.more) closeMenu();

  const d = el.dataset;
  if (d.togglePw) {
    const input = $("#" + d.togglePw), show = input.type === "password";
    input.type = show ? "text" : "password";
    setIcon(el.querySelector("i"), show ? "eyeOff" : "eye");
    el.setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe");
    return;
  }
  if (d.pickGenre) { el.classList.toggle("active"); el.setAttribute("aria-pressed", el.classList.contains("active")); return; }
  if (d.action === "forgot") { toast("Récupération par e-mail bientôt disponible"); return; }
  if (el.id === "user-btn") { openUserMenu(el); return; }
  if (d.action === "logout") { closeMenu(); logout(); return; }
  if (d.action === "new-playlist") { closeMenu(); openModal(d.tid || null); return; }
  if (d.action === "close-modal") { closeModal(); return; }
  if (d.action === "open-full") { openFull(); return; }
  if (d.action === "close-full") { closeFull(); return; }
  if (d.action === "back") { history.length > 1 ? history.back() : (location.hash = "#/"); return; }

  if (d.like) { e.stopPropagation(); toggleLike(d.like); return; }
  if (el.id === "p-like" || el.id === "fp-like") { if (current()) toggleLike(current().id); return; }
  if (d.more) { e.stopPropagation(); openMenu(el); return; }
  if (d.addTo) { addToPlaylist(d.addTo, d.tid); closeMenu(); return; }
  if (d.removeFrom) { removeFromPlaylist(d.removeFrom, d.tid); closeMenu(); return; }
  if (d.goto) { closeMenu(); location.hash = d.goto; return; }
  if (d.gotoArtist) { closeMenu(); closeFull(); location.hash = `#/artiste/${d.gotoArtist}`; return; }
  if (d.deletePlaylist) { deletePlaylist(d.deletePlaylist); return; }
  if (d.follow) {
    state.follows.has(d.follow) ? state.follows.delete(d.follow) : state.follows.add(d.follow);
    toast(state.follows.has(d.follow) ? "Tu suis maintenant cet artiste" : "Abonnement retiré");
    saveStore(); rerender(); return;
  }
  if (d.homeGenre) { state.homeGenre = d.homeGenre; rerender(); return; }
  if (d.region) { state.region = state.region === d.region ? null : d.region; rerender(); return; }
  if (d.playArtist) {
    const a = artistById(d.playArtist);
    playQueue(tracksOf(d.playArtist).map(t => t.id), 0, a.name, "shuffle" in d);
    return;
  }
  if (d.playList) {
    const list = $("#view .tracks[data-queue]");
    if (list) playQueue(list.dataset.queue.split(","), 0, list.dataset.source || "Xalam", "shuffle" in d);
    return;
  }
  if ("stop" in d) { closeFull(); return; }   // lien artiste dans une ligne : on laisse naviguer

  // Clic sur une ligne de titre → lecture avec la liste comme file d'attente
  if (el.classList.contains("track")) {
    const list = el.closest("[data-queue]");
    const ids = list.dataset.queue.split(",");
    const idx = ids.indexOf(el.dataset.track, Number(list.dataset.offset || 0));
    if (current() && current().id === el.dataset.track && player.queue.join() === ids.join()) { togglePlay(); return; }
    if (list.closest("#fp-queue")) { player.history.push(player.index); loadTrack(idx); return; }
    playQueue(ids, idx, list.dataset.source || "Xalam");
    return;
  }

  if (el.closest(".fullplayer") && el.tagName === "A" && el.getAttribute("href")) closeFull();
});

// Touche Entrée sur une ligne / carte (accessibilité clavier)
document.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if (e.key === "Enter" && !typing && document.activeElement.matches(".track, [data-action]")) {
    document.activeElement.click(); return;
  }
  if (e.key === "Escape") { closeMenu(); closeModal(); closeFull(); return; }
  if (typing || document.body.classList.contains("auth-mode")) return;
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  if (e.key === "ArrowRight" && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  if (e.key === "ArrowLeft" && audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 5);
});

// Boutons du lecteur (barre + plein écran)
[["#btn-play", "#fp-play", togglePlay], ["#btn-next", "#fp-next", () => next()], ["#btn-prev", "#fp-prev", prev],
 ["#btn-shuffle", "#fp-shuffle", toggleShuffle], ["#btn-repeat", "#fp-repeat", cycleRepeat]].forEach(([a, b, fn]) => {
  $(a).addEventListener("click", e => { e.stopPropagation(); fn(); });
  $(b).addEventListener("click", e => { e.stopPropagation(); fn(); });
});
$("#btn-mute").addEventListener("click", () => {
  if (audio.volume > 0 && !audio.muted) { audio.muted = true; setIcon($("#btn-mute i"), "mute"); $("#p-volume").style.setProperty("--val", "0%"); }
  else { setVolume(state.volume || 0.8); }
});
["#p-seek", "#fp-seek"].forEach(s => $(s).addEventListener("input", e => seekTo(Number(e.target.value))));
$("#p-volume").addEventListener("input", e => setVolume(Number(e.target.value)));

// Événements de l'élément <audio>
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("play", updatePlayState);
audio.addEventListener("pause", updatePlayState);
audio.addEventListener("ended", () => {
  if (player.repeat === "one") { audio.currentTime = 0; audio.play().catch(() => {}); }
  else next(true);
});
audio.addEventListener("error", () => toast("Impossible de lire ce fichier audio"));

// Commandes système (écran verrouillé, casque…)
if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", () => audio.play());
  navigator.mediaSession.setActionHandler("pause", () => audio.pause());
  navigator.mediaSession.setActionHandler("nexttrack", () => next());
  navigator.mediaSession.setActionHandler("previoustrack", prev);
}

// Recherche en direct
let searchTimer;
$("#search").addEventListener("input", e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = e.target.value.trim();
    if (q) location.hash = `#/recherche/${encodeURIComponent(q)}`;
    else if (parseRoute().page === "recherche") location.hash = "#/explorer";
  }, 250);
});

// Formulaire « nouvelle playlist »
$("#playlist-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#pl-name").value.trim();
  if (name) createPlaylist(name, $("#pl-desc").value.trim());
});
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });

// Navigation
window.addEventListener("hashchange", () => { closeMenu(); render(); $("#main").scrollTop = 0; });

/* ---------- Démarrage ---------- */
const session = getSession();
const sessionUser = session && findUser(session.email);
if (sessionUser) user = { name: sessionUser.name, email: sessionUser.email, genres: sessionUser.genres || [] };
loadUserState();
updateUserUI();
hydrateIcons();
setVolume(state.volume);
updateModeButtons();
loadDurations();
render();
// Prépare le premier titre (sans le lancer) pour que le lecteur ne soit pas vide
player.queue = [...TRENDING];
player.source = "Tendances à Dakar";
loadTrack(0, false);
