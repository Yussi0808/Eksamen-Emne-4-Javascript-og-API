const pokemonBox = document.querySelector(".pokemon-Box");
const pokemonName = document.querySelector(".pokemon-name");
const pokemonType = document.querySelector(".pokemon-type");
const pokemonImg = document.querySelector(".pokemon-img");

// fetche api

const randomNum = Math.floor(Math.random() * 200) + 1;

console.log(randomNum);

const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${randomNum}&limit=5`;

// pokemon card

async function fetchPokemonData() {
  try {
    // pokemon Core API
    const response = await fetch(API_URL);
    const pokemonData = await response.json();
    const results = await pokemonData.results;

    console.log(results);

    let btns;

    // pokemon Info
    const pokemons = results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonDetails = await pokemonResponse.json();

      const markup = `<div class="pokemon-card">
     <h2 class="pokemon-name">${pokemonDetails.name}</h2>
     <img src="${pokemonDetails.sprites.front_default}" class="pokemon-img" alt="" />
     <h3 class="pokemon-type">${pokemonDetails.types[0].type.name}</h3>
     <button class="pokemonbtn" >Choose pokemon</button>
   </div>`;

      pokemonBox.insertAdjacentHTML("afterbegin", markup);
    });
    // add event handlers
  } catch (err) {}
}
fetchPokemonData();
