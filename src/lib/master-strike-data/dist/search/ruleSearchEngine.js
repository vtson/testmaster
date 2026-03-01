import { Document } from 'flexsearch';
import { processRules } from './processors';
export const CACHE = [];
const startRuleEngine = (engine) => {
    let rulesAdded = 0;
    processRules((rule) => {
        engine.add(rulesAdded, rule);
        CACHE.push(rule);
        rulesAdded++;
    });
    return rulesAdded;
};
/**
 * Search engine for rules. Has a default query limit of 10.
 */
export class RuleSearchEngine {
    engine;
    rulesCount;
    startupDuration;
    constructor() {
        const startTime = Date.now();
        this.engine = new Document({
            preset: 'match',
            tokenize: 'full',
            charset: 'latin:default',
            matcher: {
                '-': '',
                'é': 'e',
                '\'': '',
                '\\.': '',
            },
            document: {
                id: 'id',
                index: ['name'],
                store: true,
            },
        });
        this.rulesCount = startRuleEngine(this.engine);
        this.startupDuration = Date.now() - startTime;
    }
    /**
     * Makes a search.
     * @param query The query string to search.
     * @returns A promise with the results of the search.
     */
    async search(query) {
        query = (query || '').trim();
        if (!query)
            return [];
        const result = await this.engine.searchAsync(query, {
            limit: 10,
            enrich: true,
        });
        return (result.length ? result[0].result : []).map(r => r.doc);
    }
    /**
     * @returns The total ammount of rules in the search engine.
     */
    getRulesCount() {
        return this.rulesCount;
    }
    /**
     * @returns The startup duration in millis.
     */
    getStartupDuration() {
        return this.startupDuration;
    }
    /**
     * @returns An array with all rules indexed.
     */
    getAllRules() {
        return Object.freeze(CACHE);
    }
}
//# sourceMappingURL=ruleSearchEngine.js.map