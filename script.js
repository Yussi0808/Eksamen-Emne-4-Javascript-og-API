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
let pokemonliked = [];
const pokemonResponse = fetchPokemonData(API_URL);

async function fetchPokemonDetails(pokemonResponse) {
  const pokemonList = await pokemonResponse;

  if (pokemonList.length < 0) return []; // Hvis liste er tom , returner fra metoden nedenfor.
  let fullPokemonDataFromApi = [];
  pokemonliked.push(pokemonList);
  console.log(pokemonliked);

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
    const likedPokemon = document.createElement("button");
    const editPokemon = document.createElement("button");
    const deletePokemon = document.createElement("button");

    likedPokemon.textContent = "👍🏼";
    editPokemon.textContent = "✍️";
    deletePokemon.textContent = "❌";

    imageElement.src = detailedPokemonList.sprites.front_default;
    containerCard.appendChild(nameElement);
    containerCard.appendChild(typeElement);
    containerCard.appendChild(imageElement);
    containerCard.appendChild(likedPokemon);
    containerCard.appendChild(editPokemon);
    containerCard.appendChild(deletePokemon);
    pokemonContainer.appendChild(containerCard);
    pokemonliked.push(containerCard);

    fullPokemonDataFromApi = [...fullPokemonDataFromApi, detailedPokemonList];
  }

  return fullPokemonDataFromApi;
}

fetchPokemonDetails(pokemonResponse);

// 1.4 Lagre Pokemon:

// For å lagre: (krav at vi har key samt valuen som skal lagres)
function storeLocalStorage() {
  const pokemon = ["pokemon1", "pokemon2", "pokemon3"];
  localStorage.setItem("Pokemon key", JSON.stringify(pokemon));
  console.log(storeLocalStorage);

  document.querySelector("#output").innerHTML =
    "Pokemon er lagret i localStorage.";
}

// Hente data fra localStorage/SessionStorage
function showLocalStorage() {
  const storedPokemons = JSON.parse(localStorage.getItem("Pokemon key"));
  if (!storedPokemons) {
    document.getElementById("output").innerHTML =
      "Ingen lagrede elementer i localStorage.";
  } else {
    document.querySelector(
      "#output"
    ).innerHTML = `Pokemon i localStorage: ${storedPokemons.join(", ")}`;
  }
}

// Slette pokemon, basert på key
function removeLocalStorage() {
  localStorage.removeItem("Pokemon key");
  document.querySelector("#output").innerHTML =
    "Pokemon er fjernet fra localStorage.";
}

function renderProfile() {
  if (likedPokomon.length > 5) {
    alert("Delete at least one Pokemonprofile from the list!");
  }
}
