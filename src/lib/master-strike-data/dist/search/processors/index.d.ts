import { CardSetDef } from '../../definitions/cardTypes';
import { CardSearchResult } from '../cardSearchTypes';
export declare const processSet: (addCard: (card: CardSearchResult) => void, set: CardSetDef) => void;
export declare const setIdToLabel: (id: number) => any;
export declare const getSets: (setId: number, override?: number | number[]) => number[];
export { processRules } from './rulesProcessor';
