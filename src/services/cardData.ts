import type { CardSearchResult } from '@/lib/master-strike-data/dist'
import * as MSData from "@/lib/master-strike-data/dist"
import { getIconUrl } from './iconMap'

const { CardSearchEngine, Metadata } = MSData
export type { CardSearchResult as Card }

const searchEngine = new CardSearchEngine()
const browser = searchEngine.getBrowser()
const allCards: readonly CardSearchResult[] = searchEngine.getAllCards()

// Build team ID → label lookup from metadata
const teamLookup: Map<number, string> = new Map()
for (const t of Metadata.teamsArray) {
    teamLookup.set(t.id, t.label)
}

// Build set label → icon lookup from metadata
const setIconLookup: Map<string, string | undefined> = new Map()
for (const s of Metadata.setsArray) {
    setIconLookup.set(s.label, getIconUrl(s.value))
}

export function getAllCards(): readonly CardSearchResult[] {
    return allCards
}

export function getCategories(): string[] {
    return Object.keys(browser).sort()
}

/**
 * Returns all unique sets from card data with label and icon, sorted alphabetically.
 */
export function getSets(): { label: string; icon?: string }[] {
    const result = new Set<string>()
    for (const card of allCards) {
        if (card.set) result.add(card.set)
    }
    return [...result].sort().map(label => ({
        label,
        icon: setIconLookup.get(label),
    }))
}

/**
 * Returns team options as {id, label, icon} for filtering (excludes Unaffiliated).
 */
export function getTeams(): { id: number; label: string; icon?: string }[] {
    return Metadata.teamsArray
        .filter(t => t.id !== 0)
        .map(t => ({ id: t.id, label: t.label, icon: getIconUrl(t.value) }))
}

/**
 * Get the icon URL for a set label.
 */
export function getSetIcon(label: string): string | undefined {
    return setIconLookup.get(label)
}

/**
 * Look up a team label by its numeric ID.
 */
export function getTeamLabel(id: number): string {
    return teamLookup.get(id) ?? 'Unaffiliated'
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
    sets?: string[]
    teams?: number[]
    sortAsc?: boolean
    sortByGroup?: boolean
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

    if (options.sets && options.sets.length > 0) {
        cards = cards.filter((c) => options.sets!.includes(c.set))
    }

    if (options.teams && options.teams.length > 0) {
        cards = cards.filter((c) => {
            const details = c.details as any
            return typeof details?.team === 'number' && options.teams!.includes(details.team)
        })
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
        const keyA = options.sortByGroup ? a.group : a.name
        const keyB = options.sortByGroup ? b.group : b.name
        let cmp = keyA.localeCompare(keyB)
        // Secondary sort: if primary keys are equal, sort by the other field
        if (cmp === 0) {
            const secA = options.sortByGroup ? a.name : a.group
            const secB = options.sortByGroup ? b.name : b.group
            cmp = secA.localeCompare(secB)
        }
        return options.sortAsc !== false ? cmp : -cmp
    })

    return cards
}

export async function searchCards(query: string) {
    return searchEngine.search(query)
}
