/**
 * Enum of all possible card types.
 */
export var CardType;
(function (CardType) {
    CardType["Hero"] = "Hero";
    CardType["Mastermind"] = "Mastermind";
    CardType["MastermindTactic"] = "Mastermind Tactic";
    CardType["Villain"] = "Villain";
    CardType["Henchmen"] = "Henchmen";
    CardType["Scheme"] = "Scheme";
    CardType["Bystander"] = "Bystander";
    CardType["Sidekick"] = "Sidekick";
    CardType["Officer"] = "Officer";
    CardType["Wound"] = "Wound";
    CardType["General"] = "General";
    CardType["Ambition"] = "Ambition";
    CardType["Horror"] = "Horror";
    CardType["Token"] = "Token";
})(CardType || (CardType = {}));
/**
 * Enum that identifies the type of description of a card. Usefull to undertant which type of card it is.
 */
export var CardDetailsType;
(function (CardDetailsType) {
    /**
     * Details of a hero card.
     */
    CardDetailsType["HeroCardDetails"] = "HeroCardDetails";
    /**
     * Details of a hero divided hero card.
     */
    CardDetailsType["DividedHeroCardDetails"] = "DividedHeroCardDetails";
    /**
     * Details of a mastermind card.
     */
    CardDetailsType["MastermindCardDetails"] = "MastermindCardDetails";
    /**
     * Details of a villain card.
     */
    CardDetailsType["VillainCardDetails"] = "VillainCardDetails";
    /**
     * Details of a henchman card.
     */
    CardDetailsType["HenchmanCardDetails"] = "HenchmanCardDetails";
    /**
     * Details of a scheme card.
     */
    CardDetailsType["SchemeCardDetail"] = "SchemeCardDetail";
    /**
     * Details of a bystander card.
     */
    CardDetailsType["BystanderCardDetail"] = "BystanderCardDetail";
    /**
     * Details of a wound card.
     */
    CardDetailsType["WoundCardDetail"] = "WoundCardDetail";
    /**
     * Details of an out of place hero card (a villain, mastermind tactic, henchman, ... that can be earned as a hero).
     */
    CardDetailsType["OopHeroDetails"] = "OopHeroDetails";
    /**
     * Details of an out of place villain card (a mastermind tactic that can be become a villain).
     */
    CardDetailsType["OopVillainDetails"] = "OopVillainDetails";
    /**
     * Details of an out of place mastermind card (Chthon!).
     */
    CardDetailsType["OopMastermindDetails"] = "OopMastermindDetails";
    /**
     * Details of an out of place scheme card.
     */
    CardDetailsType["OopSchemeDetails"] = "OopSchemeDetails";
})(CardDetailsType || (CardDetailsType = {}));
//# sourceMappingURL=cardSearchTypes.js.map