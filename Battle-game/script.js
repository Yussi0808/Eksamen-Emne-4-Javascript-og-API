const badPokemon = {
  name: ["Rompetroll", "herkules", "middagsfor", "rarunderbitt"],
  pokemons: ["bad1", "bad2", "bad3", "bad4"],
  type: ["stein", "jord", "vann", "electric"],
  HP: 300,
  skade: 35,
};

const pokemonBox = document.querySelector(".pokemon-Box");
const pokemonName = document.querySelector(".pokemon-name");
const pokemonType = document.querySelector(".pokemon-type");
const pokemonImg = document.querySelector(".pokemon-img");

// api fetch

const randomNum = Math.floor(Math.random() * 200) + 1;

const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${randomNum}&limit=5`;

// pokemon card
const pokemonCards = [];
const myFivedPokemon = [];

const fetchPokemonData = async function () {
  try {
    // pokemon Core API
    const response = await fetch(API_URL);
    const pokemonData = await response.json();
    const results = await pokemonData.results;

    pokemonCards.push(results);

    // pokemon Info
    const pokemons = results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonDetails = await pokemonResponse.json();

      console.log(pokemonDetails);

      const markup = `<div class="pokemon-card">
      <h2 class="pokemon-name">${pokemonDetails.name}</h2>
      <img src="${pokemonDetails.sprites.front_default}" class="pokemon-img" alt="" />
      <h3 class="pokemon-type">${pokemonDetails.types[0].type.name}</h3>
      <button class="pokemonbtn" >Choose pokemon</button>
    </div>`;

      pokemonBox.insertAdjacentHTML("afterbegin", markup);

      // velg knapper
      function fiveChoosenPokemon() {
        const pokemonBtn = document.querySelector(".pokemonbtn");

        myFivedPokemon.push(pokemonBtn);

        pokemonBtn.addEventListener("click", (e) => {
          // behold card
          const pokemonCard = e.target.parentNode;

          // hide pokemons cards box
          pokemonBox.innerHTML = "";

          // show chosen one
          pokemonBox.appendChild(pokemonCard);
          // vise side bilde og flytt til siden
          console.log(pokemonCard);
          document.querySelector(".pokemon-img").style = "scale: 1.5";

          // add vs bokstaver

          const vsText = ``;

          pokemonBox.insertAdjacentHTML("afterbegin", vsText);

          // add monster

          const randomNum = Math.floor(Math.random() * 4) + 1;

          const markup2 = `<div class="pokemon-card">
          <h2 class="pokemon-name">${badPokemon.name[randomNum]}</h2>
          <img src="img/bad${randomNum}.jpeg" class="pokemon-img" alt="" />
          <h3 class="pokemon-type">${badPokemon.type[randomNum]}</h3>
          <button class="pokemonbtn" >Choose pokemon</button>
        </div>`;

          pokemonBox.insertAdjacentHTML("afterbegin", markup2);
        });

        //render handler
      }

      fiveChoosenPokemon();
    });

    // add event handlers
  } catch (err) {}
};

// call data
fetchPokemonData();
