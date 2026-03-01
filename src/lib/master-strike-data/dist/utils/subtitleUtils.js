export const heroSubtitle = (card, hero) => {
    return card.subtitle || hero.name;
};
export const mastermindSubtitle = (card, mm, setId) => {
    let type = [6, 8].includes(setId) ? "Commander" : "Mastermind";
    const mmName = mm.tacticName || mm.name;
    if (card.tactic) {
        type = `${type} Tactic - ${mmName}`;
    }
    ;
    const mmCard = card;
    if (mmCard.epic)
        return `Epic ${type}`;
    if (mmCard.transformed)
        return `${type}, Transformed`;
    return type;
};
export const henchmanSubtitle = (card, henchman, setId) => {
    if (henchman.subtitle)
        return henchman.subtitle;
    const cardSubtitle = card.subtitle;
    if (cardSubtitle)
        return cardSubtitle;
    if (setId === 6)
        return "Backup Adversary";
    return "Henchman Villain";
};
export const villainSubtitle = (card, villain, setId) => {
    if (villain.subtitle)
        return villain.subtitle;
    const cardSubtitle = card.subtitle;
    if (cardSubtitle)
        return cardSubtitle;
    const isAmbus = card.ambush;
    if (!!isAmbus) {
        return `Ambush Scheme - ${villain.name}`;
    }
    const subType = card.subType;
    if (subType === 1)
        return `Trap - ${villain.name}`;
    if (subType === 2)
        return `Location - ${villain.name}`;
    if (subType === 3)
        return `Villainous Weapon - ${villain.name}`;
    if ([6, 8].includes(setId))
        return `Adversary - ${villain.name}`;
    return `Villain - ${villain.name}`;
};
export const schemeSubtitle = (card, setId) => {
    if ([6, 8].includes(setId))
        return "Plot";
    const mmCard = card;
    if (mmCard && mmCard.overrideType === 2 && mmCard.transformed)
        return "Mastermind, Transformed";
    const schemeCard = card;
    if (schemeCard.transformed)
        return "Scheme, Transformed";
    if (schemeCard.veiled)
        return "Veiled Scheme";
    if (schemeCard.unveiled)
        return "Unveiled Scheme";
    return "Scheme";
};
export const bystanderSubtitle = (card) => {
    const cardSubtitle = card.subtitle;
    if (cardSubtitle)
        return cardSubtitle;
    return "Bystander";
};
export const woundSubtitle = (card) => {
    return card.subtitle ?? "Wound";
};
//# sourceMappingURL=subtitleUtils.js.map