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

// Build hero-class ID → label lookup from metadata
const heroClassLookup: Map<number, string> = new Map()
for (const hc of Metadata.heroClassesArray) {
    heroClassLookup.set(hc.id, hc.label)
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
 * Returns hero class options as {id, label, icon, bgColor} for filtering (excludes id=0 "NONE").
 */
export function getHeroClasses(): { id: number; label: string; icon?: string; bgColor: string }[] {
    return Metadata.heroClassesArray
        .filter(hc => hc.id !== 0)
        .map(hc => ({ id: hc.id, label: hc.label, icon: getIconUrl(hc.value), bgColor: hc.bgColor }))
}

/**
 * Returns keyword options as {id, label} for filtering, sorted by label.
 */
export function getKeywords(): { id: number; label: string }[] {
    return [...Metadata.keywordsArray]
        .map(k => ({ id: k.id, label: k.label }))
        .sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * Returns rule (extra rules) options as {id, label} for filtering, sorted by label.
 */
export function getRules(): { id: number; label: string }[] {
    return [...Metadata.rulesArray]
        .map(r => ({ id: r.id, label: r.label }))
        .sort((a, b) => a.label.localeCompare(b.label))
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
 * Look up a hero class label by its numeric ID.
 */
export function getHeroClassLabel(id: number): string {
    return heroClassLookup.get(id) ?? ''
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

/**
 * Recursively check if a description contains any of the given keyword IDs.
 */
function descriptionHasKeyword(desc: any, ids: number[]): boolean {
    if (!desc) return false
    if (Array.isArray(desc)) return desc.some(d => descriptionHasKeyword(d, ids))
    if (typeof desc === 'object') {
        if ('keyword' in desc) return ids.includes(desc.keyword)
        if ('points' in desc) return descriptionHasKeyword(desc.points, ids)
    }
    return false
}

/**
 * Recursively check if a description contains any of the given rule IDs.
 */
function descriptionHasRule(desc: any, ids: number[]): boolean {
    if (!desc) return false
    if (Array.isArray(desc)) return desc.some(d => descriptionHasRule(d, ids))
    if (typeof desc === 'object') {
        if ('rule' in desc) return ids.includes(desc.rule)
        if ('points' in desc) return descriptionHasRule(desc.points, ids)
    }
    return false
}

export function filterCards(options: {
    search?: string
    types?: string[]
    groups?: string[]
    sets?: string[]
    teams?: number[]
    heroClasses?: number[]
    keywords?: number[]
    rules?: number[]
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

    if (options.heroClasses && options.heroClasses.length > 0) {
        cards = cards.filter((c) => {
            const details = c.details as any
            if (typeof details?.hc === 'number' && options.heroClasses!.includes(details.hc)) return true
            if (typeof details?.hc2 === 'number' && options.heroClasses!.includes(details.hc2)) return true
            // Check divided hero cards (half1/half2)
            if (details?.half1 && typeof details.half1.hc === 'number' && options.heroClasses!.includes(details.half1.hc)) return true
            if (details?.half2 && typeof details.half2.hc === 'number' && options.heroClasses!.includes(details.half2.hc)) return true
            return false
        })
    }

    if (options.keywords && options.keywords.length > 0) {
        cards = cards.filter((c) => {
            const d = c.details as any
            if (descriptionHasKeyword(d?.description, options.keywords!)) return true
            if (d?.half1 && descriptionHasKeyword(d.half1.description, options.keywords!)) return true
            if (d?.half2 && descriptionHasKeyword(d.half2.description, options.keywords!)) return true
            return false
        })
    }

    if (options.rules && options.rules.length > 0) {
        cards = cards.filter((c) => {
            const d = c.details as any
            if (descriptionHasRule(d?.description, options.rules!)) return true
            if (d?.half1 && descriptionHasRule(d.half1.description, options.rules!)) return true
            if (d?.half2 && descriptionHasRule(d.half2.description, options.rules!)) return true
            return false
        })
    }

    if (options.search && options.search.trim()) {
        const q = options.search.trim().toLowerCase()
        cards = cards.filter((c) => {
            if (c.name.toLowerCase().includes(q)) return true
            if (c.subtitle.toLowerCase().includes(q)) return true
            if (c.group.toLowerCase().includes(q)) return true
            if (getDescriptionText(c.details?.description).toLowerCase().includes(q)) return true
            const d = c.details as any
            if (d?.half1 && getDescriptionText(d.half1.description).toLowerCase().includes(q)) return true
            if (d?.half2 && getDescriptionText(d.half2.description).toLowerCase().includes(q)) return true
            return false
        })
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
