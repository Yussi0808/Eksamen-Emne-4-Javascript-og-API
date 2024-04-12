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

function displayFavouritePokemon(favouriteList) {
  const favouritePokemonContainer = document.querySelector(
    ".favouritePokemonContainer"
  );
  favouritePokemonContainer.innerHTML = "";
  favouritePokemonContainer.classList.add("favouritePokemon");

  favouriteList.forEach((pokemon) => {
    const favouritePokemonCard = document.createElement("div");
    favouritePokemonCard.classList.add("favouritePokemon");
    const nameElement = document.createElement("p");
    nameElement.textContent = "Name: " + pokemon.name;

    const typeElement = document.createElement("p");
    typeElement.textContent = "Type: " + pokemon.types[0].type.name;

    const imageElement = document.createElement("img");
    imageElement.src = pokemon.sprites.front_default;

    //Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✍️";
    editFavouriteButtonEventListener(
      favouritePokemonCard,
      nameElement,
      typeElement,
      editBtn,
      pokemon
    );

    //Slette
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    removeFavouriteButtonEventListener(
      favouritePokemonCard,
      deleteBtn,
      pokemon
    );

    favouritePokemonCard.appendChild(nameElement);
    favouritePokemonCard.appendChild(typeElement);
    favouritePokemonCard.appendChild(imageElement);
    favouritePokemonCard.appendChild(editBtn);
    favouritePokemonCard.appendChild(deleteBtn);

    favouritePokemonContainer.appendChild(favouritePokemonCard);
  });
}
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

    //Legge til alle pokemons i en global liste
    allPokemonDetails.push(pokemonDetails);

    //Liked
    const likedBtn = document.createElement("button");
    likedBtn.textContent = "👍🏼";
    addFavouriteButtonEventListener(likedBtn, pokemonDetails);

    //Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✍️";
    editFavouriteButtonEventListener(
      card,
      nameElement,
      typeElement,
      editBtn,
      pokemonDetails
    );

    //Slette
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    removeFavouriteButtonEventListener(card, deleteBtn, pokemonDetails);

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

//Make your own pokemon
document.addEventListener("DOMContentLoaded", async () => {
  await fetchAndDisplayPokemon(); // Ensures Pokémon are fetched and displayed upon load.

  // Setup for filter buttons as you have it
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-type");
      filterAndDisplayPokemon(type);
    });
  });

  // New code to add a Pokémon starts here
  document.getElementById("addPokemonBtn").addEventListener("click", () => {
    const nameInput = document.getElementById("pokemonName");
    const typeInput = document.getElementById("pokemonType");

    const pokemonName = nameInput.value.trim();
    const pokemonType = typeInput.value.trim().toLowerCase();

    if (!pokemonName || !pokemonType) {
      alert("Please enter both a name and a type for the Pokémon.");
      return;
    }

    // Create a new Pokémon object
    const newPokemon = {
      name: pokemonName,
      types: [{ type: { name: pokemonType } }],
      sprites: {
        front_default: "./pics/poke1.png",
      }, // Placeholder image URL
    };

    allPokemonDetails.push(newPokemon);

    // Clear input fields
    nameInput.value = "";
    typeInput.value = "";

    // Display all Pokémon including the newly added one
    displayPokemon(allPokemonDetails, ".pokemonContainer");
  });
});

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

    const nameElement = document.createElement("p");
    nameElement.textContent = `Name: ${pokemonDetails.name}`;

    const typeElement = document.createElement("p");
    typeElement.textContent = "Type: " + pokemonDetails.types[0].type.name;

    const imageElement = document.createElement("img");
    imageElement.src = pokemonDetails.sprites.front_default;
    imageElement.alt = `Image of ${pokemonDetails.name}`;
    card.style.backgroundColor = setTypeBackgroundColor(
      pokemonDetails.types[0].type.name
    );

    //Liked
    const likedBtn = document.createElement("button");
    likedBtn.textContent = "👍🏼";
    addFavouriteButtonEventListener(likedBtn, pokemonDetails);

    //Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✍️";
    editFavouriteButtonEventListener(
      card,
      nameElement,
      typeElement,
      editBtn,
      pokemonDetails
    );

    //Slette
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", function () {
      pokemonDetails(index);
    });
    removeFavouriteButtonEventListener(card, deleteBtn, pokemonDetails);

    card.appendChild(nameElement);
    card.appendChild(typeElement);
    card.appendChild(imageElement);
    card.appendChild(likedBtn);
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
  const defaultColor = "black";
  return typeColorMap[type.toLowerCase()] || defaultColor;
}

