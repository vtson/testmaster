<script setup lang="ts">
import type { Card } from '../types/card'
import CardDescription from './CardDescription.vue'
import * as MSData from '@/lib/master-strike-data/dist'

const props = defineProps<{
  card: Card
  isBuilder?: boolean
}>()

const getQuantity = (card: Card) => {
  const d = card.details as any
  if (typeof d.qtd === 'number') return d.qtd
  // Guess logic for heroes based on rarity
  if (card.type === 'Hero' && d.rarity) {
    if (d.rarity === 1) return 5
    if (d.rarity === 2) return 3
    if (d.rarity === 3) return 1
  }
  return 1 // default
}

const emit = defineEmits<{
  'select': [card: Card]
}>()

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(props.card))
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Hero': 'bg-blue-100 text-blue-700 border-blue-200',
    'Villain': 'bg-red-100 text-red-700 border-red-200',
    'Mastermind': 'bg-purple-100 text-purple-700 border-purple-200',
    'Mastermind Tactic': 'bg-purple-50 text-purple-600 border-purple-200',
    'Henchmen': 'bg-orange-100 text-orange-700 border-orange-200',
    'Scheme': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Bystander': 'bg-green-100 text-green-700 border-green-200',
    'Sidekick': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Wound': 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return colors[type] || 'bg-gray-100 text-gray-600 border-gray-200'
}

// Hero class ID → background color (from heroClasses.js)
const hcColors: Record<number, string> = {}
for (const hc of MSData.Metadata.heroClassesArray) {
  hcColors[hc.id] = hc.bgColor
}

// Hero class ID → ring/hover color classes
const hcRingClasses: Record<number, string> = {
  1: 'ring-pink-200/60 hover:ring-pink-400/50',
  2: 'ring-yellow-200/60 hover:ring-yellow-400/50',
  3: 'ring-blue-200/60 hover:ring-blue-400/50',
  4: 'ring-green-200/60 hover:ring-green-400/50',
  5: 'ring-gray-300/60 hover:ring-gray-400/50',
}

// Extract hero class IDs from card (handles normal and divided cards)
const getHeroClassIds = (card: Card): { hc1: number; hc2?: number } | null => {
  const d = card.details as any
  if (card.type !== 'Hero') return null

  // Normal card: hc directly on details
  if (typeof d.hc === 'number' && d.hc > 0) {
    return { hc1: d.hc, hc2: typeof d.hc2 === 'number' && d.hc2 > 0 ? d.hc2 : undefined }
  }

  // Divided card: get hc from half1 and half2
  if (d.half1 || d.half2) {
    const h1 = typeof d.half1?.hc === 'number' ? d.half1.hc : 0
    const h2 = typeof d.half2?.hc === 'number' ? d.half2.hc : 0
    if (h1 > 0) {
      return { hc1: h1, hc2: h2 > 0 && h2 !== h1 ? h2 : undefined }
    }
    if (h2 > 0) {
      return { hc1: h2 }
    }
  }

  return null
}

const getContrastTextColor = (hexColor: string) => {
  if (!hexColor) return 'text-slate-800'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? 'text-slate-800' : 'text-white'
}

const getCardTextClass = (card: Card) => {
  const hcIds = getHeroClassIds(card)
  if (!hcIds) return 'text-slate-800'
  
  const color1 = hcColors[hcIds.hc1] || '#ffffff'
  return getContrastTextColor(color1)
}

const getCardSubtitleClass = (card: Card) => {
  const hcIds = getHeroClassIds(card)
  if (!hcIds) return 'text-slate-400'
  
  const color1 = hcColors[hcIds.hc1] || '#ffffff'
  return getContrastTextColor(color1) === 'text-white' ? 'text-slate-200' : 'text-slate-500'
}

