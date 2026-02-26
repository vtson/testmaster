<script setup lang="ts">
import type { Card } from '../types/card'
import CardItem from './CardItem.vue'

defineProps<{
  cards: Card[]
}>()

defineEmits<{
  'select-card': [card: Card]
}>()

</script>

<template>
  <div v-if="cards.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-lg font-semibold text-gray-400">No cards found</h3>
    <p class="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
  </div>

  <div v-else class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 p-4!">
    <CardItem
      class="mb-4!"
      v-for="card in cards"
      :key="`${card.name}-${card.group}-${card.set}`"
      :card="card"
      @select="$emit('select-card', $event)"
    />
  </div>
</template>
