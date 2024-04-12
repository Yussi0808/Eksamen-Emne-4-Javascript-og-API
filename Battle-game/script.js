document.addEventListener("DOMContentLoaded", () => {
  const pokemonBox = document.querySelector(".pokemon-box");
  const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${
    Math.floor(Math.random() * 200) + 1
  }&limit=5`;

  const badPokemon = [];

  async function fetchPokemonData() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      for (let pokemon of data.results) {
        const pokemonDetailsResponse = await fetch(pokemon.url);
        const pokemonDetails = await pokemonDetailsResponse.json();

        const markup = `
                    <div class="pokemon-card" data-my-hp="${
                      pokemonDetails.stats[0].base_stat
                    }">
                        <h2 class="pokemon-name">${pokemonDetails.name}</h2>
                        <img src="${
                          pokemonDetails.sprites.front_default
                        }" class="pokemon-img" alt="${pokemonDetails.name}" />
                        <h3 class="pokemon-type">${pokemonDetails.types
                          .map((type) => type.type.name)
                          .join(", ")}</h3>
                           <p class="my-hp">HP: ${
                             pokemonDetails.stats[0].base_stat
                           }</p>
                        <button class="pokemonbtn">Choose Pokémon</button>
                    </div>`;
        pokemonBox.insertAdjacentHTML("beforeend", markup);
      }
    } catch (error) {
      console.error("There was an error fetching the Pokémon data:", error);
    }
  }

  async function addEventListeners() {
    const response = await fetch(API_URL);
    const data = await response.json();
    pokemonBox.addEventListener("click", async function (event) {
      if (!event.target.matches(".pokemonbtn")) return;

      const pokemonCard = event.target.closest(".pokemon-card");
      pokemonBox.innerHTML = ""; // Tømmer boksen
      pokemonBox.appendChild(pokemonCard);

      for (let pokemon of data.results) {
        const pokemonDetailsResponse = await fetch(pokemon.url);
        const pokemonDetails = await pokemonDetailsResponse.json();
        badPokemon.push(pokemonDetails);
      }
      const randomIndex = Math.floor(Math.random() * badPokemon.length);
      const randomPokemon = badPokemon[randomIndex];

      const enemyMarkup = `
                <div class="pokemon-card" data-enemy-hp="${randomPokemon.stats[0].base_stat}">   
                    <h2 class="pokemon-name">${randomPokemon.name}</h2>
                    <img src="${randomPokemon.sprites.front_default}" class="pokemon-img" alt="" />
                    <h3 class="pokemon-type">${randomPokemon.types[0].type.name}</h3>
                    <p class="pokemon-hp">HP: ${randomPokemon.stats[0].base_stat}</p>
                </div>`; // data-enemy-hp

      pokemonBox.insertAdjacentHTML("beforeend", enemyMarkup); //

      // Legg til en kamp-knapp
      const fightButton = document.createElement("button");
      fightButton.textContent = "Fight!";
      fightButton.onclick = startBattle;

      pokemonBox.appendChild(fightButton);
    });
  }

  function startBattle() {
    const enemyCard = document.querySelector(".pokemon-card[data-enemy-hp]");
    const myCard = document.querySelector(".pokemon-card[data-my-hp]");
    let enemyHP = parseInt(enemyCard.dataset.enemyHp); // dataset
    let myHP = parseInt(myCard.dataset.myHp);
    const playerAttack = Math.floor(Math.random() * 5) + 10; // Tilfeldig angrepstyrke for spilleren
    const enemyAttack = Math.floor(Math.random() * 5) + 10; // Tilfeldig angrepstyrke for fienden

    // Simulerer skade
    enemyHP -= playerAttack;
    myHP -= enemyAttack;

    if (enemyHP <= 0) {
      enemyHP = 0;
      alert("You won!");
      // Resetter spillet eller gjør andre ting etter seieren
      return;
    }

    if (myHP <= 0) {
      myHP = 0;
      alert("You Lose! try again");
      // Resetter spillet eller gjør andre ting etter seieren
      return;
    }
    // Oppdaterer fiendens HP på UI
    enemyCard.dataset.enemyHp = enemyHP;
    myCard.dataset.myHp = myHP;
    enemyCard.querySelector(".pokemon-hp").textContent = `HP: ${enemyHP}`;
    myCard.querySelector(".my-hp").textContent = `HP: ${myHP}`;

    alert(
      `You dealt ${playerAttack} damage. Enemy has ${enemyHP} HP left. Enemy attacks back for ${enemyAttack} damage! You have ${myHP} HP left.`
    );
    // Her kan du legge til logikk for at fienden angriper tilbake og skade på spillerens Pokémon
  }

  fetchPokemonData().then(addEventListeners);
});
