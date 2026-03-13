<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../types/card'
import CardItem from './CardItem.vue'

// Card slots that show images
const cardSlots = [
  'scheme', 'mastermind', 'villain1', 'villain2',
  'henchmenMastermind', 'henchmenScheme', 'hero1', 'hero2',
  'hero3', 'hero4', 'hero5', 'hero6', 'hero7', 'hero8','hero9'
] as const

// Text-only slots stacked in the last cell
const extrasSlots = [
  'extrasBystander', 'extrasShield', 'extrasSidekick', 'extrasWounds',
] as const

type SlotKey = typeof cardSlots[number] | typeof extrasSlots[number]

const slots = ref<Record<SlotKey, Card | null>>({
  scheme: null,
  mastermind: null,
  villain1: null,
  villain2: null,
  henchmenMastermind: null,
  henchmenScheme: null,
  hero1: null,
  hero2: null,
  hero3: null,
  hero4: null,
  hero5: null,
  hero6: null,
  hero7: null,
  hero8: null,
  hero9: null,
  extrasBystander: null,
  extrasShield: null,
  extrasSidekick: null,
  extrasWounds: null,
})

const parseDataTransfer = (event: DragEvent): Card | null => {
  try {
    const data = event.dataTransfer?.getData('application/json')
    if (data) return JSON.parse(data) as Card
  } catch (e) {
    console.error('Failed to parse dropped card data', e)
  }
  return null
}

const onDrop = (event: DragEvent, slotKey: SlotKey) => {
  const card = parseDataTransfer(event)
  if (card) slots.value[slotKey] = card
}

const clearSlot = (slotKey: SlotKey) => {
  slots.value[slotKey] = null
}

const clearAll = () => {
  for (const key of Object.keys(slots.value) as SlotKey[]) {
    slots.value[key] = null
  }
}

const exportPDF = () => {
  window.print()
}

const getQuantity = (card: Card) => {
  const d = card.details as any
  if (typeof d.qtd === 'number') return d.qtd
  if (card.type === 'Hero' && d.rarity) {
    if (d.rarity === 1) return 5
    if (d.rarity === 2) return 3
    if (d.rarity === 3) return 1
  }
  return 1
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <!-- Action buttons -->
    <div class="mb-4 flex gap-4">
      <button
        @click="exportPDF"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Export PDF
      </button>
      <button
        @click="clearAll"
        class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-bold shadow-sm transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Paper: 8.5 x 11 inch Letter -->
    <div id="builder-paper" class="bg-white shadow-2xl relative" style="width: 8.5in; height: 11in; max-width: 100%; aspect-ratio: 8.5/11; padding: 0.15in;">
      <div class="builder-grid">
        <!-- Card slots: show images -->
        <div
          v-for="key in cardSlots"
          :key="key"
          class="builder-slot border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center relative bg-slate-50 overflow-hidden hover:border-blue-400 hover:bg-blue-50/50"
          @dragover.prevent
          @drop="onDrop($event, key)"
        >
          <CardItem v-if="slots[key]" :card="slots[key]!" isBuilder class="w-full h-full pointer-events-none" />
          <button
            v-if="slots[key]"
            @click="clearSlot(key)"
            class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-white/80 hover:bg-black hover:text-white rounded-full text-black font-bold text-xs backdrop-blur-sm shadow-sm transition-colors z-10 print:hidden"
          >×</button>
        </div>

        <!-- Extras sub-grid: 4 text rows in one cell -->
        <div class="builder-slot border-2 border-dashed border-slate-300 rounded-lg grid grid-rows-4 gap-1 p-1 bg-slate-50/50 overflow-hidden">
          <div
            v-for="key in extrasSlots"
            :key="key"
            class="border border-dashed border-slate-300 rounded flex items-center justify-center relative bg-slate-50 overflow-hidden hover:border-blue-400 hover:bg-blue-50/50"
            @dragover.prevent
            @drop="onDrop($event, key)"
          >
            <div v-if="slots[key]" class="flex flex-col items-center justify-center w-full gap-0.5">
              <span class="text-xs font-bold text-slate-700 text-center px-1 line-clamp-1">{{ slots[key]!.name }}</span>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">x{{ getQuantity(slots[key]!) }}</span>
            </div>
            <button
              v-if="slots[key]"
              @click="clearSlot(key)"
              class="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-white/80 hover:bg-black hover:text-white rounded-full text-black font-bold text-[8px] shadow-sm transition-colors z-10 print:hidden"
            >×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.builder-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.08in;
  width: 100%;
  height: 100%;
  justify-items: center;
  align-items: center;
}

.builder-slot {
  aspect-ratio: 5 / 7;
  width: 100%;
  max-height: 100%;
}
</style>

<style>
/* Global print styles */
@media print {
  body * {
    visibility: hidden;
  }

  #builder-paper, #builder-paper * {
    visibility: visible;
  }

  #builder-paper {
    position: fixed;
    left: 0;
    top: 0;
    margin: 0;
    box-shadow: none !important;
    width: 100% !important;
    height: 100% !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #builder-paper button {
    display: none !important;
  }

  @page {
    size: letter portrait;
    margin: 0;
  }
}
</style>
