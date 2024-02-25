import { EVTrackLine } from "./ev_track_line.js";
import { items, statLabels, stats } from "./data.js";

const __TOTAL_EV_LIMIT = 510;

const evObject = { current: 0, target: 0 };

export class Pokemon {
    static _id = 0;
    static _pkmns = {};
    static allAddEv = (stat, amount) => {
        for (const pokemon of Object.values(Pokemon._pkmns)) {
            pokemon.addEv(stat, amount);
        }
    }

    constructor(ui) {
        this.ui = ui;
        // Set initial values.
        this.effortValues = {};
        for (const stat of stats) {
            this.effortValues[stat] = {...evObject};
        }

        this.id = Pokemon._id++;
        Pokemon._pkmns[this.id] = this;
        this.name = "Jean-Luc Pikachu";
        this.selectedItem = false;
        this.currentMaxValue = 0;
        this.maxValueLimit = 510;

        // Creates the HTML element.
        this.element = {};
        this.element.section = document.createElement('section');
        this.element.section.id = `pokemon-${this.id}`;
        this.element.section.classList.add('pokemon');
        this.element.name = document.createElement('h5');
        this.element.name.classList.add('name');
        this.element.name.innerText = this.name;
        this.element.name.contentEditable = true;
        this.element.ul = document.createElement('ul');

        this.element.deleteButton = document.createElement('button');
        this.element.deleteButton.classList.add("btn-delete");
        this.element.deleteButton.innerText = "x";
        this.element.deleteButton.addEventListener('click', this.delete.bind(this));

        // Item selection part.
        const selectId = `item-select-${this.id}`;
        this.element.itemSelection = document.createElement('select');
        this.element.itemSelection.id = selectId;
        this.element.itemSelection.addEventListener('change', (ev) => {
            const { value } = ev.target;
            this.selectedItem = value || false;
        });
        const option = document.createElement('option');
        option.text = "None";
        option.value = '';
        this.element.itemSelection.appendChild(option);
        for (const [item, stat] of Object.entries(items)) {
            const option = document.createElement('option');
            option.text = `${item} (${statLabels[stat]})`;
            option.value = stat;
            this.element.itemSelection.appendChild(option);
        }
        const label = document.createElement('label');
        label.innerText = "Item:";
        label.htmlFor = selectId;
        this.element.item = document.createElement('div');
        this.element.item.classList.add('item');
        this.element.item.appendChild(label);
        this.element.item.appendChild(this.element.itemSelection);

        // EV parts.
        this.ev = {};
        for (let stat of stats) {
            this.ev[stat] = new EVTrackLine(this, stat);
            this.element.ul.appendChild(this.ev[stat].element.li);
        }

        this.element.header = document.createElement('div');
        this.element.header.classList.add('pokemon-header');
        this.element.header.appendChild(this.element.name);
        this.element.header.appendChild(this.element.item);
        this.element.header.appendChild(this.element.deleteButton);

        this.element.section.appendChild(this.element.header);
        this.element.section.appendChild(this.element.ul);

        document.querySelector('main').appendChild(this.element.section);
    }

    addEv(stat, amount) {
        const tracker = this.ev[stat];
        tracker.add(amount);
        if (this.selectedItem) {
            const bonusTracker = this.ev[this.selectedItem];
            bonusTracker.add(8);
        }
    }

    checkMaxValue(currentStat, amountType) {
        let remainingValue = 510;
        for (const stat of stats) {
            if (currentStat === stat) {
                continue;
            }
            remainingValue -= this.effortValues[stat][amountType];
        }
        return remainingValue;
    }

    delete() {
        this.element.section.remove();
        this.ui.updateDOM();
    }

    setTargetEV(stat, newValue) {
        this.effortValues[stat].target = newValue;
        if (this.reachMaxTarget) {
            for (const ev of Object.values(this.ev)) {
                ev.lockTarget();
            }
        } else {
            for (const ev of Object.values(this.ev)) {
                ev.unlockTarget();
            }
        }
    }

    get reachMaxTarget() {
        let total = 0;
        for (const stat of Object.values(this.effortValues)) {
            total += stat.target;
        }
        return total >= __TOTAL_EV_LIMIT;
    }
}
