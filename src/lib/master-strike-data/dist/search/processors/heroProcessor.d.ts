import { CardSetDef, HeroDef, HeroCardDef } from "../../definitions/cardTypes";
import { CardDetailsType, HeroCardDetails, CardSearchResult } from "../cardSearchTypes";
export declare const toHeroCardDetails: (card: HeroCardDef, detailsType: CardDetailsType, groupTeam?: number) => HeroCardDetails;
export declare const processHero: (addCard: (card: CardSearchResult) => void, hero: HeroDef, set: CardSetDef) => void;
