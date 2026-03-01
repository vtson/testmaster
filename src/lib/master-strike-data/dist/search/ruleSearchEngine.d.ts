import { RuleSearchResult } from './ruleSearchTypes';
export declare const CACHE: RuleSearchResult[];
/**
 * Search engine for rules. Has a default query limit of 10.
 */
export declare class RuleSearchEngine {
    private engine;
    private rulesCount;
    private startupDuration;
    constructor();
    /**
     * Makes a search.
     * @param query The query string to search.
     * @returns A promise with the results of the search.
     */
    search(query: string): Promise<RuleSearchResult[]>;
    /**
     * @returns The total ammount of rules in the search engine.
     */
    getRulesCount(): number;
    /**
     * @returns The startup duration in millis.
     */
    getStartupDuration(): number;
    /**
     * @returns An array with all rules indexed.
     */
    getAllRules(): readonly RuleSearchResult[];
}
