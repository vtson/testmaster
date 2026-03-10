## A. Client Startup

```
A1  User opens site
A2  Browser loads index.html → Vite JS bundle executes
```

## B. Vue Bootstrap (main.ts)

```
B1  Vite entry: main.ts
B2  createApp(App).mount('#app')
```

## C. Data Initialization (cardData.ts — runs once at module load)

```
C1  Initialize Search Engine
    ┌─────────────────────────────────────────────────────────┐
    │  import * as MSData from "@/lib/master-strike-data/dist"│
    │  const { CardSearchEngine, Metadata } = MSData          │
    │                                                         │
    │  const searchEngine = new CardSearchEngine()            │
    │  const browser = searchEngine.getBrowser()              │
    │  const allCards = searchEngine.getAllCards()            │
    └─────────────────────────────────────────────────────────┘
    browser returns: ByCardType → { [Set] → { [Group] → CardSearchResult[] } }

C2  Build Derived Lookups (from Metadata arrays)
    • teamLookup       — Map<id, label>    from Metadata.teamsArray
    • setIconLookup    — Map<label, icon>  from Metadata.setsArray + iconMap.ts
    • heroClassLookup  — Map<id, label>    from Metadata.heroClassesArray

C3  Export service functions
    • getAllCards()          → readonly CardSearchResult[]
    • getCategories()       → card types via Object.keys(browser)
    • getGroups(types)      → group/card names from browser structure
    • getSets()             → unique sets from allCards
    • getTeams()            → from Metadata.teamsArray
    • getHeroClasses()      → from Metadata.heroClassesArray
    • getKeywords()         → from Metadata.keywordsArray
    • getRules()            → from Metadata.rulesArray
    • getTeamLabel(id)      → lookup from teamLookup
    • getHeroClassLabel(id) → lookup from heroClassLookup
    • getSetIcon(label)     → lookup from setIconLookup
    • filterCards(options)  → in-memory filter + sort pipeline
    • searchCards(query)    → async full-text search via searchEngine.search()
                              (currently unused by UI)
```

> **Note:** All card data is loaded once at initialization.
> Runtime filtering uses an in-memory scan and sort pipeline (`filterCards`).
> No data is reloaded at runtime.

## D. Static Assets (bundled / public)

```
D1  JS Modules (src/lib/master-strike-data/dist/)
    ├── metadata/*.js          — teams, sets, heroClasses, keywords, rules, etc.
    ├── definitions/cards/*.js — individual card definitions (123 files)
    ├── definitions/keywords/  — keyword definitions (309 files)
    ├── definitions/rules/     — rule definitions (57 files)
    ├── search/*.js            — CardSearchEngine, RuleSearchEngine
    ├── search/processors/*.js — search processors (27 files)
    └── utils/*.js             — utility modules

D2  Images (public/)
    ├── CardImages/*.webp      — card artwork
    └── img/                   — icons (teams, sets, hero classes)
```

## E. Component Tree & Render

```
App.vue
├── AppSidebar.vue          — Filter controls, search input, sort toggles
├── CardGallery.vue         — Grouped card grid with infinite scroll
│   └── CardItem.vue        — Individual card tile (click → select)
└── CardModal.vue           — Full card detail overlay
    └── CardDescription.vue — Rich text card description renderer
```

## F. Reactive Data Layer (App.vue)

```
F1  Filter State (refs)
    • searchQuery, sortAsc, sortByGroup
    • selectedTypes, selectedGroups, selectedSets
    • selectedTeams, selectedHeroClasses
    • selectedKeywords, selectedRules
    • groupBySet, sidebarOpen

F2  Computed (derived from state)
    • availableTypes       ← getCategories()
    • availableGroups      ← getGroups(selectedTypes)
    • availableSets        ← getSets()
    • availableTeams       ← getTeams()  (only when Hero/Sidekick selected)
    • availableHeroClasses ← getHeroClasses()
    • availableKeywords    ← getKeywords()
    • availableRules       ← getRules()
    • allFilteredCards     ← filterCards({ all filter refs })

F3  Watchers (cleanup)
    • watch(availableGroups) → prune stale selectedGroups
    • watch(availableTeams)  → prune stale selectedTeams
```

## G. Runtime User Flow

```
                    ┌──────────────────────────┐
                    │  B3  Render Card Grid    │
                    │  + Sidebar Filters       │
                    │  (HOME state)            │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  User Action?            │
                    └──┬───────────────────┬───┘
                       │                   │
              Filter / Search         Card Selected
              Changed                      │
                       │                   │
          ┌────────────▼──────────┐   ┌────▼──────────────────┐
          │ F2 Recompute          │   │ B5 Card Detail Modal  │
          │ allFilteredCards      │   │ (CardModal.vue)       │
          │ (filterCards pipeline)│   │                       │
          └────────────┬──────────┘   │ Image loads via       │
                       │              │ <img :src=imageUrl>   │
          ┌────────────▼──────────┐   │                       │
          │ Re-render CardGallery │   │  ┌──────────────────┐ │
          │ (groups reset,        │   │  │ Browser cache?   │ │
          │  infinite scroll      │   │  │ Yes → from cache │ │
          │  restarts at batch 1) │   │  │ No  → HTTP GET   │ │
          └───────────────────────┘   │  │      *.webp      │ │
                                      │  └──────────────────┘ │
                                      └───────────────────────┘
```

### Filter Pipeline Detail (filterCards)

```
allCards (full set, in memory)
  │
  ├── filter by types         (card.type ∈ selectedTypes)
  ├── filter by groups        (card.group ∈ selectedGroups OR card.name ∈ selectedGroups)
  ├── filter by sets          (card.set ∈ selectedSets)
  ├── filter by teams         (card.details.team ∈ selectedTeams)
  ├── filter by heroClasses   (card.details.hc/hc2/half1.hc/half2.hc ∈ selectedHeroClasses)
  ├── filter by keywords      (description contains keyword ID)
  ├── filter by rules         (description contains rule ID)
  ├── filter by search text   (name/subtitle/group/description includes query)
  │
  └── sort by (group OR name), secondary sort by the other
      direction: ascending or descending
```

### CardGallery Infinite Scroll

```
CardGallery groups filtered cards by (group | set)
  → Shows first 5 groups (GROUPS_PER_BATCH = 5)
  → IntersectionObserver on sentinel element
  → When sentinel visible, load next 5 groups
  → Resets to batch 1 when cards prop changes
```