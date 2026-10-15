const PLACEHOLDER_IMAGE = "https://placehold.co/210x295?text=Sin+imagen";
const API_BASE = "https://api.tvmaze.com";

async function requestJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error("No se encontró una serie con ese ID.");
    throw new Error(`No fue posible consultar TVMaze (HTTP ${response.status}).`);
  }
  return response.json();
}

// Obtener los datos específicos solicitados de una serie por su ID.
export const getShowData = async (id) => {
  const data = await requestJSON(`${API_BASE}/shows/${encodeURIComponent(id)}`);
  return {
    name: data.name,
    rating: data.rating,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

// Obtener sus episodios y agruparlos por el número REAL de temporada.
export const getEpisodeList = async (id) => {
  const episodes = await requestJSON(`${API_BASE}/shows/${encodeURIComponent(id)}/episodes`);
  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating?.average ?? null
  }));

  // Equivale a Object.groupBy(episodeList, episode => episode.season),
  // pero también funciona en navegadores que aún no incluyen Object.groupBy.
  return episodeList.reduce((grouped, episode) => {
    (grouped[episode.season] ??= []).push(episode);
    return grouped;
  }, {});
};
