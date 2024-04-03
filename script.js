const API_URL = "https://pokeapi.co/api/v2/pokemon?offset=50&limit=50"; // Kan anvendes i forskjellige steder.
async function fetchPokemonData(url) {
  const response = await fetch(url);
  const randomPokemon = await response.json();
  const results = await randomPokemon.results;

  return results;
}
const pokemonResponse = fetchPokemonData(API_URL);

async function fetchPokemonDetails(pokemonResponse) {
  const pokemonList = await pokemonResponse;
  let fullPokemonDataFromApi = [];

  for (let index = 0; index < pokemonList.length; index++) {
    const pokemon = await pokemonList[index];
    const fullPokemonDetails = await fetch(pokemon.url);
    const detailedPokemonList = await fullPokemonDetails.json();
    fullPokemonDataFromApi = [...fullPokemonDataFromApi, detailedPokemonList];
  }
  return fullPokemonDataFromApi;
}

fetchPokemonDetails(pokemonResponse);
