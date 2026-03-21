<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Card } from '../types/card'
import CardItem from './CardItem.vue'
import { getSetIcon } from '../services/cardData'

const props = defineProps<{
  cards: Card[]
  isBuilderOpen?: boolean
}>()

defineEmits<{
  'select-card': [card: Card]
}>()

const GROUPS_PER_BATCH = 5

// Group structure: { groupName, setName, setIcon, cards }
interface CardGroup {
  groupName: string
  setName: string
  setIcon?: string
  cards: Card[]
}

const groupedCards = computed(() => {
  // Group by group+set combination to keep same-named groups from different sets separate
  const groupMap = new Map<string, CardGroup>()
  for (const card of props.cards) {
    const groupName = (card.type === 'Scheme' || card.type === 'Henchmen') ? card.type : (card.group || 'Other')
    const setName = card.set || 'Unknown Set'
    const key = `${groupName}|${setName}`
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        groupName,
        setName,
        setIcon: getSetIcon(setName) || undefined,
        cards: [],
      })
    }
    groupMap.get(key)!.cards.push(card)
  }
  return [...groupMap.values()]
})

// Lazy loading: show groups progressively
const visibleCount = ref(GROUPS_PER_BATCH)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const visibleGroups = computed(() => groupedCards.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < groupedCards.value.length)

// Reset visible count when cards/filters change
watch(() => props.cards, () => {
  visibleCount.value = GROUPS_PER_BATCH
})

const loadMore = () => {
  visibleCount.value = Math.min(visibleCount.value + GROUPS_PER_BATCH, groupedCards.value.length)
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && hasMore.value) {
      loadMore()
      // Re-observe after DOM updates
      nextTick(() => {
        if (sentinel.value) {
          observer?.observe(sentinel.value)
        }
      })
    }
  }, { rootMargin: '200px' })

  // Watch for sentinel element
  watch(sentinel, (el) => {
    if (el) observer?.observe(el)
  }, { immediate: true })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div v-if="cards.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-lg font-semibold text-gray-400">No cards found</h3>
    <p class="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
  </div>

  <div v-else>
    <div v-for="g in visibleGroups" :key="`${g.groupName}|${g.setName}`" class="mb-8 mt-8!">
      <!-- Group header -->
      <div class="flex items-center gap-3 mb-4 px-4!">
        <!-- Left: group name -->
        <div class="flex items-center gap-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <h2 class="text-lg font-bold text-slate-700">{{ g.groupName }}</h2>
        </div>
        <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {{ g.cards.length }}
        </span>
        <div class="flex-1 border-t border-slate-200/60"></div>
        <!-- Right: origin set -->
        <div class="flex items-center gap-1.5 shrink-0">
          <img v-if="g.setIcon" :src="g.setIcon" class="w-10 h-10 opacity-60" />
          <span class="text-xs font-medium text-slate-400">{{ g.setName }}</span>
        </div>
      </div>

      <!-- Cards grid -->
      <div :class="[isBuilderOpen ? 'columns-1 gap-2 px-2!' : 'card-grid columns-2 md:columns-3 lg:columns-4 gap-4 px-4!']">
        <CardItem
          class="mb-4!"
          v-for="card in g.cards"
          :key="`${card.name}-${card.group}-${card.set}`"
          :card="card"
          @select="$emit('select-card', $event)"
        />
      </div>
    </div>

    <!-- Scroll sentinel for infinite loading -->
    <div v-if="hasMore" ref="sentinel" class="flex justify-center py-8">
      <div class="flex items-center gap-2 text-slate-400">
        <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="text-sm font-medium">Loading more groups...</span>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1904px) {
  .card-grid {
    columns: 5;
  }
}
</style>
