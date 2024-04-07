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

let favouriteList = [];
let allPokemonDetails = [];
async function fetchAndDisplayPokemon() {
  const pokemonData = await fetchPokemonData(API_URL);
  const pokemonContainer = document.querySelector(".pokemonContainer");

  pokemonData.forEach(async (pokemon) => {
    const response = await fetch(pokemon.url);
    const pokemonDetails = await response.json();

    const card = document.createElement("div");
    card.classList.add("pokemon");

    const nameElement = document.createElement("p");
    nameElement.textContent = "Name: " + pokemonDetails.name;

    const typeElement = document.createElement("p");
    typeElement.textContent = "Type: " + pokemonDetails.types[0].type.name;

    const imageElement = document.createElement("img");
    imageElement.src = pokemonDetails.sprites.front_default;
    allPokemonDetails.push(pokemonDetails);
    //Liked
    const likedBtn = document.createElement("button");
    likedBtn.textContent = "👍🏼";
    likedBtn.addEventListener("click", async function () {
      if (favouriteList.length < 5) {
        favouriteList.push(pokemonDetails);
        localStorage.setItem("Pokemon key", JSON.stringify(favouriteList));
        displayFavouritePokemon();
      } else {
        alert(
          "Maximum limit of five favourite Pokemon is reached, Please delete one pokemon to save one new"
        );
      }

      favouriteList.forEach(async (pokemon) => {
        const favouritePokemon = document.createElement("favouritePokemons");
        favouritePokemon.innerHTML = `
        <p>Name: ${pokemon.name}</p>                                //Anvendt chatGpt her for å forkorte koden
        <p>Type: ${pokemon.type[0].type.name}<p>
        <img src"${pokemon.sprites.front_default}">
        `;
      });
    });

    function displayFavouritePokemon() {
      const favouritePokemonContainer = document.querySelector(
        ".favouritePokemonContainer"
      );
      favouritePokemonContainer.innerHTML = "";
    }
    favouriteList.forEach((pokemon) => {
      const favouritePokemonCard = document.createElement("div");
      favouritePokemonCard.classList.add("favouritePokemon");
      const nameElement = document.createElement("p");
      nameElement.textContent = "Name: " + pokemon.name;

      const typeElement = document.createElement("p");
      typeElement.textContent = "Type: " + pokemon.types[0].type.name;

      const imageElement = document.createElement("img");
      imageElement.src = pokemon.sprites.front_default;

      favouritePokemonCard.appendChild(nameElement);
      favouritePokemonCard.appendChild(typeElement);
      favouritePokemonCard.appendChild(imageElement);

      favouritePokemonContainer.appendChild(favouritePokemonCard);
    });

    //Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✍️";

    //Slette
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", function () {
      pokemonDetails(index);
    });
    card.appendChild(nameElement);
    card.appendChild(typeElement);
    card.appendChild(imageElement);
    card.appendChild(likedBtn);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);

    pokemonContainer.appendChild(card);
    //displayPokemon(allPokemonDetails, ".pokemonContainer");
  });
}
fetchAndDisplayPokemon();

// 1.2 Filtrering og styling:

async function filterAndDisplayPokemon(type) {
  // Instead of fetching new data, use the already stored allPokemonDetails for filtering
  const filteredPokemon = filterPokemonByType(allPokemonDetails, type);
  await displayPokemon(filteredPokemon, ".pokemonContainer");
}

// Event listeners for filter buttons
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-type");
      filterAndDisplayPokemon(type);
    });
  });
});

//Filtrerings funksjon basert på type
function filterPokemonByType(pokemonData, type) {
  if (type === "all") {
    return pokemonData;
  } else {
    return pokemonData.filter(
      (pokemon) =>
        pokemon.types && pokemon.types.some((t) => t.type.name === type)
    );
  }
}

async function displayPokemon(pokemonData, containerSelector) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = ""; // Clear existing content

  for (const pokemon of pokemonData) {
    // If pokemon already contains detailed information (like in filteredPokemon), skip fetching.
    const pokemonDetails = pokemon.url
      ? await fetch(pokemon.url).then((res) => res.json())
      : pokemon;

    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.style.backgroundColor = setTypeBackgroundColor(
      pokemonDetails.types[0].type.name
    );

    const nameElement = document.createElement("p");
    nameElement.textContent = `Name: ${pokemonDetails.name}`;

    const typeElement = document.createElement("p");
    typeElement.textContent = "Type: " + pokemonDetails.types[0].type.name;

    const imageElement = document.createElement("img");
    imageElement.src = pokemonDetails.sprites.front_default;
    imageElement.alt = `Image of ${pokemonDetails.name}`;

    //Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✍️";

    //Slette
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", function () {
      pokemonDetails(index);
    });
    card.appendChild(nameElement);
    card.appendChild(typeElement);
    card.appendChild(imageElement);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  }
}
function setTypeBackgroundColor(type) {
  const typeColorMap = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    normal: "#A8A878",
    bug: "#A8B820",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    ghost: "#705898",
    steel: "#B8B8D0",
    fighting: "#C03028",
    flying: "#A890F0",
    // Add more mappings as needed
  };

  // Default color if the type is not in the map
  const defaultColor = "#68A090";
  return typeColorMap[type.toLowerCase()] || defaultColor;
}

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

function renderPokemon() {
  console.log("render pokemon");
  favouriteList.map((p) => console.log(p));
}
