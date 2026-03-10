<script setup lang="ts">
import type { Card } from '../types/card'
import CardDescription from './CardDescription.vue'

defineProps<{
  card: Card
}>()

defineEmits<{
  'select': [card: Card]
}>()

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

const getCardBg = (type: string) => {
  const bgs: Record<string, string> = {
    'Hero': 'bg-blue-50/80 ring-blue-200/50 hover:ring-blue-400/40',
    'Villain': 'bg-red-50/80 ring-red-200/50 hover:ring-red-400/40',
    'Mastermind': 'bg-purple-50/80 ring-purple-200/50 hover:ring-purple-400/40',
    'Mastermind Tactic': 'bg-purple-50/60 ring-purple-200/50 hover:ring-purple-400/40',
    'Henchmen': 'bg-orange-50/80 ring-orange-200/50 hover:ring-orange-400/40',
    'Scheme': 'bg-yellow-50/80 ring-yellow-200/50 hover:ring-yellow-400/40',
    'Bystander': 'bg-green-50/80 ring-green-200/50 hover:ring-green-400/40',
    'Sidekick': 'bg-cyan-50/80 ring-cyan-200/50 hover:ring-cyan-400/40',
    'Wound': 'bg-stone-100/80 ring-stone-200/50 hover:ring-stone-400/40',
  }
  return bgs[type] || 'bg-white ring-black/5 hover:ring-blue-400/40'
}

</script>

<template>
  <div
    @click="$emit('select', card)"
    class="break-inside-avoid mb-4! group cursor-pointer"
  >
    <div :class="['relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg ring-1 transition-all duration-300 hover:-translate-y-0.5 p-4!', getCardBg(card.type)]">
      <!-- Type badge -->
      <div class="flex items-center justify-between mb-2.5">
        <span :class="['text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border', getTypeColor(card.type)]">
          {{ card.type }}
        </span>
        <span v-if="(card.details as any).cost" class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          💎 {{ (card.details as any).cost }}
        </span>
      </div>

      <!-- Card name & subtitle -->
      <h4 class="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">{{ card.name }}</h4>
      <p v-if="card.subtitle" class="text-xs text-slate-400 mt-0.5 truncate">{{ card.subtitle }}</p>

      <!-- Group & Set -->
      <div class="flex items-center gap-1.5 mt-2">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        <p class="text-[11px] text-slate-500 truncate">{{ card.group }}</p>
        <span class="text-slate-300 text-[11px]">·</span>
        <p class="text-[11px] text-slate-400 truncate">{{ card.set }}</p>
      </div>

      <!-- Stats row (normal cards) -->
      <div v-if="!(card.details as any).half1" class="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <span v-if="(card.details as any).attack" class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
          ⚔️ {{ (card.details as any).attack }}
        </span>
        <span v-if="(card.details as any).vAttack" class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
          ⚔️ {{ (card.details as any).vAttack }}
        </span>
        <span v-if="(card.details as any).recruit" class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          ⭐ {{ (card.details as any).recruit }}
        </span>
        <span v-if="(card.details as any).vp" class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
          🏆 {{ (card.details as any).vp }}
        </span>
        <span v-if="(card.details as any).hc" class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
          HC {{ (card.details as any).hc }}
        </span>
      </div>

      <!-- Description (normal cards) -->
      <div v-if="!(card.details as any).half1 && card.details.description && card.details.description.length > 0" class="mt-2.5 pt-2 border-t border-gray-100">
        <CardDescription :description="card.details.description" :compact="true" />
      </div>

      <!-- Divided Card halves -->
      <div v-if="(card.details as any).half1" class="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5">
        <!-- Half 1 -->
        <div class="p-1.5 rounded-lg bg-blue-50/60 border border-blue-100 p-5! my-2!">
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-bold text-slate-600">{{ (card.details as any).nameHalf1 }}</span>
            <span v-if="(card.details as any).half1.attack" class="text-[9px] font-bold text-red-600">⚔️{{ (card.details as any).half1.attack }}</span>
            <span v-if="(card.details as any).half1.recruit" class="text-[9px] font-bold text-emerald-600">⭐{{ (card.details as any).half1.recruit }}</span>
          </div>
          <div v-if="(card.details as any).half1.description && (card.details as any).half1.description.length > 0" class="mt-0.5">
            <CardDescription :description="(card.details as any).half1.description" :compact="true" />
          </div>
        </div>
        <!-- Half 2 -->
        <div class="p-1.5 rounded-lg bg-amber-50/60 border border-amber-100 p-5! my-2!">
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-bold text-slate-600">{{ (card.details as any).nameHalf2 }}</span>
            <span v-if="(card.details as any).half2.attack" class="text-[9px] font-bold text-red-600">⚔️{{ (card.details as any).half2.attack }}</span>
            <span v-if="(card.details as any).half2.recruit" class="text-[9px] font-bold text-emerald-600">⭐{{ (card.details as any).half2.recruit }}</span>
          </div>
          <div v-if="(card.details as any).half2.description && (card.details as any).half2.description.length > 0" class="mt-0.5">
            <CardDescription :description="(card.details as any).half2.description" :compact="true" />
          </div>
        </div>
      </div>

      <!-- Click hint -->
      <div class="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span class="text-[10px] text-blue-400 font-medium">Click to view</span>
      </div>
    </div>
  </div>
</template>
