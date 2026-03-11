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

// Build set label → ID reverse lookup
const setLabelToId: Map<string, number> = new Map()
for (const s of Metadata.setsArray) {
    setLabelToId.set(s.label, s.id)
}

// Build set ID → label lookup
const setIdToLabel: Map<number, string> = new Map()
for (const s of Metadata.setsArray) {
    setIdToLabel.set(s.id, s.label)
}

// Build hero-class ID → label lookup from metadata
const heroClassLookup: Map<number, string> = new Map()
for (const hc of Metadata.heroClassesArray) {
    heroClassLookup.set(hc.id, hc.label)
}

// Build group → set mapping for disambiguation
// Key: "type|group", Value: Set of set labels where this group appears
const groupSetMap: Map<string, Set<string>> = new Map()
for (const card of allCards) {
    const key = `${card.type}|${card.group}`
    if (!groupSetMap.has(key)) groupSetMap.set(key, new Set())
    groupSetMap.get(key)!.add(card.set)
}

export function getAllCards(): readonly CardSearchResult[] {
    return allCards
}

export function getCategories(): string[] {
    return Object.keys(browser).sort()
}

/**
 * Returns all unique sets from card data with id, label and icon, sorted alphabetically.
 */
export function getSets(): { id: number; label: string; icon?: string }[] {
    const result = new Set<string>()
    for (const card of allCards) {
        if (card.set) result.add(card.set)
    }
    return [...result].sort().map(label => ({
        id: setLabelToId.get(label) ?? 0,
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
 * Groups that appear in multiple sets get disambiguated with " (SetName)" suffix.
 * For types where all groups share the same name (Bystander), returns individual card names instead.
 */
export function getGroups(filterTypes?: string[], filterSets?: number[]): string[] {
    if (!filterTypes || filterTypes.length === 0) return []

    const result: Set<string> = new Set()

    // Convert set IDs to labels for browser key matching
    const filterSetLabels = filterSets && filterSets.length > 0
        ? filterSets.map(id => setIdToLabel.get(id) ?? '').filter(Boolean)
        : []

    for (const type of filterTypes) {

        const bySet = browser[type as keyof typeof browser]
        if (!bySet) continue

        // If sets are specified, only consider groups from those sets
        const setKeys = filterSetLabels.length > 0
            ? Object.keys(bySet).filter(s => filterSetLabels.includes(s))
            : Object.keys(bySet)

        // Collect all unique group names for this type (within set scope)
        // Track which sets each group appears in (within scope)
        const groupToSets: Map<string, string[]> = new Map()
        for (const set of setKeys) {
            const byGroup = bySet[set]
            if (!byGroup) continue
            for (const group of Object.keys(byGroup)) {
                if (!groupToSets.has(group)) groupToSets.set(group, [])
                groupToSets.get(group)!.push(set)
            }
        }

        // If all groups have the same name (e.g. Bystander → all "Bystanders"),
        // use individual card names instead since groups are not meaningful
        if (groupToSets.size <= 1) {
            for (const set of setKeys) {
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
            for (const [group, sets] of groupToSets) {
                // Check if this group name appears in multiple sets globally (not just within scope)
                const globalKey = `${type}|${group}`
                const globalSets = groupSetMap.get(globalKey)
                if (globalSets && globalSets.size > 1) {
                    // Disambiguate: add set label suffix for each set
                    for (const set of sets) {
                        result.add(`${group} (${set})`)
                    }
                } else {
                    result.add(group)
                }
            }
        }
    }
    return [...result].sort()
}

/**
 * Resolve selected group filter values to { group, set? } pairs.
 * Handles both plain group names and disambiguated "Group (Set)" names.
 */
function resolveGroupFilters(selectedGroups: string[]): { group: string; set?: string }[] {
    return selectedGroups.map(g => {
        // Check if it's a disambiguated name like "Ant-Man (Ant-Man)"
        const match = g.match(/^(.+?) \((.+)\)$/)
        if (match && match[1] && match[2]) {
            return { group: match[1], set: match[2] }
        }
        return { group: g }
    })
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

/**
 * Recursively check if a description contains any rule reference at all.
 */
function descriptionHasAnyRule(desc: any): boolean {
    if (!desc) return false
    if (Array.isArray(desc)) return desc.some(d => descriptionHasAnyRule(d))
    if (typeof desc === 'object') {
        if ('rule' in desc) return true
        if ('points' in desc) return descriptionHasAnyRule(desc.points)
    }
    return false
}

export function filterCards(options: {
    search?: string
    types?: string[]
    groups?: string[]
    sets?: number[]
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
        const resolved = resolveGroupFilters(options.groups)
        cards = cards.filter((c) =>
            resolved.some(r => {
                if (r.set) {
                    // Disambiguated: match both group AND set
                    return c.group === r.group && c.set === r.set
                }
                // Plain group name or card name (Bystander-like)
                return c.group === r.group || c.name === r.group
            })
        )
    }

    if (options.sets && options.sets.length > 0) {
        cards = cards.filter((c) => {
            const cardSetId = setLabelToId.get(c.set)
            return cardSetId !== undefined && options.sets!.includes(cardSetId)
        })
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
            // Check divided hero cards (half1/half2) including hc2
            if (details?.half1) {
                if (typeof details.half1.hc === 'number' && options.heroClasses!.includes(details.half1.hc)) return true
                if (typeof details.half1.hc2 === 'number' && options.heroClasses!.includes(details.half1.hc2)) return true
            }
            if (details?.half2) {
                if (typeof details.half2.hc === 'number' && options.heroClasses!.includes(details.half2.hc)) return true
                if (typeof details.half2.hc2 === 'number' && options.heroClasses!.includes(details.half2.hc2)) return true
            }
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
        const ruleIds = options.rules!
        cards = cards.filter((c) => {
            const d = c.details as any

            // Rule 2: Multiclass Cards — cards with hc2
            if (ruleIds.includes(2)) {
                if (d?.hc2) return true
                if (d?.half1?.hc2 || d?.half2?.hc2) return true
            }

            // Rule 4: Divided Card — cards with half1/half2
            if (ruleIds.includes(4)) {
                if (d?.half1) return true
            }

            // Rule 10: Asterisk Symbol — cost or vAttack contains *
            if (ruleIds.includes(10)) {
                const cost = d?.cost || ''
                const vAtk = d?.vAttack || ''
                if (cost.includes('*') || vAtk.includes('*')) return true
                if (d?.half1?.cost?.includes('*') || d?.half2?.cost?.includes('*')) return true
            }

            // Rule 5: Traps — villain subtitle starts with "Trap"
            if (ruleIds.includes(5)) {
                if (c.subtitle.startsWith('Trap')) return true
            }

            // Rule 6: Locations — subtitle starts with "Location"
            if (ruleIds.includes(6)) {
                if (c.subtitle.startsWith('Location')) return true
            }

            // Rule 9: Villainous Weapons — subtitle starts with "Villainous Weapon"
            if (ruleIds.includes(9)) {
                if (c.subtitle.startsWith('Villainous Weapon')) return true
            }

            // Rule 7: Double-Sided Transforming Schemes — Schemes from Revelations set (id=24)
            if (ruleIds.includes(7)) {
                if (c.type === 'Scheme' && c.set === 'Revelations') return true
            }

            // Rule 13: Veiled Schemes
            if (ruleIds.includes(13)) {
                if (c.subtitle === 'Veiled Scheme') return true
            }

            // Rule 14: Unveiled Schemes
            if (ruleIds.includes(14)) {
                if (c.subtitle === 'Unveiled Scheme') return true
            }

            // Rule 16: Ambush Schemes — villain cards with ambush
            if (ruleIds.includes(16)) {
                if (c.subtitle.startsWith('Ambush Scheme')) return true
            }

            // Rule 17: Grievous Wounds — Wound cards from Civil War set (id=13)
            if (ruleIds.includes(17)) {
                if (c.type === 'Wound' && c.set === 'Civil War') return true
            }

            // Rule 18: Enraging Wounds — Wound cards from Weapon X set (id=41)
            if (ruleIds.includes(18)) {
                if (c.type === 'Wound' && c.set === 'Weapon X') return true
            }

            // Rule -1: NONE — cards with no special rules and no {rule:N} in description
            if (ruleIds.includes(-1)) {
                const hasHc2 = d?.hc2 || d?.half1?.hc2 || d?.half2?.hc2
                const hasDivided = !!d?.half1
                const hasAsterisk = (d?.cost || '').includes('*') || (d?.vAttack || '').includes('*')
                const isTrap = c.subtitle.startsWith('Trap')
                const isLocation = c.subtitle.startsWith('Location')
                const noStructural = !hasHc2 && !hasDivided && !hasAsterisk && !isTrap && !isLocation
                if (noStructural) {
                    const hasDescRule = descriptionHasAnyRule(d?.description)
                    const hasHalf1Rule = d?.half1 && descriptionHasAnyRule(d.half1.description)
                    const hasHalf2Rule = d?.half2 && descriptionHasAnyRule(d.half2.description)
                    if (!hasDescRule && !hasHalf1Rule && !hasHalf2Rule) return true
                }
            }

            // Check {rule: N} in description text (for rules like Shards, Sidekicks, etc.)
            if (descriptionHasRule(d?.description, ruleIds)) return true
            if (d?.half1 && descriptionHasRule(d.half1.description, ruleIds)) return true
            if (d?.half2 && descriptionHasRule(d.half2.description, ruleIds)) return true

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
