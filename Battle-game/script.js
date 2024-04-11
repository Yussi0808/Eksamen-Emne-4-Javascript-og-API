document.addEventListener("DOMContentLoaded", () => {
  const pokemonBox = document.querySelector(".pokemon-box");
  const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${
    Math.floor(Math.random() * 200) + 1
  }&limit=5`;

  const badPokemon = {
    name: ["Rompetroll", "Herkules", "Middagsfor", "Rarunderbitt"],
    type: ["stein", "jord", "vann", "elektrisk"],
    img: ["img/bad1.jpeg", "img/bad2.jpeg", "img/bad3.jpeg", "img/bad4.jpeg"],
    HP: [300, 250, 275, 285],
  };

  async function fetchPokemonData() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      for (let pokemon of data.results) {
        const pokemonDetailsResponse = await fetch(pokemon.url);
        const pokemonDetails = await pokemonDetailsResponse.json();

        const markup = `
                    <div class="pokemon-card">
                        <h2 class="pokemon-name">${pokemonDetails.name}</h2>
                        <img src="${
                          pokemonDetails.sprites.front_default
                        }" class="pokemon-img" alt="${pokemonDetails.name}" />
                        <h3 class="pokemon-type">${pokemonDetails.types
                          .map((type) => type.type.name)
                          .join(", ")}</h3>
                        <button class="pokemonbtn">Choose Pokémon</button>
                    </div>`;
        pokemonBox.insertAdjacentHTML("beforeend", markup);
      }
    } catch (error) {
      console.error("There was an error fetching the Pokémon data:", error);
    }
  }

  function addEventListeners() {
    pokemonBox.addEventListener("click", function (event) {
      if (!event.target.matches(".pokemonbtn")) return;

      const pokemonCard = event.target.closest(".pokemon-card");
      pokemonBox.innerHTML = ""; // Tømmer boksen
      pokemonBox.appendChild(pokemonCard);

      const randomIndex = Math.floor(Math.random() * badPokemon.name.length);
      const enemyMarkup = `
                <div class="pokemon-card" data-enemy-hp="${badPokemon.HP[randomIndex]}">
                    <h2 class="pokemon-name">${badPokemon.name[randomIndex]}</h2>
                    <img src="${badPokemon.img[randomIndex]}" class="pokemon-img" alt="" />
                    <h3 class="pokemon-type">${badPokemon.type[randomIndex]}</h3>
                    <p class="pokemon-hp">HP: ${badPokemon.HP[randomIndex]}</p>
                </div>`;
      pokemonBox.insertAdjacentHTML("beforeend", enemyMarkup);

      // Legg til en kamp-knapp
      const fightButton = document.createElement("button");
      fightButton.textContent = "Fight!";
      fightButton.onclick = startBattle;
      pokemonBox.appendChild(fightButton);
    });
  }

  function startBattle() {
    const enemyCard = document.querySelector(".pokemon-card[data-enemy-hp]");
    let enemyHP = parseInt(enemyCard.dataset.enemyHp);
    const playerAttack = Math.floor(Math.random() * 50) + 10; // Tilfeldig angrepstyrke for spilleren
    const enemyAttack = Math.floor(Math.random() * 50) + 10; // Tilfeldig angrepstyrke for fienden

    // Simulerer skade
    enemyHP -= playerAttack;
    if (enemyHP <= 0) {
      alert("You won!");
      // Resetter spillet eller gjør andre ting etter seieren
      return;
    }

    // Oppdaterer fiendens HP på UI
    enemyCard.dataset.enemyHp = enemyHP;
    enemyCard.querySelector(".pokemon-hp").textContent = `HP: ${enemyHP}`;

    alert(
      `You dealt ${playerAttack} damage. Enemy has ${enemyHP} HP left. Enemy attacks back for ${enemyAttack} damage!`
    );
    // Her kan du legge til logikk for at fienden angriper tilbake og skade på spillerens Pokémon
  }

  fetchPokemonData().then(addEventListeners);
});
