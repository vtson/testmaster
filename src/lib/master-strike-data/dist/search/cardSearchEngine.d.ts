import { ByCardType, CardSearchResult, SearchEngineOptions } from "./cardSearchTypes";
/**
 * Card search engine.
 */
export declare class CardSearchEngine {
    private engine;
    private cardCount;
    private startupDuration;
    private limit;
    private subtitle;
    private type;
    private set;
    private group;
    private byCardType;
    /**
     * @param opts Options of the card search engine.
     */
    constructor(opts?: SearchEngineOptions);
    /**
     * Makes a search.
     * @param query The query string to search.
     * @returns A promise with the results of the search.
     */
    search(query: string): Promise<CardSearchResult[]>;
    /**
     * @returns The total ammount of cards in the search engine.
     */
    getCardCount(): number;
    /**
     * @returns The startup duration in millis.
     */
    getStartupDuration(): number;
    /**
     * @returns An array with all cards indexed.
     */
    getAllCards(): readonly CardSearchResult[];
    /**
     * @returns The card browser (By Card type) -> (By Set) -> (By Group).
     */
    getBrowser(): ByCardType;
}
