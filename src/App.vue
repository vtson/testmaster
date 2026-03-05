<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import CardGallery from './components/CardGallery.vue'
import CardModal from './components/CardModal.vue'
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
const selectedSets = ref<string[]>([])
const selectedTeams = ref<number[]>([])
const selectedHeroClasses = ref<number[]>([])
const selectedKeywords = ref<number[]>([])
const selectedRules = ref<number[]>([])
const groupBySet = ref(false)
const sidebarOpen = ref(false)

// Available options
const availableTypes = computed(() => getCategories())
const availableGroups = computed(() => selectedTypes.value.length ? getGroups(selectedTypes.value) : [])
const availableSets = computed(() => getSets())
const availableTeams = computed(() => {
  // Only show teams when a hero-related type is selected
  const heroTypes = ['Hero', 'Sidekick']
  const hasHeroType = selectedTypes.value.some(t => heroTypes.includes(t))
  return hasHeroType ? getTeams() : []
})
const availableHeroClasses = computed(() => getHeroClasses())
const availableKeywords = computed(() => getKeywords())
const availableRules = computed(() => getRules())

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
  groupBySet.value = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/20">
    <div>
      <div class="flex items-start">
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
          :groupBySet="groupBySet"
          :isOpen="sidebarOpen"
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
          @update:groupBySet="groupBySet = $event"
          @reset="resetFilters"
        />

        <!-- Mobile sidebar toggle -->
        <button
          @click="toggleSidebar"
          :class="[
            'lg:hidden w-10 h-10 z-[100] fixed top-4 cursor-pointer flex items-center justify-center rounded-xl outline-0 transition-all duration-500 shadow-xl',
            sidebarOpen
              ? 'left-[260px] bg-red-500 hover:bg-red-600'
              : 'left-3 bg-slate-800 hover:bg-slate-700'
          ]"
          id="toggle-sidebar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Main Content -->
        <section class="main-content w-full overflow-auto px-6! sm:px-10 py-8!">
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

          <CardGallery :cards="allFilteredCards" :groupBy="groupBySet ? 'set' : 'group'" @select-card="selectedCard = $event" />

          <!-- Card Detail Modal -->
          <CardModal :card="selectedCard" @close="selectedCard = null" />
        </section>
      </div>
    </div>
  </div>
</template>