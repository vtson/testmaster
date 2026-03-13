<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import CardGallery from './components/CardGallery.vue'
import CardModal from './components/CardModal.vue'
import BuilderCanvas from './components/BuilderCanvas.vue'
import { filterCards, getCategories, getGroups, getSets, getTeams, getHeroClasses, getKeywords, getRules } from './services/cardData'
import type { Card } from './types/card'

// Modal state
const selectedCard = ref<Card | null>(null)

// Filter state
const searchQuery = ref('')
const sortAsc = ref(true)
const sortByGroup = ref(true)
const selectedTypes = ref<string[]>(['Hero'])
const selectedGroups = ref<string[]>([])
const selectedSets = ref<number[]>([])
const selectedTeams = ref<number[]>([])
const selectedHeroClasses = ref<number[]>([])
const selectedKeywords = ref<number[]>([])
const selectedRules = ref<number[]>([])
const isSearchOpen = ref(false)
const isBuilderOpen = ref(false)

// Available options
const availableTypes = computed(() => getCategories())
const availableGroups = computed(() => selectedTypes.value.length ? getGroups(selectedTypes.value, selectedSets.value) : [])
const availableSets = computed(() => getSets(selectedTypes.value))
const availableTeams = computed(() => {
  // Only show teams when a hero-related type is selected
  const heroTypes = ['Hero', 'Sidekick']
  const hasHeroType = selectedTypes.value.some(t => heroTypes.includes(t))
  return hasHeroType ? getTeams() : []
})
const availableHeroClasses = computed(() => getHeroClasses())
const availableKeywords = computed(() => getKeywords())
const availableRules = computed(() => getRules(selectedTypes.value))


// Filtered cards (all)
const allFilteredCards = computed(() =>
  filterCards({
    search: searchQuery.value,
    types: selectedTypes.value,
    groups: selectedGroups.value,
    sets: selectedSets.value,
    teams: selectedTeams.value,
    heroClasses: selectedHeroClasses.value,
    keywords: selectedKeywords.value,
    rules: selectedRules.value,
    sortAsc: sortAsc.value,
    sortByGroup: sortByGroup.value,
  })
)

// Clean up selected groups when types change
watch(availableGroups, (newGroups) => {
  selectedGroups.value = selectedGroups.value.filter((g) => newGroups.includes(g))
})

// Clean up selected teams when available teams change
watch(availableTeams, (newTeams) => {
  const ids = newTeams.map(t => t.id)
  selectedTeams.value = selectedTeams.value.filter((id) => ids.includes(id))
})

const resetFilters = () => {
  searchQuery.value = ''
  sortAsc.value = true
  sortByGroup.value = true
  selectedTypes.value = []
  selectedGroups.value = []
  selectedSets.value = []
  selectedTeams.value = []
  selectedHeroClasses.value = []
  selectedKeywords.value = []
  selectedRules.value = []
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
}

const toggleBuilder = () => {
  isBuilderOpen.value = !isBuilderOpen.value
}

</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/20">
    <div>
      <div :class="['flex items-start', isBuilderOpen ? 'h-screen overflow-hidden' : '']">
        <AppSidebar
          :totalCards="allFilteredCards.length"
          :searchQuery="searchQuery"
          :sortAsc="sortAsc"
          :sortByGroup="sortByGroup"
          :selectedTypes="selectedTypes"
          :availableTypes="availableTypes"
          :availableGroups="availableGroups"
          :selectedGroups="selectedGroups"
          :availableSets="availableSets"
          :selectedSets="selectedSets"
          :availableTeams="availableTeams"
          :selectedTeams="selectedTeams"
          :availableHeroClasses="availableHeroClasses"
          :selectedHeroClasses="selectedHeroClasses"
          :availableKeywords="availableKeywords"
          :selectedKeywords="selectedKeywords"
          :availableRules="availableRules"
          :selectedRules="selectedRules"
          :isOpen="isSearchOpen"
          @update:searchQuery="searchQuery = $event"
          @update:sortAsc="sortAsc = $event"
          @update:sortByGroup="sortByGroup = $event"
          @update:selectedTypes="selectedTypes = $event"
          @update:selectedGroups="selectedGroups = $event"
          @update:selectedSets="selectedSets = $event"
          @update:selectedTeams="selectedTeams = $event"
          @update:selectedHeroClasses="selectedHeroClasses = $event"
          @update:selectedKeywords="selectedKeywords = $event"
          @update:selectedRules="selectedRules = $event"
          @reset="resetFilters"
          @toggleBuilder="toggleBuilder"
          :isBuilderOpen="isBuilderOpen"
        />

        <!-- Mobile sidebar toggle & Builder toggle (Top Header Area) -->
        <div class="fixed top-4 left-0 right-0 z-[100] flex justify-between px-4 pointer-events-none">
          <button
            @click="toggleSearch"
            :class="[
              'lg:hidden w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl outline-0 transition-all duration-500 shadow-xl pointer-events-auto',
              isSearchOpen
                ? 'translate-x-[260px] bg-red-500 hover:bg-red-600'
                : 'bg-slate-800 hover:bg-slate-700'
            ]"
            id="toggle-sidebar-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="white" stroke-width="2">
              <path v-if="isSearchOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Main Content -->
        <section :class="[
          'main-content transition-all duration-300 w-full overflow-auto px-6! sm:px-10 py-8! pt-20!',
          isBuilderOpen ? 'max-w-xs shrink-0 border-r border-slate-200 bg-slate-50 h-screen overflow-y-auto' : 'flex-1'
        ]">
          <!-- Page header -->
          <div class="flex items-center justify-between mb-6 p-2!">
            <div>
              <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Card Gallery</h1>
              <p class="text-sm text-slate-400 mt-0.5">
                Showing <span class="font-semibold text-slate-600">{{ allFilteredCards.length }}</span> cards
              </p>
            </div>

            <!-- Active filters summary -->
            <div v-if="selectedTypes.length > 0 || searchQuery" class="hidden sm:flex items-center gap-2">
              <span
                v-for="type in selectedTypes"
                :key="type"
                class="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full"
              >
                {{ type }}
              </span>
              <span
                v-if="searchQuery"
                class="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full"
              >
                "{{ searchQuery }}"
              </span>
            </div>
          </div>

          <CardGallery :cards="allFilteredCards" :isBuilderOpen="isBuilderOpen" @select-card="selectedCard = $event" />

          <!-- Card Detail Modal -->
          <CardModal :card="selectedCard" @close="selectedCard = null" />
        </section>

        <!-- Builder Canvas Section -->
        <section v-if="isBuilderOpen" class="flex-1 h-screen bg-gray-200 overflow-y-auto flex justify-center py-8 relative pt-20">
          <BuilderCanvas />
        </section>
      </div>
    </div>
  </div>
</template>

<style>
.main-content {
  margin: 0; 
}
/* Only apply max-width limits if we are NOT in builder mode */
.main-content:not(.max-w-xs) {
  margin: 0 auto;
}

@media (min-width: 960px) {
  .main-content:not(.max-w-xs) {
    max-width: 900px;
  }
}

@media (min-width: 1264px) {
  .main-content:not(.max-w-xs) {
    max-width: 1185px;
  }
}

@media (min-width: 1904px) {
  .main-content:not(.max-w-xs) {
    max-width: 1785px;
  }
}
</style>