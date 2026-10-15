import { getShowData, getEpisodeList } from "./services/tvmaze.js";

const DEFAULT_ID = "2993";
const $header = document.querySelector(".show-header");
const $episodes = document.querySelector(".episodes");
const $status = document.querySelector("#status");
const $form = document.querySelector("#show-form");
const $input = document.querySelector("#show-id");

// Evita que datos de una API se interpreten como etiquetas HTML.
const escapeHTML = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

// Se mantiene setHTMLUnsafe como en el ejercicio, con respaldo para navegadores antiguos.
const renderHTML = (element, html) => {
  if (typeof element.setHTMLUnsafe === "function") element.setHTMLUnsafe(html);
  else element.innerHTML = html;
};

const displayRating = (value) => typeof value === "number" ? value.toFixed(1) : "—";

// Cada episodio lleva las clases episode-## y rating-##.
const createEpisodeHTML = (episode) => {
  const number = Number.isInteger(episode.number) ? episode.number : "—";
  const ratingNumber = episode.rating;
  const ratingClass = typeof ratingNumber === "number"
    ? `rating-${Math.max(0, Math.min(10, Math.floor(ratingNumber)))}`
    : "rating-none";
  const episodeClass = Number.isInteger(episode.number) ? `episode-${episode.number}` : "episode-unknown";
  const tooltip = `Temporada ${episode.season}, episodio ${number}: ${displayRating(ratingNumber)}/10`;

  return `<div class="episode ${episodeClass} ${ratingClass}" title="${escapeHTML(tooltip)}" aria-label="${escapeHTML(tooltip)}" tabindex="0">${escapeHTML(number)}</div>`;
};

// Fila de temporada y sus episodios.
const createSeasonHTML = (data, number) => `
  <article class="season" aria-label="Temporada ${escapeHTML(number)}">
    <header class="season-header">
      <span class="season-number">T${escapeHTML(String(number).padStart(2, "0"))}</span>
      <span class="season-sub">${data.length} EP.</span>
    </header>
    ${data.map(createEpisodeHTML).join("")}
  </article>`;

let latestRequest = 0;

async function loadShow(id) {
  const request = ++latestRequest;
  $status.textContent = "Consultando los datos de la serie…";
  $status.hidden = false;
  renderHTML($header, "");
  renderHTML($episodes, "");

  try {
    const [show, seasons] = await Promise.all([getShowData(id), getEpisodeList(id)]);
    if (request !== latestRequest) return;

    const seasonCount = Object.keys(seasons).length;
    const episodeCount = Object.values(seasons).reduce((sum, episodes) => sum + episodes.length, 0);

    renderHTML($header, `
      <div class="poster-shell"><img class="poster" src="${escapeHTML(show.image)}" alt="Póster de ${escapeHTML(show.name)}" width="210" height="295" /></div>
      <div class="show-info">
        <div class="show-meta">ARCHIVO DE SERIE / ID ${escapeHTML(id)}</div>
        <h2 class="show-name">${escapeHTML(show.name)}</h2>
        <div class="show-facts">
          <div class="fact"><strong>★ ${displayRating(show.rating?.average)}</strong><span>Valoración / 10</span></div>
          <div class="fact"><strong>${seasonCount}</strong><span>Temporadas</span></div>
          <div class="fact"><strong>${episodeCount}</strong><span>Episodios</span></div>
        </div>
      </div>
    `);

    const list = Object.entries(seasons)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([number, episodes]) => createSeasonHTML(episodes, number));

    renderHTML($episodes, list.join("") || '<p class="empty">Esta serie todavía no tiene episodios registrados.</p>');
    $status.hidden = true;
  } catch (error) {
    if (request !== latestRequest) return;
    $status.textContent = error.message || "No fue posible cargar los datos de TVMaze.";
    $status.hidden = false;
  }
}

function getIDFromURL() {
  const candidate = new URLSearchParams(window.location.search).get("id");
  return candidate && /^[1-9]\d*$/.test(candidate) ? candidate : DEFAULT_ID;
}

$form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $input.value.trim();
  if (!/^[1-9]\d*$/.test(id)) return;
  const url = new URL(window.location.href);
  url.searchParams.set("id", id);
  window.history.pushState({}, "", url);
  loadShow(id);
});

window.addEventListener("popstate", () => {
  const id = getIDFromURL();
  $input.value = id;
  loadShow(id);
});

const ID = getIDFromURL();
$input.value = ID;
loadShow(ID);
