import { BystanderCardDef, HenchmanCardDef, HenchmanDef, HeroCardDef, HeroDef, MastermindCardDef, MastermindDef, OopHeroCardDef, OopMastermindCardDef, OopSchemeCardDef, OopVillainCardDef, SchemeCardDef, VillainCardDef, VillainDef, WoundCardDef } from "../definitions";
export declare const heroSubtitle: (card: HeroCardDef, hero: HeroDef) => any;
export declare const mastermindSubtitle: (card: MastermindCardDef | OopHeroCardDef | OopVillainCardDef, mm: MastermindDef, setId: number) => string;
export declare const henchmanSubtitle: (card: HenchmanCardDef | OopHeroCardDef, henchman: HenchmanDef, setId: number) => any;
export declare const villainSubtitle: (card: VillainCardDef | OopHeroCardDef | OopSchemeCardDef, villain: VillainDef, setId: number) => any;
export declare const schemeSubtitle: (card: SchemeCardDef | OopMastermindCardDef, setId: number) => "Unveiled Scheme" | "Mastermind, Transformed" | "Scheme" | "Plot" | "Scheme, Transformed" | "Veiled Scheme";
export declare const bystanderSubtitle: (card: BystanderCardDef | OopHeroCardDef) => any;
export declare const woundSubtitle: (card: WoundCardDef) => any;
