import { CardSetDef, VillainDef, VillainCardDef } from "../../definitions/cardTypes";
import { CardDetailsType, CardSearchResult, VillainCardDetails } from "../cardSearchTypes";
export declare const toVillainCardDetails: (card: VillainCardDef, detailsType: CardDetailsType) => VillainCardDetails;
export declare const processVillain: (addCard: (card: CardSearchResult) => void, villain: VillainDef, set: CardSetDef) => void;