// Del 1.4
// Legg til favouritt pokemon
function addFavouriteButtonEventListener(button, pokemonDetails) {
  button.addEventListener("click", async function () {
    if (favouriteList.length < 5) {
      favouriteList.push(pokemonDetails);
      localStorage.setItem(pokemonDetails.name, JSON.stringify(pokemonDetails));
      displayFavouritePokemon(favouriteList);
      alert(
        "Hurra! you added this pokemon to favourites and localStorage, check your favourite list"
      );
    } else {
      alert(
        "Maximum limit of five favourite Pokemon is reached, Please delete one pokemon to save one new"
      );
    }
  });
}

// Del 1.5
// Remove pokemon
function removeFavouriteButtonEventListener(card, event, pokemonDetails) {
  event.addEventListener("click", async function () {
    const confimation = confirm(
      "Are you sure you want to remove?, this will also remove from localStorage"
    );
    if (confimation === true) {
      favouriteList.splice(index, 1);
      card.textContent = pokemonDetails.name + " is removed from your pokemons";

      // const localStoragePokemons = JSON.parse(
      //   localStorage.getItem("Pokemon key")
      // );
      // const toBeDeletedPokemon = localStoragePokemons.find(
      //   (pokemon) => pokemon.name === pokemonDetails.name
      // ); // finne pokemon fra localstorage som er lik den som skal slettes , kansje kunne også bruke id men vi lagrer ikke id på egne definert pokemons

      localStorage.removeItem(pokemonDetails.name);
      document.querySelector("#output").innerHTML =
        "Pokemon er fjernet fra localStorage.";
    }
  });
}

// Del 1.6
// Edit favourite pokemon
function editFavouriteButtonEventListener(
  card,
  nameElement,
  typeElement,
  event,
  pokemonDetails
) {
  event.addEventListener("click", async function () {
    const property = prompt(
      "Please type the propery to update: Name or Type"
    ).trim(); // Fjerner mellomrom for å ikke kaste unødvendig feil, tar hensyn til feilhåndtering ved brukernivå
    let name = "";
    let type = "";
    if (property.toLocaleLowerCase() == "name") {
      name = prompt("Please write new name for your favoritePokemon").trim();
      nameElement.textContent = "Name: " + name;
      pokemonDetails.name = name ?? pokemonDetails.name;
      if (name !== pokemonDetails.name)
        localStorage.removeItem(pokemonDetails.name);
    } else if (property.toLocaleLowerCase() == "type") {
      type = prompt("Please write new type for your favoritePokemon");
      typeElement.textContent = "Type: " + type;
      if (type !== pokemonDetails.types[0].type.name)
        localStorage.removeItem(pokemonDetails.name);
      pokemonDetails.types[0].type.name =
        type ?? pokemonDetails.types[0].type.name;
      card.style.backgroundColor = setTypeBackgroundColor(
        pokemonDetails.types[0].type.name
      );
      card.style.color = "white";
    } else {
      // Her tar vi hensyn til feilhåndtering ved brukernivå.
      alert("The property is invalid, please write either name or type");
    }

    localStorage.setItem(pokemonDetails.name, JSON.stringify(pokemonDetails));
  });
}
