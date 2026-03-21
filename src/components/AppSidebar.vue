<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  totalCards: number
  searchQuery: string
  sortAsc: boolean
  sortByGroup: boolean
  selectedTypes: string[]
  availableTypes: string[]
  availableGroups: string[]
  selectedGroups: string[]
  availableSets: { id: number; label: string; icon?: string; releaseOrder: number }[]
  selectedSets: number[]
  availableTeams: { id: number; label: string; icon?: string }[]
  selectedTeams: number[]
  availableHeroClasses: { id: number; label: string; icon?: string; bgColor: string }[]
  selectedHeroClasses: number[]
  availableKeywords: { id: number; label: string }[]
  selectedKeywords: number[]
  availableRules: { id: number; label: string }[]
  selectedRules: number[]
  isOpen: boolean
  isBuilderOpen: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortAsc': [value: boolean]
  'update:sortByGroup': [value: boolean]
  'update:selectedTypes': [value: string[]]
  'update:selectedGroups': [value: string[]]
  'update:selectedSets': [value: number[]]
  'update:selectedTeams': [value: number[]]
  'update:selectedHeroClasses': [value: number[]]
  'update:selectedKeywords': [value: number[]]
  'update:selectedRules': [value: number[]]
  'reset': []
  'toggleBuilder': []
}>()

const toggleType = (type: string) => {
  const current = [...props.selectedTypes]
  const idx = current.indexOf(type)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(type)
  }
  emit('update:selectedTypes', current)
}

// Filter Preset dropdown
const dropdownOpen = ref(false)
const presetSearch = ref('')

const filteredGroups = computed(() => {
  if (!presetSearch.value.trim()) return props.availableGroups
  const q = presetSearch.value.trim().toLowerCase()
  return props.availableGroups.filter((g) => g.toLowerCase().includes(q))
})

const toggleGroup = (group: string) => {
  const current = [...props.selectedGroups]
  const idx = current.indexOf(group)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(group)
  }
  emit('update:selectedGroups', current)
}

// Set filter dropdown
const setDropdownOpen = ref(false)
const setSearch = ref('')
const setSortMode = ref<'alpha' | 'releaseDate'>('alpha')

const filteredSets = computed(() => {
  let sets = props.availableSets
  if (setSearch.value.trim()) {
    const q = setSearch.value.trim().toLowerCase()
    sets = sets.filter((s) => s.label.toLowerCase().includes(q))
  }
  return [...sets].sort((a, b) => {
    if (setSortMode.value === 'alpha') {
      return a.label.localeCompare(b.label)
    } else {
      return a.releaseOrder - b.releaseOrder
    }
  })
})

const toggleSet = (setId: number) => {
  const current = [...props.selectedSets]
  const idx = current.indexOf(setId)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(setId)
  }
  emit('update:selectedSets', current)
}

// Team filter dropdown
const teamDropdownOpen = ref(false)
const teamSearch = ref('')

const filteredTeams = computed(() => {
  if (!teamSearch.value.trim()) return props.availableTeams
  const q = teamSearch.value.trim().toLowerCase()
  return props.availableTeams.filter((t) => t.label.toLowerCase().includes(q))
})

const toggleTeam = (id: number) => {
  const current = [...props.selectedTeams]
  const idx = current.indexOf(id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(id)
  }
  emit('update:selectedTeams', current)
}

// Hero Class filter dropdown
const hcDropdownOpen = ref(false)
const hcSearch = ref('')

const filteredHeroClasses = computed(() => {
  if (!hcSearch.value.trim()) return props.availableHeroClasses
  const q = hcSearch.value.trim().toLowerCase()
  return props.availableHeroClasses.filter((hc) => hc.label.toLowerCase().includes(q))
})

const toggleHeroClass = (id: number) => {
  const current = [...props.selectedHeroClasses]
  const idx = current.indexOf(id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(id)
  }
  emit('update:selectedHeroClasses', current)
}

// Keyword filter dropdown
const kwDropdownOpen = ref(false)
const kwSearch = ref('')

const filteredKeywords = computed(() => {
  if (!kwSearch.value.trim()) return props.availableKeywords
  const q = kwSearch.value.trim().toLowerCase()
  return props.availableKeywords.filter((k) => k.label.toLowerCase().includes(q))
})

