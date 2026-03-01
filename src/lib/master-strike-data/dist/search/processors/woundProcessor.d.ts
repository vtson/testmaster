import { CardSetDef, WoundDef } from "../../definitions/cardTypes";
import { CardSearchResult } from "../cardSearchTypes";
export declare const processWound: (addCard: (card: CardSearchResult) => void, wound: WoundDef, set: CardSetDef) => void;
