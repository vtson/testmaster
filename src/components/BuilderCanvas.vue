<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../types/card'
import CardItem from './CardItem.vue'

// Card slots before position 7
const slotsBefore = [
  'scheme', 'mastermind', 'villain1', 'villain2',
  'henchmenMastermind', 'henchmenScheme'
] as const

// Position 7: divided into 4 vertical sub-slots
const dividedSlots = [
  { key: 'sub7a', label: 'Bystander' },
  { key: 'sub7b', label: 'Shield Officer' },
  { key: 'sub7c', label: 'Sidekick' },
  { key: 'sub7d', label: 'Wound' },
] as const

// Card slots after position 7
const slotsAfter = [
  'hero2', 'hero3', 'hero4', 'hero5', 'hero6'
] as const

// Text-only slots stacked in the last cell
const extrasSlots = [
  'extrasBystander', 'extrasShield', 'extrasSidekick', 'extrasWounds',
] as const

type SlotKey = typeof slotsBefore[number] | typeof dividedSlots[number]['key'] | typeof slotsAfter[number] | typeof extrasSlots[number]
type PrintMode = 'color' | 'grayscale'

const slots = ref<Record<SlotKey, Card | null>>({
  scheme: null,
  mastermind: null,
  villain1: null,
  villain2: null,
  henchmenMastermind: null,
  henchmenScheme: null,
  sub7a: null,
  sub7b: null,
  sub7c: null,
  sub7d: null,
  hero2: null,
  hero3: null,
  hero4: null,
  hero5: null,
  hero6: null,
  extrasBystander: null,
  extrasShield: null,
  extrasSidekick: null,
  extrasWounds: null,
})
const printMode = ref<PrintMode>('color')

const parseDataTransfer = (event: DragEvent): Card | null => {
  try {
    const data = event.dataTransfer?.getData('application/json')
    if (data) return JSON.parse(data) as Card
  } catch (e) {
    console.error('Failed to parse dropped card data', e)
  }
  return null
}

const onDrop = (event: DragEvent, slotKey: string) => {
  const card = parseDataTransfer(event)
  if (card) slots.value[slotKey as SlotKey] = card
}

const clearSlot = (slotKey: string) => {
  slots.value[slotKey as SlotKey] = null
}

const clearAll = () => {
  for (const key of Object.keys(slots.value) as SlotKey[]) {
    slots.value[key] = null
  }
}

const exportPDF = () => {
  window.print()
}
</script>