const toggleKeyword = (id: number) => {
  const current = [...props.selectedKeywords]
  const idx = current.indexOf(id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(id)
  }
  emit('update:selectedKeywords', current)
}

// Rules filter dropdown
const ruleDropdownOpen = ref(false)
const ruleSearch = ref('')

const filteredRules = computed(() => {
  if (!ruleSearch.value.trim()) return props.availableRules
  const q = ruleSearch.value.trim().toLowerCase()
  return props.availableRules.filter((r) => r.label.toLowerCase().includes(q))
})

const toggleRule = (id: number) => {
  const current = [...props.selectedRules]
  const idx = current.indexOf(id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(id)
  }
  emit('update:selectedRules', current)
}

// Close dropdowns on click outside
const dropdownRef = ref<HTMLElement | null>(null)
const setDropdownRef = ref<HTMLElement | null>(null)
const teamDropdownRef = ref<HTMLElement | null>(null)
const hcDropdownRef = ref<HTMLElement | null>(null)
const kwDropdownRef = ref<HTMLElement | null>(null)
const ruleDropdownRef = ref<HTMLElement | null>(null)
const onClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
  if (setDropdownRef.value && !setDropdownRef.value.contains(e.target as Node)) {
    setDropdownOpen.value = false
  }
  if (teamDropdownRef.value && !teamDropdownRef.value.contains(e.target as Node)) {
    teamDropdownOpen.value = false
  }
  if (hcDropdownRef.value && !hcDropdownRef.value.contains(e.target as Node)) {
    hcDropdownOpen.value = false
  }
  if (kwDropdownRef.value && !kwDropdownRef.value.contains(e.target as Node)) {
    kwDropdownOpen.value = false
  }
  if (ruleDropdownRef.value && !ruleDropdownRef.value.contains(e.target as Node)) {
    ruleDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <nav id="sidebar" class="lg:min-w-[300px] w-[300px] max-lg:min-w-8 transition-all duration-500 shrink-0" :class="!isOpen ? 'max-lg:w-0' : ''">
    <div
      id="sidebar-collapse-menu"
      :class="[
        'bg-gradient-to-b p-4! from-stone-50 to-stone-100 h-screen fixed py-4 top-0 left-0 overflow-auto z-[99] lg:min-w-[300px] lg:w-[300px] transition-all duration-500 shadow-xl border-r border-stone-200',
        isOpen ? 'max-lg:w-[300px] max-lg:visible' : 'max-lg:w-0 max-lg:invisible'
      ]"
    >

      <!-- Card Count Badge -->
      <div class="px-5 pt-1! pb-3!">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-2! py-2!">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-800 leading-none">{{ totalCards }}</p>
                <p class="text-[11px] text-blue-600 mt-0.5">Total Cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Builder Toggle -->
      <div class="flex gap-2 mb-3! px-1!">
        <button
          @click="emit('toggleBuilder')"
          :class="[
            'flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold border rounded-xl transition-all duration-200 cursor-pointer',
            isBuilderOpen
              ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
              : 'text-slate-600 bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300'
          ]"
          title="Toggle Builder Canvas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {{ isBuilderOpen ? 'Close Builder' : 'Open Builder' }}
        </button>
      </div>

      <!-- Sort & Reset buttons -->
      <div class="flex gap-2 mb-3!">
        <button
          @click="emit('update:sortAsc', !sortAsc)"
          class="flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {{ sortAsc ? 'A → Z' : 'Z → A' }}
        </button>
        <button
          @click="emit('reset')"
          class="flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold text-slate-600 bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      <!-- Sort by / Group by toggles -->
      <div class="flex gap-2 mb-5!">
        <button
          @click="emit('update:sortByGroup', !sortByGroup)"
          :class="[
            'flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold border rounded-xl transition-all duration-200 cursor-pointer',
            sortByGroup
              ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
              : 'text-slate-600 bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300'
          ]"
          title="Toggle sort by Card Name or Hero Name"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ sortByGroup ? 'Hero Name' : 'Card Name' }}
        </button>
      </div>

      <!-- Search -->
      <div class="mb-5!">
        <div class="relative">
          <input
            type="text"
            :value="searchQuery"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            placeholder=" "
            class="peer w-full px-1 pt-6 pb-2 text-sm text-slate-800 bg-transparent border-0 border-b-2 border-gray-300 rounded-none outline-0 focus:border-blue-500 transition-all duration-200"
            id="search-card-input"
          />
          <label
            for="search-card-input"
            class="absolute left-1 top-1/2 -translate-y-1/2 text-base text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-[-11px] peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-[-11px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-gray-500"
          >
            Search card
          </label>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-5! border-t border-gray-200 mb-5!"></div>

      <!-- Category Checkboxes -->
      <div class="mb-5!">
        <h6 class="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-3">Categories</h6>
        <div class="space-y-1">
          <label
            v-for="type in availableTypes"
            :key="type"
            :class="[
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
              selectedTypes.includes(type)
                ? 'bg-blue-50 border border-blue-300'
                : 'hover:bg-gray-100 border border-transparent'
            ]"
          >
            <input
              type="checkbox"
              :checked="selectedTypes.includes(type)"
              @change="toggleType(type)"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer accent-blue-600"
            />
            <span :class="[
              'text-sm font-medium',
              selectedTypes.includes(type) ? 'text-blue-700' : 'text-slate-600'
            ]">{{ type }}</span>
          </label>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <!-- Filter Preset Dropdown -->
      <div class="mb-4! mt-4!">
        <!-- Hint when no categories selected -->
        <div v-if="availableGroups.length === 0" class="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs text-gray-400">Select a category to see groups</span>
        </div>

        <div v-else class="relative" ref="dropdownRef">
          <div
            @click="dropdownOpen = !dropdownOpen"
            class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
            :class="[
              dropdownOpen ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
            ]"
            id="filter-preset-btn"
          >
            <!-- Tags Wrapper -->
            <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
              <template v-if="selectedGroups.length > 0">
                <span
                  v-for="group in selectedGroups"
                  :key="group"
                  class="inline-flex max-w-[95%] items-center gap-1! px-2.5! py-1! text-[11px] font-semibold bg-blue-100 text-blue-700 rounded-lg border border-blue-200"
                >
                  <span class="truncate">{{ group }}</span>
                  <button @click.stop="toggleGroup(group)" class="hover:text-blue-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </template>
              <div v-else class="h-6"></div>
            </div>
            
            <div class="flex items-center shrink-0">
              <button 
                v-if="selectedGroups.length > 0" 
                @click.stop="emit('update:selectedGroups', [])" 
                class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Clear All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-slate-500 transition-transform duration-200 pointer-events-none"
                :class="dropdownOpen ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <label
            @click="dropdownOpen = !dropdownOpen"
            class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
            :class="[
              (dropdownOpen || selectedGroups.length > 0)
                ? 'top-[-11px] text-[11px] text-blue-500 font-medium'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            ]"
          >
            Filter Preset
          </label>

          <!-- Dropdown panel -->
          <div
            v-show="dropdownOpen"
            class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col"
          >
            <!-- Search inside dropdown -->
            <div class="p-2.5 border-b border-gray-100">
              <input
                type="text"
                v-model="presetSearch"
                placeholder="Search groups..."
                class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-blue-400 placeholder:text-slate-400"
                id="preset-search-input"
              />
            </div>
            <!-- Options list -->
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredGroups.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">
                No groups found
              </div>
              <label
                v-for="group in filteredGroups"
                :key="group"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                  selectedGroups.includes(group)
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input
                  type="checkbox"
                  :checked="selectedGroups.includes(group)"
                  @change="toggleGroup(group)"
                  class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer accent-blue-600"
                />
                <span>{{ group }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <!-- Set Filter Dropdown -->
      <div class="mb-4! mt-4!">
        <div class="relative" ref="setDropdownRef">
          <div
            @click="setDropdownOpen = !setDropdownOpen"
            class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
            :class="[
              setDropdownOpen ? 'border-amber-500' : 'border-gray-300 hover:border-gray-400'
            ]"
            id="set-filter-btn"
          >
            <!-- Tags Wrapper -->
            <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
              <template v-if="selectedSets.length > 0">
                <span
                  v-for="setId in selectedSets"
                  :key="setId"
                  class="inline-flex max-w-[95%] items-center gap-1! px-2.5! py-1! text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-lg border border-amber-200"
                >
                  <img v-if="availableSets.find(s => s.id === setId)?.icon" :src="availableSets.find(s => s.id === setId)?.icon" class="w-7 h-7 shrink-0" />
                  <span class="truncate">{{ availableSets.find(s => s.id === setId)?.label }}</span>
                  <button @click.stop="toggleSet(setId)" class="hover:text-amber-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </template>
              <div v-else class="h-6"></div>
            </div>
            
            <div class="flex items-center shrink-0">
              <button 
                v-if="selectedSets.length > 0" 
                @click.stop="emit('update:selectedSets', [])" 
                class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Clear All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 pointer-events-none transition-transform duration-200" :class="setDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <label
            @click="setDropdownOpen = !setDropdownOpen"
            class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
            :class="[
              (setDropdownOpen || selectedSets.length > 0)
                ? 'top-[-11px] text-[11px] text-amber-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            ]"
          >
            Filter by Set
          </label>

          <!-- Dropdown panel -->
          <div v-show="setDropdownOpen" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col">
            <div class="p-2.5 border-b border-gray-100">
              <input type="text" v-model="setSearch" placeholder="Search sets..." class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! mb-2 rounded-lg border border-gray-200 outline-0 focus:border-amber-400 placeholder:text-slate-400" id="set-search-input" />
              <div class="flex gap-2">
                <button 
                  @click.stop="setSortMode = 'alpha'"
                  :class="['flex-1 py-1.5 px-2 text-[10px] font-semibold border rounded-lg transition-colors cursor-pointer', setSortMode === 'alpha' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100']"
                >
                  Sort A-Z
                </button>
                <button 
                  @click.stop="setSortMode = 'releaseDate'"
                  :class="['flex-1 py-1.5 px-2 text-[10px] font-semibold border rounded-lg transition-colors cursor-pointer', setSortMode === 'releaseDate' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100']"
                >
                  Release Date
                </button>
              </div>
            </div>
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredSets.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">No sets found</div>
              <label
                v-for="set in filteredSets"
                :key="set.label"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                  selectedSets.includes(set.id) ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input type="checkbox" :checked="selectedSets.includes(set.id)" @change="toggleSet(set.id)" class="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500/30 focus:ring-offset-0 cursor-pointer accent-amber-600" />
                <img v-if="set.icon" :src="set.icon" class="w-10 h-10 shrink-0" />
                <span>{{ set.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Filter Dropdown (only when hero types selected) -->
      <template v-if="availableTeams.length > 0">
        <div class="mx-5 border-t border-gray-200 mb-5"></div>

        <div class="mb-4! mt-4!">
          <div class="relative" ref="teamDropdownRef">
            <div
              @click="teamDropdownOpen = !teamDropdownOpen"
              class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
              :class="[
                teamDropdownOpen ? 'border-teal-500' : 'border-gray-300 hover:border-gray-400'
              ]"
              id="team-filter-btn"
            >
              <!-- Tags Wrapper -->
              <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
                <template v-if="selectedTeams.length > 0">
                  <span
                    v-for="id in selectedTeams"
                    :key="id"
                    class="inline-flex max-w-[95%] items-center gap-1 px-2.5! py-1! text-[11px] font-semibold bg-teal-100 text-teal-700 rounded-lg border border-teal-200"
                  >
                    <img v-if="availableTeams.find(t => t.id === id)?.icon" :src="availableTeams.find(t => t.id === id)?.icon" class="w-7 h-7 shrink-0" />
                    <span class="truncate">{{ availableTeams.find(t => t.id === id)?.label }}</span>
                    <button @click.stop="toggleTeam(id)" class="hover:text-teal-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </template>
                <div v-else class="h-6"></div>
              </div>
              
              <div class="flex items-center shrink-0">
                <button 
                  v-if="selectedTeams.length > 0" 
                  @click.stop="emit('update:selectedTeams', [])" 
                  class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Clear All"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 pointer-events-none transition-transform duration-200" :class="teamDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <label
              @click="teamDropdownOpen = !teamDropdownOpen"
              class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
              :class="[
                (teamDropdownOpen || selectedTeams.length > 0)
                  ? 'top-[-11px] text-[11px] text-teal-600 font-medium'
                  : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
              ]"
            >
              Filter by Team
            </label>

            <!-- Dropdown panel -->
            <div v-show="teamDropdownOpen" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col">
              <div class="p-2.5 border-b border-gray-100">
                <input type="text" v-model="teamSearch" placeholder="Search teams..." class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-teal-400 placeholder:text-slate-400" id="team-search-input" />
              </div>
              <div class="overflow-y-auto px-3! py-2! flex-1">
                <div v-if="filteredTeams.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">No teams found</div>
                <label
                  v-for="team in filteredTeams"
                  :key="team.id"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                    selectedTeams.includes(team.id) ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                  ]"
                >
                  <input type="checkbox" :checked="selectedTeams.includes(team.id)" @change="toggleTeam(team.id)" class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500/30 focus:ring-offset-0 cursor-pointer accent-teal-600" />
                  <img v-if="team.icon" :src="team.icon" class="w-10 h-10 shrink-0" />
                  <span>{{ team.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Hero Class Filter Dropdown -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <div class="mb-4! mt-4!">
        <div class="relative" ref="hcDropdownRef">
          <div
            @click="hcDropdownOpen = !hcDropdownOpen"
            class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
            :class="[
              hcDropdownOpen ? 'border-violet-500' : 'border-gray-300 hover:border-gray-400'
            ]"
            id="hc-filter-btn"
          >
            <!-- Tags Wrapper -->
            <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
              <template v-if="selectedHeroClasses.length > 0">
                <span
                  v-for="id in selectedHeroClasses"
                  :key="id"
                  class="inline-flex max-w-[95%] items-center gap-1! px-2.5! py-1! text-[11px] font-semibold bg-violet-100 text-violet-700 rounded-lg border border-violet-200"
                >
                  <img v-if="availableHeroClasses.find(hc => hc.id === id)?.icon" :src="availableHeroClasses.find(hc => hc.id === id)?.icon" class="w-7 h-7 shrink-0" />
                  <span class="truncate">{{ availableHeroClasses.find(hc => hc.id === id)?.label }}</span>
                  <button @click.stop="toggleHeroClass(id)" class="hover:text-violet-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </template>
              <div v-else class="h-6"></div>
            </div>
            
            <div class="flex items-center shrink-0">
              <button 
                v-if="selectedHeroClasses.length > 0" 
                @click.stop="emit('update:selectedHeroClasses', [])" 
                class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Clear All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 pointer-events-none transition-transform duration-200" :class="hcDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <label
            @click="hcDropdownOpen = !hcDropdownOpen"
            class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
            :class="[
              (hcDropdownOpen || selectedHeroClasses.length > 0)
                ? 'top-[-11px] text-[11px] text-violet-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            ]"
          >
            Filter by Hero Class
          </label>

          <!-- Dropdown panel -->
          <div v-show="hcDropdownOpen" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col">
            <div class="p-2.5 border-b border-gray-100">
              <input type="text" v-model="hcSearch" placeholder="Search hero classes..." class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-violet-400 placeholder:text-slate-400" id="hc-search-input" />
            </div>
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredHeroClasses.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">No hero classes found</div>
              <label
                v-for="hc in filteredHeroClasses"
                :key="hc.id"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                  selectedHeroClasses.includes(hc.id) ? 'bg-violet-50 text-violet-700' : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input type="checkbox" :checked="selectedHeroClasses.includes(hc.id)" @change="toggleHeroClass(hc.id)" class="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500/30 focus:ring-offset-0 cursor-pointer accent-violet-600" />
                <img v-if="hc.icon" :src="hc.icon" class="w-10 h-10 shrink-0" />
                <span>{{ hc.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Keyword Filter Dropdown -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <div class="mb-4! mt-4!">
        <div class="relative" ref="kwDropdownRef">
          <div
            @click="kwDropdownOpen = !kwDropdownOpen"
            class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
            :class="[
              kwDropdownOpen ? 'border-sky-500' : 'border-gray-300 hover:border-gray-400'
            ]"
            id="kw-filter-btn"
          >
            <!-- Tags Wrapper -->
            <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
              <template v-if="selectedKeywords.length > 0">
                <span
                  v-for="id in selectedKeywords"
                  :key="id"
                  class="inline-flex max-w-[95%] items-center gap-1 px-2.5! py-1! text-[11px] font-semibold bg-sky-100 text-sky-700 rounded-lg border border-sky-200"
                >
                  <span class="truncate">{{ availableKeywords.find(k => k.id === id)?.label }}</span>
                  <button @click.stop="toggleKeyword(id)" class="hover:text-sky-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </template>
              <div v-else class="h-6"></div>
            </div>
            
            <div class="flex items-center shrink-0">
              <button 
                v-if="selectedKeywords.length > 0" 
                @click.stop="emit('update:selectedKeywords', [])" 
                class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Clear All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 pointer-events-none transition-transform duration-200" :class="kwDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <label
            @click="kwDropdownOpen = !kwDropdownOpen"
            class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
            :class="[
              (kwDropdownOpen || selectedKeywords.length > 0)
                ? 'top-[-11px] text-[11px] text-sky-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            ]"
          >
            Filter by Keyword
          </label>

          <!-- Dropdown panel -->
          <div v-show="kwDropdownOpen" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col">
            <div class="p-2.5 border-b border-gray-100">
              <input type="text" v-model="kwSearch" placeholder="Search keywords..." class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-sky-400 placeholder:text-slate-400" id="kw-search-input" />
            </div>
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredKeywords.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">No keywords found</div>
              <label
                v-for="kw in filteredKeywords"
                :key="kw.id"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                  selectedKeywords.includes(kw.id) ? 'bg-sky-50 text-sky-700' : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input type="checkbox" :checked="selectedKeywords.includes(kw.id)" @change="toggleKeyword(kw.id)" class="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500/30 focus:ring-offset-0 cursor-pointer accent-sky-600" />
                <span>{{ kw.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Extra Rules Filter Dropdown -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <div class="mb-4! mt-4!">
        <div class="relative" ref="ruleDropdownRef">
          <div
            @click="ruleDropdownOpen = !ruleDropdownOpen"
            class="peer w-full flex items-center justify-between px-1 pt-7 pb-1 border-0 border-b-2 bg-transparent min-h-[45px] rounded-none outline-0 transition-all duration-200 text-left cursor-pointer"
            :class="[
              ruleDropdownOpen ? 'border-rose-500' : 'border-gray-300 hover:border-gray-400'
            ]"
            id="rule-filter-btn"
          >
            <!-- Tags Wrapper -->
            <div class="flex flex-wrap flex-1 min-w-0 pr-2 gap-1.5 mt-1.5!">
              <template v-if="selectedRules.length > 0">
                <span
                  v-for="id in selectedRules"
                  :key="id"
                  class="inline-flex max-w-[95%] items-center gap-1 px-2.5! py-1! text-[11px] font-semibold bg-rose-100 text-rose-700 rounded-lg border border-rose-200"
                >
                  <span class="truncate">{{ availableRules.find(r => r.id === id)?.label }}</span>
                  <button @click.stop="toggleRule(id)" class="hover:text-rose-900 shrink-0 transition-colors ml-0.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </template>
              <div v-else class="h-6"></div>
            </div>
            
            <div class="flex items-center shrink-0">
              <button 
                v-if="selectedRules.length > 0" 
                @click.stop="emit('update:selectedRules', [])" 
                class="p-1 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Clear All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 pointer-events-none transition-transform duration-200" :class="ruleDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <label
            @click="ruleDropdownOpen = !ruleDropdownOpen"
            class="absolute left-1 cursor-pointer transition-all duration-200 pointer-events-none"
            :class="[
              (ruleDropdownOpen || selectedRules.length > 0)
                ? 'top-[-11px] text-[11px] text-rose-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            ]"
          >
            Filter by Extra Rules
          </label>

          <!-- Dropdown panel -->
          <div v-show="ruleDropdownOpen" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col">
            <div class="p-2.5 border-b border-gray-100">
              <input type="text" v-model="ruleSearch" placeholder="Search rules..." class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-rose-400 placeholder:text-slate-400" id="rule-search-input" />
            </div>
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredRules.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">No rules found</div>
              <label
                v-for="rule in filteredRules"
                :key="rule.id"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-base',
                  selectedRules.includes(rule.id) ? 'bg-rose-50 text-rose-700' : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input type="checkbox" :checked="selectedRules.includes(rule.id)" @change="toggleRule(rule.id)" class="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500/30 focus:ring-offset-0 cursor-pointer accent-rose-600" />
                <span>{{ rule.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
