<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import CardGallery from './components/CardGallery.vue'
import CardModal from './components/CardModal.vue'
import { filterCards, getCategories, getGroups } from './services/cardData'
import type { Card } from './types/card'

// Modal state
const selectedCard = ref<Card | null>(null)

// Filter state
const searchQuery = ref('')
const sortAsc = ref(true)
const selectedTypes = ref<string[]>([])
const selectedGroups = ref<string[]>([])
const sidebarOpen = ref(false)

// Pagination
const ITEMS_PER_PAGE = 20
const displayCount = ref(ITEMS_PER_PAGE)

// Available options
const availableTypes = computed(() => getCategories())
const availableGroups = computed(() => selectedTypes.value.length ? getGroups(selectedTypes.value) : [])

// Filtered cards (all)
const allFilteredCards = computed(() =>
  filterCards({
    search: searchQuery.value,
    types: selectedTypes.value,
    groups: selectedGroups.value,
    sortAsc: sortAsc.value,
  })
)

// Displayed cards (paginated)
const displayedCards = computed(() => allFilteredCards.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < allFilteredCards.value.length)
const remainingCount = computed(() => allFilteredCards.value.length - displayedCards.value.length)

// Reset display count when filters change
watch([searchQuery, selectedTypes, selectedGroups, sortAsc], () => {
  displayCount.value = ITEMS_PER_PAGE
})

// Clean up selected groups when types change
watch(availableGroups, (newGroups) => {
  selectedGroups.value = selectedGroups.value.filter((g) => newGroups.includes(g))
})

const loadMore = () => {
  displayCount.value += ITEMS_PER_PAGE
}

const resetFilters = () => {
  searchQuery.value = ''
  sortAsc.value = true
  selectedTypes.value = []
  selectedGroups.value = []
  displayCount.value = ITEMS_PER_PAGE
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
          :selectedTypes="selectedTypes"
          :availableTypes="availableTypes"
          :availableGroups="availableGroups"
          :selectedGroups="selectedGroups"
          :isOpen="sidebarOpen"
          @update:searchQuery="searchQuery = $event"
          @update:sortAsc="sortAsc = $event"
          @update:selectedTypes="selectedTypes = $event"
          @update:selectedGroups="selectedGroups = $event"
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
                Showing <span class="font-semibold text-slate-600">{{ displayedCards.length }}</span>
                of <span class="font-semibold text-slate-600">{{ allFilteredCards.length }}</span> cards
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

          <CardGallery :cards="displayedCards" @select-card="selectedCard = $event" />

          <!-- Card Detail Modal -->
          <CardModal :card="selectedCard" @close="selectedCard = null" />

          <!-- Load More button -->
          <div v-if="hasMore" class="flex justify-center mt-10 mb-6">
            <button
              @click="loadMore"
              class="group px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              id="load-more-btn"
            >
              <span class="flex items-center gap-2 p-3!">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Load More
                <span class="text-white/50 font-normal">({{ remainingCount }} remaining)</span>
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>