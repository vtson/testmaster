<script setup lang="ts">
import type { Card } from '../types/card'
import CardDescription from './CardDescription.vue'
import { ref, watch } from 'vue'
import * as MSData from '@/lib/master-strike-data/dist'

const props = defineProps<{
  card: Card | null
}>()

const emit = defineEmits<{
  'close': []
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

// Reset image state when card changes
watch(() => props.card, () => {
  imageLoaded.value = false
  imageError.value = false
})

const onImageLoad = () => {
  imageLoaded.value = true
}

const onImageError = () => {
  imageError.value = true
}

const closeOnBackdrop = (e: MouseEvent) => {
  if ((e.target as HTMLElement).id === 'card-modal-backdrop') {
    emit('close')
  }
}

// Hero class ID → background color (from heroClasses.js)
const hcColors: Record<number, string> = {}
for (const hc of MSData.Metadata.heroClassesArray) {
  hcColors[hc.id] = hc.bgColor
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

const getHeroClassIds = (card: Card): { hc1: number; hc2?: number } | null => {
  const d = card.details as any
  if (card.type !== 'Hero') return null
  if (typeof d.hc === 'number' && d.hc > 0) {
    return { hc1: d.hc, hc2: typeof d.hc2 === 'number' && d.hc2 > 0 ? d.hc2 : undefined }
  }
  if (d.half1 || d.half2) {
    const h1 = typeof d.half1?.hc === 'number' ? d.half1.hc : 0
    const h2 = typeof d.half2?.hc === 'number' ? d.half2.hc : 0
    if (h1 > 0) return { hc1: h1, hc2: h2 > 0 && h2 !== h1 ? h2 : undefined }
    if (h2 > 0) return { hc1: h2 }
  }
  return null
}

const getModalStyle = (card: Card) => {
  const hcIds = getHeroClassIds(card)
  if (!hcIds) return {}
  const color1 = hcColors[hcIds.hc1] || '#ffffff'
  if (hcIds.hc2 && hcColors[hcIds.hc2]) {
    const color2 = hcColors[hcIds.hc2]
    return { background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` }
  }
  return { backgroundColor: color1 }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="card"
        id="card-modal-backdrop"
        @click="closeOnBackdrop"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <div
          class="relative rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          :style="{ ...getModalStyle(card), ...(getHeroClassIds(card) ? {} : { backgroundColor: 'white' }) }"
        >
          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image area -->
          <div class="relative bg-gray-100 min-h-[200px] rounded-t-2xl overflow-hidden">
            <!-- Loading spinner -->
            <div v-if="!imageLoaded && !imageError" class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <!-- Actual image -->
            <img
              v-show="imageLoaded"
              :src="card.imageUrl"
              :alt="card.name"
              @load="onImageLoad"
              @error="onImageError"
              class="w-full h-auto"
            />
          </div>

          <!-- Card details -->
          <div class="p-5!">
            <h2 :class="['text-xl font-bold', getCardTextClass(card)]">{{ card.name }}</h2>
            <p v-if="card.subtitle" :class="['text-sm mt-0.5', getCardTextClass(card) === 'text-white' ? 'text-slate-200' : 'text-slate-500']">{{ card.subtitle }}</p>

            <div class="flex flex-wrap items-center gap-2! mt-3!">
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5! py-1! rounded-lg border border-blue-100">
                {{ card.type }}
              </span>
              <span :class="['text-xs px-2.5! py-1! rounded-lg border border-white/80 bg-white/60', getCardTextClass(card) === 'text-white' ? 'text-slate-800 font-medium' : 'text-slate-500']">
                {{ card.group }}
              </span>
              <span :class="['text-xs px-2.5! py-1! rounded-lg border border-white/80 bg-white/60', getCardTextClass(card) === 'text-white' ? 'text-slate-800 font-medium' : 'text-slate-400']">
                {{ card.set }}
              </span>
            </div>

            <!-- Stats (normal cards) -->
            <div v-if="!(card.details as any).half1" class="flex flex-wrap gap-2! mt-3!">
              <span v-if="(card.details as any).cost" class="text-xs font-bold bg-blue-50 text-blue-700 px-2.5! py-1! rounded-lg border border-blue-100">
                💎 Cost: {{ (card.details as any).cost }}
              </span>
              <span v-if="(card.details as any).attack" class="text-xs font-bold bg-red-50 text-red-700 px-2.5! py-1! rounded-lg border border-red-100">
                ⚔️ Attack: {{ (card.details as any).attack }}
              </span>
              <span v-if="(card.details as any).vAttack" class="text-xs font-bold bg-red-50 text-red-700 px-2.5! py-1! rounded-lg border border-red-100">
                ⚔️ Attack: {{ (card.details as any).vAttack }}
              </span>
              <span v-if="(card.details as any).recruit" class="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5! py-1! rounded-lg border border-emerald-100">
                ⭐ Recruit: {{ (card.details as any).recruit }}
              </span>
              <span v-if="(card.details as any).vp" class="text-xs font-bold bg-amber-50 text-amber-700 px-2.5! py-1! rounded-lg border border-amber-100">
                🏆 VP: {{ (card.details as any).vp }}
              </span>
            </div>

            <!-- Description (normal cards) -->
            <div v-if="!(card.details as any).half1 && card.details.description && card.details.description.length > 0" class="mt-4 pt-3">
              <h3 :class="['text-xs font-semibold uppercase tracking-wider mb-2', getCardTextClass(card) === 'text-white' ? 'text-slate-300' : 'text-slate-500']">Description</h3>
              <CardDescription :description="card.details.description" :textColor="getCardTextClass(card) === 'text-white' ? 'light' : 'dark'" />
            </div>

            <!-- Divided Card: show both halves -->
            <div v-if="(card.details as any).half1" class="mt-4 space-y-3">
              <!-- Half 1 -->
              <div class="p-3 rounded-xl bg-white/50 border border-white/70 p-5! my-2!">
                <h3 :class="['text-sm font-bold', getCardTextClass(card) === 'text-white' ? 'text-slate-800' : 'text-slate-700']">{{ (card.details as any).nameHalf1 }}</h3>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span v-if="(card.details as any).half1.cost" class="text-[10px] font-bold bg-blue-50 text-blue-700 px-2! py-0.5! rounded-md border border-blue-200">
                    💎 {{ (card.details as any).half1.cost }}
                  </span>
                  <span v-if="(card.details as any).half1.attack" class="text-[10px] font-bold bg-red-50 text-red-700 px-2! py-0.5! rounded-md border border-red-200">
                    ⚔️ {{ (card.details as any).half1.attack }}
                  </span>
                  <span v-if="(card.details as any).half1.recruit" class="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2! py-0.5! rounded-md border border-emerald-200">
                    ⭐ {{ (card.details as any).half1.recruit }}
                  </span>
                </div>
                <div v-if="(card.details as any).half1.description && (card.details as any).half1.description.length > 0" class="mt-2">
                  <CardDescription :description="(card.details as any).half1.description" :compact="true" :textColor="'dark'" />
                </div>
              </div>

              <!-- Divider -->
              <div class="flex items-center gap-2">
                <div class="flex-1 h-px bg-gray-300/40"></div>
                <span class="text-xs font-bold text-slate-400 tracking-wider">÷</span>
                <div class="flex-1 h-px bg-gray-300/40"></div>
              </div>

              <!-- Half 2 -->
              <div class="p-3 rounded-xl bg-white/50 border border-white/70 p-5! my-2!">
                <h3 :class="['text-sm font-bold', getCardTextClass(card) === 'text-white' ? 'text-slate-800' : 'text-slate-700']">{{ (card.details as any).nameHalf2 }}</h3>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span v-if="(card.details as any).half2.cost" class="text-[10px] font-bold bg-blue-50 text-blue-700 px-2! py-0.5! rounded-md border border-blue-200">
                    💎 {{ (card.details as any).half2.cost }}
                  </span>
                  <span v-if="(card.details as any).half2.attack" class="text-[10px] font-bold bg-red-50 text-red-700 px-2! py-0.5! rounded-md border border-red-200">
                    ⚔️ {{ (card.details as any).half2.attack }}
                  </span>
                  <span v-if="(card.details as any).half2.recruit" class="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2! py-0.5! rounded-md border border-emerald-200">
                    ⭐ {{ (card.details as any).half2.recruit }}
                  </span>
                </div>
                <div v-if="(card.details as any).half2.description && (card.details as any).half2.description.length > 0" class="mt-2">
                  <CardDescription :description="(card.details as any).half2.description" :compact="true" :textColor="'dark'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95);
}
</style>
