// 1.1 Visning av alle Pokemon:

const API_URL = "https://pokeapi.co/api/v2/pokemon?offset=50&limit=50"; // Kan anvendes i forskjellige steder.
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    const randomPokemon = await response.json();
    const results = await randomPokemon.results;

    return results;
  } catch (error) {
    alert("Ooops! Couldnt fetch pokemon.", error);
  }
}
const pokemonResponse = fetchPokemonData(API_URL);

async function fetchPokemonDetails(pokemonResponse) {
  const pokemonList = await pokemonResponse;
  if (pokemonList.length < 0) return []; // Hvis liste er tom , returner fra metoden nedenfor.
  let fullPokemonDataFromApi = [];

  for (let index = 0; index < pokemonList.length; index++) {
    const pokemon = await pokemonList[index];
    const fullPokemonDetails = await fetch(pokemon.url);

    const detailedPokemonList = await fullPokemonDetails.json();

    const pokemonContainer = document.querySelector(".pokemonContainer");
    // create container card
    const containerCard = document.createElement("div");
    containerCard.classList.add("pokemon");
    const nameElement = document.createElement("p");

    nameElement.innerHTML = "Name: " + detailedPokemonList.name;
    const typeElement = document.createElement("p");
    typeElement.innerHTML = "Type: " + detailedPokemonList.types[0].type.name;
    const imageElement = document.createElement("img");
    imageElement.src = detailedPokemonList.sprites.front_default;
    containerCard.appendChild(nameElement);
    containerCard.appendChild(typeElement);
    containerCard.appendChild(imageElement);
    pokemonContainer.appendChild(containerCard);
    fullPokemonDataFromApi = [...fullPokemonDataFromApi, detailedPokemonList];
  }

  return fullPokemonDataFromApi;
}

fetchPokemonDetails(pokemonResponse);
