import type { CardSearchResult } from '@master-strike/data'
import * as MSData from "@master-strike/data"

const { CardSearchEngine, Metadata } = MSData
export type { CardSearchResult as Card }

const searchEngine = new CardSearchEngine()
const browser = searchEngine.getBrowser()
console.log(Metadata)
const allCards: readonly CardSearchResult[] = searchEngine.getAllCards()

export function getAllCards(): readonly CardSearchResult[] {
    return allCards
}

export function getCategories(): string[] {
    return Object.keys(browser).sort()
}

/**
 * Returns filter preset items for the selected types.
 * For types where groups are unique (Hero → Brainstorm, FF United, etc.), returns group names.
 * For types where all groups share the same name (Bystander), returns individual card names instead.
 */
export function getGroups(filterTypes?: string[]): string[] {
    if (!filterTypes || filterTypes.length === 0) return []

    const result: Set<string> = new Set()

    for (const type of filterTypes) {

        const bySet = browser[type as keyof typeof browser]
        if (!bySet) continue

        // Collect all unique group names for this type
        const groupNames: Set<string> = new Set()
        for (const set of Object.keys(bySet)) {
            const byGroup = bySet[set]
            if (!byGroup) continue
            for (const group of Object.keys(byGroup)) {
                groupNames.add(group)
            }
        }

        // If all groups have the same name (e.g. Bystander → all "Bystanders"),
        // use individual card names instead since groups are not meaningful
        if (groupNames.size <= 1) {
            for (const set of Object.keys(bySet)) {
                const byGroup = bySet[set]
                if (!byGroup) continue
                for (const group of Object.keys(byGroup)) {
                    const cards = byGroup[group]
                    if (!cards) continue
                    for (const card of cards) {
                        result.add(card.name)
                    }
                }
            }
        } else {
            for (const g of groupNames) {
                result.add(g)
            }
        }
    }
    return [...result].sort()
}

/**
 * Extract plain text from a card's Description for search purposes.
 * Handles strings, bold, italic, keyword text, and rule text pieces.
 */
function getDescriptionText(description: any): string {
    if (!description) return ''
    if (typeof description === 'string') return description
    if (Array.isArray(description)) {
        return description.map(getDescriptionText).join(' ')
    }
    if (typeof description === 'object') {
        if ('bold' in description) return description.bold
        if ('italic' in description) return description.italic
        if ('text' in description) return description.text
        if ('points' in description) return getDescriptionText(description.points)
    }
    return ''
}

export function filterCards(options: {
    search?: string
    types?: string[]
    groups?: string[]
    sortAsc?: boolean
}): CardSearchResult[] {
    let cards = [...allCards] as CardSearchResult[]

    if (options.types && options.types.length > 0) {
        cards = cards.filter((c) => options.types!.includes(c.type))
    }

    if (options.groups && options.groups.length > 0) {
        // Filter by group name OR card name (to handle Bystander-like cases)
        cards = cards.filter((c) =>
            options.groups!.includes(c.group) || options.groups!.includes(c.name)
        )
    }

    if (options.search && options.search.trim()) {
        const q = options.search.trim().toLowerCase()
        cards = cards.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.subtitle.toLowerCase().includes(q) ||
                c.group.toLowerCase().includes(q) ||
                getDescriptionText(c.details?.description).toLowerCase().includes(q)
        )
    }

    cards.sort((a, b) => {
        const cmp = a.name.localeCompare(b.name)
        return options.sortAsc !== false ? cmp : -cmp
    })

    return cards
}

export async function searchCards(query: string) {
    return searchEngine.search(query)
}