<template>
  <div class="flex flex-row items-start gap-4 w-full">
    <!-- Action buttons -->
    <div class="builder-controls">
      <label class="print-mode-picker bg-orange-200!">
        <span class="relative top-[1px]">Background</span>
        <select v-model="printMode" aria-label="Select background color">
          <option value="color">Red</option>
          <option value="grayscale">Grayscale</option>
        </select>
      </label>
      <button @click="exportPDF" class="builder-btn builder-btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Export PDF
      </button>
      <button @click="clearAll" class="builder-btn builder-btn-secondary">
        Clear All
      </button>
    </div>

    <!-- Paper: 8.5 x 11 inch Letter -->
    <div
      id="builder-paper"
      :class="[
        'builder-paper shadow-2xl relative flex flex-col',
        { 'print-grayscale': printMode === 'grayscale' }
      ]"
    >
      <!-- Top: Title bar -->
      <div class="title-bar">
        <p class="title-text" contenteditable="true" spellcheck="false">⚔️ SCHEME & STRATEGY GUIDE ⚔️</p>
        <p class="subtitle-text" contenteditable="true" spellcheck="false">Collectible Card Game — Setup & Battle Plan</p>
      </div>

      <!-- Middle: Card grid block with white border (3 rows × 4 cols) -->
      <div class="card-area">
        <div class="builder-grid">
          <!-- Slots before position 7 -->
          <div
            v-for="key in slotsBefore"
            :key="key"
            class="builder-slot"
            @dragover.prevent
            @drop="onDrop($event, key)"
          >
            <CardItem v-if="slots[key]" :card="slots[key]!" isBuilder class="w-full h-full pointer-events-none" />
            <button
              v-if="slots[key]"
              @click="clearSlot(key)"
              class="slot-clear-btn print:hidden"
            >×</button>
          </div>

          <!-- Position 7: divided into 4 vertical sub-sections -->
          <div class="builder-slot divided-slot">
            <div
              v-for="sub in dividedSlots"
              :key="sub.key"
              class="divided-item"
              @dragover.prevent
              @drop="onDrop($event, sub.key)"
            >
              <img
                v-if="slots[sub.key as SlotKey]?.imageUrl"
                :src="slots[sub.key as SlotKey]!.imageUrl"
                :alt="slots[sub.key as SlotKey]!.name"
                class="absolute inset-0 w-full h-full object-cover object-[center_10%]"
              />
              <div class="divided-label">
                <span>{{ slots[sub.key as SlotKey] ? slots[sub.key as SlotKey]!.name : '' }}</span>
              </div>
              <button
                v-if="slots[sub.key as SlotKey]"
                @click="clearSlot(sub.key)"
                class="extras-clear-btn print:hidden"
              >×</button>
            </div>
          </div>

          <!-- Slots after position 7 -->
          <div
            v-for="key in slotsAfter"
            :key="key"
            class="builder-slot"
            @dragover.prevent
            @drop="onDrop($event, key)"
          >
            <CardItem v-if="slots[key]" :card="slots[key]!" isBuilder class="w-full h-full pointer-events-none" />
            <button
              v-if="slots[key]"
              @click="clearSlot(key)"
              class="slot-clear-btn print:hidden"
            >×</button>
          </div>
        </div>
      </div>

      <!-- Bottom: Two large info boxes in one row -->
      <div class="bottom-boxes">
        <div class="info-box">
          <div class="info-box-title-vertical">
            <span>📋 Game Plan</span>
          </div>
          <div class="info-box-content"
            @dragover.prevent
            @drop="onDrop($event, 'scheme')"
            contenteditable="true"
            spellcheck="false"
          >
            Drop scheme card here or write your strategy plan...
          </div>
        </div>
        <div class="info-box">
          <div class="info-box-title-vertical">
            <span>🏆 Game Results</span>
          </div>
          <div class="info-box-content" contenteditable="true" spellcheck="false">
            Record your game results and outcomes here...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.builder-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  margin-top: 16px;
  margin-left: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.print-mode-picker {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  min-height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.print-mode-picker select {
  border: none;
  background: transparent;
  color: #0f172a;
  font-weight: 700;
  padding: 6px 0;
  outline: none;
  font-size: 12px;
}

.builder-btn {
  min-height: 36px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.builder-btn-primary {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

.builder-btn-primary:hover {
  background: #bfdbfe;
  border-color: #60a5fa;
}

.builder-btn-secondary {
  color: #475569;
  background: #f3f4f6;
  border-color: #d1d5db;
}

.builder-btn-secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.builder-paper {
  width: 8.5in;
  height: 11in;
  max-width: 100%;
  aspect-ratio: 8.5 / 11;
  padding: 0.2in;
  background: linear-gradient(160deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 50%, #991b1b 70%, #7f1d1d 100%);
  border: 3px solid #fbbf24;
}
/* Live grayscale preview mode */
.builder-paper.print-grayscale {
  background: #fff;
  border-color: #222;
}

.builder-paper.print-grayscale .title-bar,
.builder-paper.print-grayscale .card-area,
.builder-paper.print-grayscale .builder-slot,
.builder-paper.print-grayscale .divided-slot,
.builder-paper.print-grayscale .divided-item,
.builder-paper.print-grayscale .info-box,
.builder-paper.print-grayscale .info-box-title-vertical,
.builder-paper.print-grayscale .divided-label {
  background: #fff;
}

.builder-paper.print-grayscale .title-bar,
.builder-paper.print-grayscale .card-area,
.builder-paper.print-grayscale .info-box {
  border-color: #222;
}

.builder-paper.print-grayscale .builder-slot,
.builder-paper.print-grayscale .divided-item,
.builder-paper.print-grayscale .divided-slot,
.builder-paper.print-grayscale .info-box-title-vertical {
  border-color: #666;
}

.builder-paper.print-grayscale .title-text,
.builder-paper.print-grayscale .subtitle-text,
.builder-paper.print-grayscale .info-box-title-vertical span,
.builder-paper.print-grayscale .info-box-content,
.builder-paper.print-grayscale .divided-label span {
  color: #111;
  text-shadow: none;
}

.builder-paper.print-grayscale [contenteditable="true"]:hover,
.builder-paper.print-grayscale [contenteditable="true"]:focus {
  background-color: #f8fafc;
  outline-color: #94a3b8;
}

/* ── Title bar ── */
.title-bar {
  text-align: center;
  padding: 0.12in 0.2in;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 8px;
  margin-bottom: 0.12in;
}

.title-text {
  color: #fbbf24;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.subtitle-text {
  color: rgba(255,255,255,0.75);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-top: 2px;
}

/* ── Card area ── */
.card-area {
  flex: 1;
  min-height: 0;
  border: 2px solid white;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0,0,0,0.15);
}

.builder-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.06in;
  width: 100%;
  height: 100%;
  padding: 0.06in;
  justify-items: center;
  align-items: center;
}

.builder-slot {
  aspect-ratio: 5 / 7;
  width: 100%;
  max-height: 100%;
  border: 1px dashed rgba(255,255,255,0.35);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.2s;
}

.builder-slot:hover {
  border-color: white;
  background: rgba(0,0,0,0.25);
}

.slot-clear-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.85);
  border-radius: 50%;
  color: black;
  font-weight: bold;
  font-size: 11px;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  z-index: 10;
}

