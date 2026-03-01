import { CardSetDef, SchemeDef, SchemeCardDef } from "../../definitions/cardTypes";
import { CardDetailsType, SchemeCardDetails, CardSearchResult } from "../cardSearchTypes";
export declare const toSchemeCardDetails: (card: SchemeCardDef, detailsType: CardDetailsType) => SchemeCardDetails;
export declare const processScheme: (addCard: (card: CardSearchResult) => void, scheme: SchemeDef, set: CardSetDef) => void;
