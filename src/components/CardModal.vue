<script setup lang="ts">
import type { Card } from '../types/card'
import CardDescription from './CardDescription.vue'
import { ref } from 'vue'

defineProps<{
  card: Card | null
}>()

const emit = defineEmits<{
  'close': []
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

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
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
          <div class="relative bg-gray-100 min-h-[200px]">
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
            <h2 class="text-xl font-bold text-slate-800">{{ card.name }}</h2>
            <p v-if="card.subtitle" class="text-sm text-slate-500 mt-0.5">{{ card.subtitle }}</p>

            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {{ card.type }}
              </span>
              <span class="text-xs text-slate-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                {{ card.group }}
              </span>
              <span class="text-xs text-slate-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                {{ card.set }}
              </span>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-2 mt-3">
              <span v-if="(card.details as any).cost" class="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                💎 Cost: {{ (card.details as any).cost }}
              </span>
              <span v-if="(card.details as any).attack" class="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-100">
                ⚔️ Attack: {{ (card.details as any).attack }}
              </span>
              <span v-if="(card.details as any).vAttack" class="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-100">
                ⚔️ Attack: {{ (card.details as any).vAttack }}
              </span>
              <span v-if="(card.details as any).recruit" class="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                ⭐ Recruit: {{ (card.details as any).recruit }}
              </span>
              <span v-if="(card.details as any).vp" class="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100">
                🏆 VP: {{ (card.details as any).vp }}
              </span>
            </div>

            <!-- Description -->
            <div v-if="card.details.description && card.details.description.length > 0" class="mt-4 pt-3 border-t border-gray-100">
              <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <CardDescription :description="card.details.description" />
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
