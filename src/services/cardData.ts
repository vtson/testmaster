import { CardSearchEngine } from '@master-strike/data'
import type { CardSearchResult } from '@master-strike/data'
import woundData from '../wound.json'

export type { CardSearchResult as Card }

// Wound card interface from custom JSON
interface WoundEntry {
    name: string
    type: string
    set: string
    qtd: number
    cost: number
    attack: number
    recruit: number
    healing: string
}

// Convert wound entries to CardSearchResult-compatible objects
function woundsToCards(wounds: WoundEntry[]): CardSearchResult[] {
    return wounds.map((w) => ({
        name: w.name,
        subtitle: w.type,
        type: 'Wound' as any,
        set: w.set,
        group: w.type, // use wound sub-type (Enraging Wound, Grievous Wound, etc.) as group
        imageUrl: '',
        details: {
            detailsType: 'BystanderCardDetail',
            description: [w.healing],
            qtd: w.qtd,
            vp: '0',
            cost: w.cost > 0 ? String(w.cost) : undefined,
            attack: w.attack > 0 ? String(w.attack) : undefined,
            recruit: w.recruit > 0 ? String(w.recruit) : undefined,
        } as any,
    }))
}

const searchEngine = new CardSearchEngine()
const browser = searchEngine.getBrowser()
const packageCards = searchEngine.getAllCards()
const woundCards = woundsToCards(woundData as WoundEntry[])
const allCards: readonly CardSearchResult[] = [...packageCards, ...woundCards]

export function getAllCards(): readonly CardSearchResult[] {
    return allCards
}

export function getCategories(): string[] {
    const cats = new Set(Object.keys(browser))
    cats.add('Wound')
    return [...cats].sort()
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
        // Handle Wound category from custom data
        if (type === 'Wound') {
            for (const w of woundCards) {
                result.add(w.name) // show individual wound names
            }
            continue
        }

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
                c.group.toLowerCase().includes(q)
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
