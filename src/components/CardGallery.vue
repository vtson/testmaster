<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Card } from '../types/card'
import CardItem from './CardItem.vue'

const props = defineProps<{
  cards: Card[]
}>()

defineEmits<{
  'select-card': [card: Card]
}>()

const GROUPS_PER_BATCH = 5

const groupedCards = computed(() => {
  const groups = new Map<string, Card[]>()
  for (const card of props.cards) {
    const key = (card.type === 'Scheme' || card.type === 'Henchmen') ? card.type : (card.group || 'Other')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(card)
  }
  return [...groups.entries()]
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
    <div v-for="[group, groupCards] in visibleGroups" :key="group" class="mb-8 mt-8!">
      <!-- Group header -->
      <div class="flex items-center gap-3 mb-4 px-4!">
        <div class="flex items-center gap-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <h2 class="text-lg font-bold text-slate-700">{{ group }}</h2>
        </div>
        <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {{ groupCards.length }}
        </span>
        <div class="flex-1 border-t border-slate-200/60"></div>
      </div>

      <!-- Cards grid -->
      <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 px-4!">
        <CardItem
          class="mb-4!"
          v-for="card in groupCards"
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
