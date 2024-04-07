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
  });
}
fetchAndDisplayPokemon();

// 1.2 Filtrering og styling:

//Filtrerings funksjon basert på type
function filterPokemonByType(pokemonData, type) {
  if (type === "all") {
    return pokemonData;
  } else {
    return pokemonData.filter((pokemon) =>
      pokemon.types.some((t) => t.type.name === type)
    );
  }
}

// Funksjon for å legge til bakgrunnsfarge basert på type:
function setTypeBackgroundColor(pokemonType) {
  switch (pokemonType) {
    case "fire":
      return "red";
    case "water":
      return "blue";
    // Legge til flere typer
    default:
      return "gray"; // dersom fargen ikke matcher
  }
}

// Filtrere og vise pokemon basert på valgt type
async function filterAndDisplayPokeman(type) {
  const pokemonData = await fetchPokemonData(API_URL);
  const filteredPokemon = filterPokemonByType(pokemonData, type);
  displayPokemon(filteredPokemon);

  filteredPokemon.forEach((pokemon) => {
    const card = document.querySelector(`[data-name="${pokemon.name}"]`);
    card.style.backgroundColor = setTypeBackgroundColor(
      pokemon.types[0].type.name
    );
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.type; // Henter typen fra datasettet til knappen
    filterAndDisplayPokemon(type); // Kaller funksjonen for å filtrere og vise Pokémon basert på valgt type
  });
});

fetchAndDisplayPokemon();

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
