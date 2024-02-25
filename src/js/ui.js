import { stats, statLabels } from "./data.js";
import { Pokemon } from "./pokemon.js";

export class UI {
    constructor() {
        this.sounds = {
            add: new Audio("/src/sounds/add.wav"),
            button: new Audio("/src/sounds/button.wav"),
        };
        // Adds EV buttons.
        const evSelector = document.getElementById('ev-selector');
        for (const stat of stats) {
            const label = document.createElement('div');
            label.classList.add('label');
            label.innerText = statLabels[stat];
            const li = document.createElement('li');
            li.appendChild(label);

            for (let i = 1; i <= 3; i++) {
                const button = document.createElement('button');
                button.innerText = `+${i}`;
                button.addEventListener('click', (ev) => {
                    this.sounds.button.pause();
                    this.sounds.button.currentTime = 0;
                    this.sounds.button.play();
                    Pokemon.allAddEv(stat, i);
                })
                li.appendChild(button);
            }
            evSelector.appendChild(li);
        }

        // Adds Pokémon buttons.
        this.btnAddPokemon = document.getElementById('add-pokemon');
        this.btnAddPokemon.addEventListener('click', () => {
            this.sounds.add.pause();
            this.sounds.add.currentTime = 0;
            this.sounds.add.play();
            new Pokemon(this);
            this.updateDOM();
        });
    }

    updateDOM() {
        const pokemons = document.querySelectorAll('section.pokemon');
        if (pokemons.length >= 6) {
            this.btnAddPokemon.disabled = true;
        } else {
            this.btnAddPokemon.disabled = false;
        }
    }
}
