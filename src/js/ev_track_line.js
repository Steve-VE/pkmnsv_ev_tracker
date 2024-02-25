import { stats, statLabels } from "./data.js";

const __EV_LIMIT = 252;

export class EVTrackLine {
    constructor(pokemon, stat) {
        if (!stats.includes(stat)) {
            throw Error(`"${stat}" is not supported stat`);
        }

        this.pokemon = pokemon;
        this.active = true;
        this.values = { current: 0, target: 0 };
        this.stat = stat;

        // Create the HTML elements.
        this.element = {};
        this.element.label = document.createElement('span');
        this.element.label.classList.add('label');
        this.element.label.innerText = `${statLabels[stat]}:`;
        this.element.inputMin = document.createElement('input');
        this.element.inputMin.classList.add('ev-input', 'current-amount');
        this.element.inputMin.type = 'number';
        this.element.inputMin.value = 0;
        this.element.inputMin.min = 0;
        this.element.inputMin.max = __EV_LIMIT;
        this.element.inputMax = document.createElement('input');
        this.element.inputMax.classList.add('ev-input', 'target-amount');
        this.element.inputMax.type = 'number';
        this.element.inputMax.value = this.values.target;
        this.element.inputMax.min = 0;
        this.element.inputMax.max = __EV_LIMIT;
        this.element.bar = document.createElement('div');
        this.element.bar.classList.add("bar");
        this.element.barProgress = document.createElement('div');
        this.element.barProgress.classList.add("bar-progress");
        this.element.barTarget = document.createElement('div');
        this.element.barTarget.classList.add("bar-target");
        this.element.bar.appendChild(this.element.barProgress);
        this.element.bar.appendChild(this.element.barTarget);
        this.element.li = document.createElement('li');
        this.element.li.classList.add('ev-track-line', stat);
        this.element.li.appendChild(this.element.label);
        this.element.li.appendChild(this.element.inputMin);
        this.element.li.appendChild(this.element.bar);
        this.element.li.appendChild(this.element.inputMax);

        this.element.inputMin.addEventListener('change', (ev) => {
            constraintInputValue(ev);
            const input = ev.target;
            this.currentValue = Number(input.value);
        });
        this.element.inputMax.addEventListener('change', (ev) => {
            constraintInputValue(ev);
            const input = ev.target;
            this.targetValue = Number(input.value);
        });
        this.element.inputMax.addEventListener('dblclick', () => {
            const value = this.targetValue === __EV_LIMIT ? 0 : __EV_LIMIT;
            this.targetValue = value;
        })
        const changeEvent = new Event('change');
        this.element.inputMin.dispatchEvent(changeEvent);
        this.element.inputMax.dispatchEvent(changeEvent);
    }

    add(amount) {
        this.currentValue = this.currentValue + amount;
    }

    lockTarget() {
        if (!this.values.target) {
            this.element.inputMax.disabled = true;
        }
    }

    unlockTarget() {
        this.element.inputMax.disabled = false;
    }

    updateProgressBar() {
        const percent = Math.round(this.currentValue / __EV_LIMIT * 100);
        this.element.barProgress.style.width = `${percent}%`;
        this.updateProgressBarColor();
    }

    updateProgressBarColor() {
        const { current, target } = this.values;
        if (current === target) {
            this.element.barProgress.classList.add('good');
            this.element.barProgress.classList.remove('excess');
        } else if (current > target) {
            this.element.barProgress.classList.add('excess');
            this.element.barProgress.classList.remove('good');
        } else {
            this.element.barProgress.classList.remove('excess', 'good');
        }
    }

    updateTrackLine() {
        const percent = Math.round(this.values.target / __EV_LIMIT * 100);
        this.element.barTarget.style.left = `${percent}%`;
        this.updateProgressBarColor();
    }

    set currentValue(newValue) {
        newValue = Math.min(
            newValue,
            this.pokemon.checkMaxValue(this.stat, 'current'));
        if (newValue !== this.values.current) {
            this.values.current = newValue;
            this.pokemon.effortValues[this.stat].current = newValue;
            this.updateProgressBar();
        }
        const elValue = Number(this.element.inputMin.value);
        if (this.values.current !== elValue) {
            this.element.inputMin.value = this.values.current;
            const changeEvent = new Event('change');
            this.element.inputMin.dispatchEvent(changeEvent);
        }
    }
    get currentValue() {
        return this.values.current;
    }

    set targetValue(newValue) {
        newValue = Math.min(
            newValue,
            this.pokemon.checkMaxValue(this.stat, 'target'));
        if (newValue !== this.values.target) {
            this.values.target = newValue;
            this.pokemon.setTargetEV(this.stat, newValue);
            this.updateTrackLine();
        }
        const elValue = Number(this.element.inputMax.value);
        if (this.values.target !== elValue) {
            this.element.inputMax.value = this.values.target;
            const changeEvent = new Event('change');
            this.element.inputMax.dispatchEvent(changeEvent);
        }
    }
    get targetValue() {
        return this.values.target;
    }
}

const constraintInputValue = (ev) => {
    const input = ev.target;
    const min = Number(input.min);
    const max = Number(input.max);
    let value = Number(input.value);
    if (value < min) {
        value = min;
    } else if (value > max) {
        value = Math.min(max);
    }
    input.value = value;
}