.slot-clear-btn:hover {
  background: black;
  color: white;
}

/* ── Extras slot ── */
.extras-slot {
  display: grid !important;
  grid-template-rows: repeat(4, 1fr);
  gap: 2px;
  padding: 3px;
}

/* ── Divided slot (position 7) ── */
.divided-slot {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  padding: 2px !important;
  align-items: stretch !important;
  justify-content: space-between !important;
  border: 1px solid rgba(255,255,255,0.5);
}

.divided-item {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: rgba(0,0,0,0.15);
  border: 1px dashed rgba(255,255,255,0.3);
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
}

.divided-item:hover {
  border-color: white;
  background: rgba(0,0,0,0.25);
}

.divided-label {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(0,0,0,0.6);
  padding: 2px 0;
  z-index: 1;
}

.divided-label span {
  color: white;
  font-size: 7px;
  font-weight: 700;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2px;
}

.extras-item {
  border: 1px dashed rgba(255,255,255,0.25);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.2s;
}

.extras-item:hover {
  border-color: white;
  background: rgba(0,0,0,0.2);
}

.extras-clear-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.85);
  border-radius: 50%;
  color: black;
  font-weight: bold;
  font-size: 7px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  z-index: 10;
}

.extras-clear-btn:hover {
  background: black;
  color: white;
}

/* ── Bottom info boxes ── */
.bottom-boxes {
  display: flex;
  gap: 0.12in;
  margin-top: 0.12in;
}

.info-box {
  flex: 1;
  border: 2px solid white;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0,0,0,0.25);
  display: flex;
  flex-direction: row;
}

.info-box-title-vertical {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  background: rgba(0,0,0,0.4);
  border-right: 1px solid rgba(255,255,255,0.3);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.info-box-title-vertical span {
  font-size: 11px;
  font-weight: 800;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.info-box-content {
  padding: 8px 12px;
  min-height: 0.8in;
  color: rgba(255,255,255,0.9);
  font-size: 11px;
  outline: none;
  flex: 1;
  min-width: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

[contenteditable="true"]:hover {
  background-color: rgba(255,255,255,0.05);
  cursor: text;
  border-radius: 4px;
}

[contenteditable="true"]:focus {
  background-color: rgba(0,0,0,0.4);
  outline: 1px dashed rgba(255,255,255,0.4);
}

.info-placeholder {
  color: rgba(255,255,255,0.4);
  font-size: 10px;
  font-style: italic;
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

  #builder-paper.print-grayscale {
    background: #fff !important;
    border-color: #222 !important;
    -webkit-print-color-adjust: economy;
    print-color-adjust: economy;
  }

  #builder-paper.print-grayscale .title-bar,
  #builder-paper.print-grayscale .card-area,
  #builder-paper.print-grayscale .builder-slot,
  #builder-paper.print-grayscale .divided-slot,
  #builder-paper.print-grayscale .divided-item,
  #builder-paper.print-grayscale .info-box,
  #builder-paper.print-grayscale .info-box-title-vertical,
  #builder-paper.print-grayscale .divided-label,
  #builder-paper.print-grayscale [contenteditable="true"]:hover,
  #builder-paper.print-grayscale [contenteditable="true"]:focus {
    background: #fff !important;
  }

  #builder-paper.print-grayscale .title-bar,
  #builder-paper.print-grayscale .card-area,
  #builder-paper.print-grayscale .info-box {
    border-color: #222 !important;
  }

  #builder-paper.print-grayscale .builder-slot,
  #builder-paper.print-grayscale .divided-item,
  #builder-paper.print-grayscale .divided-slot,
  #builder-paper.print-grayscale .info-box-title-vertical {
    border-color: #666 !important;
  }

  #builder-paper.print-grayscale .title-text,
  #builder-paper.print-grayscale .subtitle-text,
  #builder-paper.print-grayscale .info-box-title-vertical span,
  #builder-paper.print-grayscale .info-box-content,
  #builder-paper.print-grayscale .divided-label span {
    color: #111 !important;
    text-shadow: none !important;
  }

  @page {
    size: letter portrait;
    margin: 0;
  }
}
</style>

