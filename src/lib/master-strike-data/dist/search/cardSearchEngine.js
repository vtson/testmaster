import { Document } from "flexsearch";
import { SetDefinitions } from "../definitions";
import { processSet } from "./processors";
const OPTIONS = {
    preset: 'match',
    charset: 'latin:default',
    tokenize: "strict",
    matcher: {
        '-': '',
        'é': 'e',
        '\'': '',
        '\\.': '',
    },
    document: {
        id: 'id',
        index: [
            {
                field: 'strict',
                matcher: 'simple',
                context: true,
            },
            {
                field: 'full',
                tokenize: 'full',
            },
        ],
    },
};
const CACHE = [];
/**
 * Card search engine.
 */
export class CardSearchEngine {
    engine;
    cardCount;
    startupDuration;
    limit;
    subtitle;
    type;
    set;
    group;
    byCardType;
    /**
     * @param opts Options of the card search engine.
     */
    constructor(opts) {
        const startTime = Date.now();
        this.limit = opts?.limit && opts.limit > 0 ? opts.limit : 10;
        this.engine = new Document(OPTIONS);
        this.subtitle = opts?.subtitle || true;
        this.type = opts?.type || false;
        this.set = opts?.set || false;
        this.group = opts?.group || false;
        this.byCardType = {};
        this.cardCount = 0;
        const addCard = (card) => {
            CACHE.push(card);
            let entry = card.name;
            if (this.subtitle)
                entry += ` <|> ${card.subtitle}`;
            if (this.type)
                entry += ` <|> ${card.type}`;
            if (this.set)
                entry += ` <|> ${card.set}`;
            if (this.group)
                entry += ` <|> ${card.group}`;
            this.engine.add(this.cardCount, {
                id: this.cardCount,
                strict: entry,
                full: entry,
            });
            // browser
            const bySet = this.byCardType[card.type];
            let safeBySet = {};
            if (bySet) {
                safeBySet = bySet;
            }
            else {
                this.byCardType[card.type] = safeBySet;
            }
            if (!safeBySet[card.set])
                safeBySet[card.set] = {};
            const byGroup = safeBySet[card.set];
            if (!byGroup[card.group])
                byGroup[card.group] = [];
            byGroup[card.group].push(card);
            // browser
            this.cardCount++;
        };
        Object.values(SetDefinitions).forEach(set => processSet(addCard, set));
        // sort the set entries and group entries
        Object.keys(this.byCardType).forEach(type => {
            const cardType = type;
            const byset = this.byCardType[cardType];
            this.byCardType[cardType] = Object.keys(byset).sort().reduce((sortedBySet, key) => {
                sortedBySet[key] = byset[key];
                return sortedBySet;
            }, {});
            Object.keys(byset).forEach(set => {
                const byGroup = byset[set];
                this.byCardType[cardType][set] = Object.keys(byGroup).sort().reduce((sortedByGroup, key) => {
                    sortedByGroup[key] = byGroup[key];
                    return sortedByGroup;
                }, {});
            });
        });
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
        const queryResult = await this.engine.searchAsync({
            query: query,
            limit: this.limit,
            suggest: true,
        });
        const getFieldResults = (field) => queryResult.find(r => r.field === field)?.result || [];
        const appendIds = (newIds, ids) => {
            newIds.forEach(id => {
                if (!ids.includes(id)) {
                    ids.push(id);
                }
            });
        };
        const resultIds = [];
        appendIds(getFieldResults('strict'), resultIds);
        appendIds(getFieldResults('full'), resultIds);
        return resultIds.filter((r, idx) => idx < this.limit).map(id => CACHE[id]);
    }
    /**
     * @returns The total ammount of cards in the search engine.
     */
    getCardCount() {
        return this.cardCount;
    }
    /**
     * @returns The startup duration in millis.
     */
    getStartupDuration() {
        return this.startupDuration;
    }
    /**
     * @returns An array with all cards indexed.
     */
    getAllCards() {
        return Object.freeze(CACHE);
    }
    /**
     * @returns The card browser (By Card type) -> (By Set) -> (By Group).
     */
    getBrowser() {
        return this.byCardType;
    }
}
//# sourceMappingURL=cardSearchEngine.js.map