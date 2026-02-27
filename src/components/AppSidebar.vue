<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  totalCards: number
  searchQuery: string
  sortAsc: boolean
  selectedTypes: string[]
  availableTypes: string[]
  availableGroups: string[]
  selectedGroups: string[]
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortAsc': [value: boolean]
  'update:selectedTypes': [value: string[]]
  'update:selectedGroups': [value: string[]]
  'reset': []
}>()

const toggleType = (type: string) => {
  const current = [...props.selectedTypes]
  const idx = current.indexOf(type)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(type)
  }
  emit('update:selectedTypes', current)
}

// Filter Preset dropdown
const dropdownOpen = ref(false)
const presetSearch = ref('')

const filteredGroups = computed(() => {
  if (!presetSearch.value.trim()) return props.availableGroups
  const q = presetSearch.value.trim().toLowerCase()
  return props.availableGroups.filter((g) => g.toLowerCase().includes(q))
})

const toggleGroup = (group: string) => {
  const current = [...props.selectedGroups]
  const idx = current.indexOf(group)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(group)
  }
  emit('update:selectedGroups', current)
}

const presetLabel = computed(() => {
  if (props.selectedGroups.length === 0) return 'Select groups...'
  if (props.selectedGroups.length === 1) return props.selectedGroups[0]
  return `${props.selectedGroups.length} groups selected`
})

// Close dropdown on click outside
const dropdownRef = ref<HTMLElement | null>(null)
const onClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <nav id="sidebar" class="lg:min-w-[300px] w-max max-lg:min-w-8">
    <div
      id="sidebar-collapse-menu"
      :class="[
        'bg-gradient-to-b p-4! from-stone-50 to-stone-100 h-screen fixed py-4 top-0 left-0 overflow-auto z-[99] lg:min-w-[300px] lg:w-max transition-all duration-500 shadow-xl border-r border-stone-200',
        isOpen ? 'max-lg:w-[300px] max-lg:visible' : 'max-lg:w-0 max-lg:invisible'
      ]"
    >

      <!-- Card Count Badge -->
      <div class="px-5 pt-5! pb-3!">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-800 leading-none">{{ totalCards }}</p>
                <p class="text-[11px] text-blue-600 mt-0.5">Total Cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sort & Reset buttons -->
      <div class="flex gap-2 mb-5!">
        <button
          @click="emit('update:sortAsc', !sortAsc)"
          class="flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {{ sortAsc ? 'A → Z' : 'Z → A' }}
        </button>
        <button
          @click="emit('reset')"
          class="flex-1 flex items-center justify-center gap-1.5 px-2! py-1.5! text-xs font-semibold text-slate-600 bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      <!-- Search -->
      <div class="mb-5!">
        <div class="relative mt-4">
          <input
            type="text"
            :value="searchQuery"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            placeholder=" "
            class="peer w-full px-1 pt-3 pb-2 text-sm text-slate-800 bg-transparent border-0 border-b-2 border-gray-300 rounded-none outline-0 focus:border-blue-500 transition-all duration-200"
            id="search-card-input"
          />
          <label
            for="search-card-input"
            class="absolute left-1 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-gray-500"
          >
            Search card
          </label>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-5! border-t border-gray-200 mb-5!"></div>

      <!-- Category Checkboxes -->
      <div class="mb-5!">
        <h6 class="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-3">Categories</h6>
        <div class="space-y-1">
          <label
            v-for="type in availableTypes"
            :key="type"
            :class="[
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
              selectedTypes.includes(type)
                ? 'bg-blue-50 border border-blue-300'
                : 'hover:bg-gray-100 border border-transparent'
            ]"
          >
            <input
              type="checkbox"
              :checked="selectedTypes.includes(type)"
              @change="toggleType(type)"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer accent-blue-600"
            />
            <span :class="[
              'text-sm font-medium',
              selectedTypes.includes(type) ? 'text-blue-700' : 'text-slate-600'
            ]">{{ type }}</span>
          </label>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-5 border-t border-gray-200 mb-5"></div>

      <!-- Filter Preset Dropdown -->
      <div class="px-5 mb-5">
        <h6 class="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-3">Filter Preset</h6>

        <!-- Hint when no categories selected -->
        <div v-if="availableGroups.length === 0" class="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs text-gray-400">Select a category to see groups</span>
        </div>

        <div v-else class="relative" ref="dropdownRef">
          <!-- Dropdown trigger -->
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="w-full flex items-center justify-between px-2! py-2! text-sm bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-left cursor-pointer"
            id="filter-preset-btn"
          >
            <span :class="selectedGroups.length > 0 ? 'text-slate-800' : 'text-slate-400'" class="truncate text-sm">{{ presetLabel }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200"
              :class="dropdownOpen ? 'rotate-180' : ''"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Selected tags -->
          <div v-if="selectedGroups.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
            <span
              v-for="group in selectedGroups"
              :key="group"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-blue-100 text-blue-700 rounded-lg border border-blue-200"
            >
              {{ group }}
              <button @click="toggleGroup(group)" class="hover:text-blue-900 transition-colors ml-0.5 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>

          <!-- Dropdown panel -->
          <div
            v-show="dropdownOpen"
            class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden flex flex-col"
          >
            <!-- Search inside dropdown -->
            <div class="p-2.5 border-b border-gray-100">
              <input
                type="text"
                v-model="presetSearch"
                placeholder="Search groups..."
                class="w-full text-xs bg-gray-50 text-slate-800 px-3! py-2! rounded-lg border border-gray-200 outline-0 focus:border-blue-400 placeholder:text-slate-400"
                id="preset-search-input"
              />
            </div>
            <!-- Options list -->
            <div class="overflow-y-auto px-3! py-2! flex-1">
              <div v-if="filteredGroups.length === 0" class="px-3 py-6 text-xs text-gray-400 text-center">
                No groups found
              </div>
              <label
                v-for="group in filteredGroups"
                :key="group"
                :class="[
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 text-sm',
                  selectedGroups.includes(group)
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-slate-600 hover:text-slate-800'
                ]"
              >
                <input
                  type="checkbox"
                  :checked="selectedGroups.includes(group)"
                  @change="toggleGroup(group)"
                  class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer accent-blue-600"
                />
                <span>{{ group }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
