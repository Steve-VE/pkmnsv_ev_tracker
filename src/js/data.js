const stats = [
    'attack',
    'defense',
    'special-attack',
    'special-defense',
    'hp',
    'speed',
];

const statLabels = {
    attack: "Atk",
    defense: "Def",
    hp: "HP",
    'special-attack': "SpAtk",
    'special-defense': "SpDef",
    speed: "Speed",
};

const items = {
    'Power Weight': 'hp',
    'Power Bracer': 'attack',
    'Power Belt': 'defense',
    'Power Lens': 'special-attack',
    'Power Band': 'special-defense',
    'Power Anklet': 'speed',
};

export {
    items,
    stats,
    statLabels,
};
