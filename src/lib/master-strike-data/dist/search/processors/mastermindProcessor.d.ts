import { CardSetDef, MastermindDef, MastermindCardDef } from "../../definitions/cardTypes";
import { CardDetailsType, MastermindCardDetails, CardSearchResult } from "../cardSearchTypes";
export declare const toMastermindCardDetails: (card: MastermindCardDef, detailsType: CardDetailsType, mm?: MastermindDef) => MastermindCardDetails;
export declare const processMastermind: (addCard: (card: CardSearchResult) => void, mm: MastermindDef, set: CardSetDef) => void;