const getCardStyle = (card: Card) => {
  const hcIds = getHeroClassIds(card)
  if (!hcIds) return {}

  const color1 = hcColors[hcIds.hc1] || '#ffffff'
  if (hcIds.hc2 && hcColors[hcIds.hc2]) {
    const color2 = hcColors[hcIds.hc2]
    return { background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` }
  }
  return { backgroundColor: color1 }
}

const getCardClasses = (card: Card) => {
  const hcIds = getHeroClassIds(card)
  if (hcIds) {
    const ringCls = hcRingClasses[hcIds.hc1] || 'ring-black/5 hover:ring-blue-400/40'
    return ringCls
  }
  // Non-hero cards: use type-based bg
  const bgs: Record<string, string> = {
    'Villain': 'bg-red-50/80 ring-red-200/50 hover:ring-red-400/40',
    'Mastermind': 'bg-purple-50/80 ring-purple-200/50 hover:ring-purple-400/40',
    'Mastermind Tactic': 'bg-purple-50/60 ring-purple-200/50 hover:ring-purple-400/40',
    'Henchmen': 'bg-orange-50/80 ring-orange-200/50 hover:ring-orange-400/40',
    'Scheme': 'bg-yellow-50/80 ring-yellow-200/50 hover:ring-yellow-400/40',
    'Bystander': 'bg-green-50/80 ring-green-200/50 hover:ring-green-400/40',
    'Sidekick': 'bg-cyan-50/80 ring-cyan-200/50 hover:ring-cyan-400/40',
    'Wound': 'bg-stone-100/80 ring-stone-200/50 hover:ring-stone-400/40',
  }
  return bgs[card.type] || 'bg-white ring-black/5 hover:ring-blue-400/40'
}

</script>

<template>
  <div
    v-if="!isBuilder"
    draggable="true"
    @dragstart="onDragStart"
    @click="$emit('select', card)"
    class="break-inside-avoid mb-4! group cursor-pointer"
  >
    <div
      :class="['relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg ring-1 transition-all duration-300 hover:-translate-y-0.5 p-4!', getCardClasses(card)]"
      :style="getCardStyle(card)"
    >
      <!-- Type badge -->
      <div class="flex items-center justify-between mb-2.5">
        <span :class="['text-[10px] font-bold uppercase tracking-wider px-2! py-0.5! rounded-md border', getTypeColor(card.type)]">
          {{ card.type }}
        </span>
        <span v-if="(card.details as any).cost" class="text-xs font-bold text-blue-600 bg-blue-50 px-2! py-0.5! rounded-md">
          💎 {{ (card.details as any).cost }}
        </span>
      </div>

      <!-- Card name & subtitle -->
      <h4 :class="['text-sm font-bold leading-snug transition-colors', getCardTextClass(card), getCardTextClass(card) === 'text-white' ? 'group-hover:text-blue-200' : 'group-hover:text-blue-600']">{{ card.name }}</h4>
      <p v-if="card.subtitle" :class="['text-xs mt-0.5 truncate', getCardSubtitleClass(card)]">{{ card.subtitle }}</p>

      <!-- Group & Set -->
      <div class="flex items-center gap-1.5 mt-2">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        <p :class="['text-[11px] truncate', getCardTextClass(card) === 'text-white' ? 'text-slate-200' : 'text-slate-500']">{{ card.group }}</p>
        <span :class="['text-[11px]', getCardTextClass(card) === 'text-white' ? 'text-slate-100' : 'text-slate-300']">·</span>
        <p :class="['text-[11px] font-medium truncate', getCardTextClass(card) === 'text-white' ? 'text-slate-100' : 'text-slate-600']">{{ card.set }}</p>
      </div>

      <!-- Stats row (normal cards) -->
      <div v-if="!(card.details as any).half1" class="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <span v-if="(card.details as any).attack" class="inline-flex items-center px-1.5! py-0.5! rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
          ⚔️ {{ (card.details as any).attack }}
        </span>
        <span v-if="(card.details as any).vAttack" class="inline-flex items-center px-1.5! py-0.5! rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
          ⚔️ {{ (card.details as any).vAttack }}
        </span>
        <span v-if="(card.details as any).recruit" class="inline-flex items-center px-1.5! py-0.5! rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          ⭐ {{ (card.details as any).recruit }}
        </span>
        <span v-if="(card.details as any).vp" class="inline-flex items-center px-1.5! py-0.5! rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
          🏆 {{ (card.details as any).vp }}
        </span>
        <span v-if="(card.details as any).hc" class="inline-flex items-center px-1.5! py-0.5! rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
          HC {{ (card.details as any).hc }}
        </span>
      </div>

      <!-- Description (normal cards) -->
      <div v-if="!(card.details as any).half1 && card.details.description && card.details.description.length > 0" class="mt-2.5 pt-2">
        <CardDescription :description="card.details.description" :compact="true" :textColor="getCardTextClass(card) === 'text-white' ? 'light' : 'dark'" />
      </div>

      <!-- Divided Card halves -->
      <div v-if="(card.details as any).half1" class="mt-2.5 pt-2 space-y-1.5">
        <!-- Half 1 -->
        <div class="p-1.5 rounded-lg bg-white/40 border border-white/60 p-5! my-2!">
          <div class="flex items-center gap-1">
            <span :class="['text-[10px] font-bold', getCardTextClass(card) === 'text-white' ? 'text-slate-800' : 'text-slate-600']">{{ (card.details as any).nameHalf1 }}</span>
            <span v-if="(card.details as any).half1.attack" class="text-[9px] font-bold text-red-600">⚔️{{ (card.details as any).half1.attack }}</span>
            <span v-if="(card.details as any).half1.recruit" class="text-[9px] font-bold text-emerald-600">⭐{{ (card.details as any).half1.recruit }}</span>
          </div>
          <div v-if="(card.details as any).half1.description && (card.details as any).half1.description.length > 0" class="mt-0.5">
            <CardDescription :description="(card.details as any).half1.description" :compact="true" :textColor="getCardTextClass(card) === 'text-white' ? 'light' : 'dark'" />
          </div>
        </div>
        <!-- Half 2 -->
        <div class="p-1.5 rounded-lg bg-white/40 border border-white/60 p-5! my-2!">
          <div class="flex items-center gap-1">
            <span :class="['text-[10px] font-bold', getCardTextClass(card) === 'text-white' ? 'text-slate-800' : 'text-slate-600']">{{ (card.details as any).nameHalf2 }}</span>
            <span v-if="(card.details as any).half2.attack" class="text-[9px] font-bold text-red-600">⚔️{{ (card.details as any).half2.attack }}</span>
            <span v-if="(card.details as any).half2.recruit" class="text-[9px] font-bold text-emerald-600">⭐{{ (card.details as any).half2.recruit }}</span>
          </div>
          <div v-if="(card.details as any).half2.description && (card.details as any).half2.description.length > 0" class="mt-0.5">
            <CardDescription :description="(card.details as any).half2.description" :compact="true" :textColor="getCardTextClass(card) === 'text-white' ? 'light' : 'dark'" />
          </div>
        </div>
      </div>

      <div class="mt-3 pt-2.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" :class="['w-3 h-3', getCardTextClass(card) === 'text-white' ? 'text-blue-200' : 'text-blue-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span :class="['text-[10px] font-medium', getCardTextClass(card) === 'text-white' ? 'text-blue-200' : 'text-blue-400']">Click to view</span>
      </div>
    </div>
  </div>

  <!-- Builder Mode Compact View -->
  <div
    v-else
    @click="$emit('select', card)"
    class="relative rounded-lg overflow-hidden shadow-md cursor-pointer border border-slate-300 group builder-card w-full h-full"
    style="background-color: #1e293b;"
  >
    <!-- Card image (same source as CardModal: card.imageUrl) -->
    <img
      v-if="card.imageUrl"
      :src="card.imageUrl"
      :alt="card.name"
      class="absolute inset-0 w-full h-full object-contain"
    />

    <!-- Dark gradient overlay for text readability -->
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
  </div>
</template>

<style scoped>
/* Ensure builder card backgrounds print properly */
@media print {
  .builder-card {
    border-color: #000 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
