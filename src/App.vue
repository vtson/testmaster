<script setup lang="ts">
import { ref } from 'vue'
import { searchCards } from './services/cardSearch'
import type { Card } from './types/card'

const query = ref('')
const results = ref<Card[]>([])
const isLoading = ref(false)

const handleSearch = async () => {
  if (!query.value.trim()) return
  isLoading.value = true
  try {
    results.value = await searchCards(query.value)
  } catch (error) {
    console.error("Lỗi:", error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Hàm Parser xử lý dữ liệu phức tạp của Master-Strike
 * Chuyển đổi [ "text", {bold: "..."}, {icon: 1} ] thành chuỗi hiển thị
 */
const parseDescriptionPart = (part: any) => {
  if (typeof part === 'string') return part;
  if (part.bold) return part.bold;
  if (part.text) return part.text;
  if (part.icon) return `[Icon ${part.icon}]`; // Có thể thay bằng component Icon sau
  return '';
}
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Master-Strike Modern</h1>
      <div class="search-box">
        <input 
          v-model="query" 
          @keyup.enter="handleSearch"
          placeholder="Tìm tên lá bài (vd: Mentallo)..."
        />
        <button @click="handleSearch" :disabled="isLoading">
          {{ isLoading ? '...' : 'Search' }}
        </button>
      </div>
    </header>

    <div class="results-grid">
      <div v-for="card in results" :key="card.name" class="card-item">
        <div class="card-image-wrapper">
          <img :src="card.imageUrl" :alt="card.name" />
        </div>
        
        <div class="card-content">
          <h2 class="card-name">{{ card.name }}</h2>
          <p class="card-subtitle">{{ card.subtitle }}</p>

          <div class="card-stats">
            <div class="stat-badge attack">⚔️ {{ card.details.vAttack }}</div>
            <div class="stat-badge vp">🏆 {{ card.details.vp }} VP</div>
          </div>

          <div class="card-description">
            <p v-for="(line, i) in card.details.description" :key="i">
              <template v-for="(part, j) in line" :key="j">
                <strong v-if="typeof part === 'object' && part.bold">{{ part.bold }}</strong>
                <span v-else>{{ parseDescriptionPart(part) }}</span>
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container { max-width: 1000px; margin: 0 auto; padding: 20px; text-align: center; }
.search-box { display: flex; gap: 10px; margin: 20px 0; }
input { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #ddd; }
button { padding: 0 20px; background: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; }

.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
.card-item { border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; }

.card-image-wrapper img { width: 100%; height: auto; display: block; }
.card-content { padding: 15px; text-align: left; }
.card-name { margin: 0; font-size: 1.4rem; color: #2c3e50; }
.card-subtitle { color: #666; font-size: 0.9rem; font-style: italic; margin-bottom: 15px; }

.card-stats { display: flex; gap: 10px; margin-bottom: 15px; }
.stat-badge { padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 0.9rem; }
.attack { background: #fee2e2; color: #dc2626; }
.vp { background: #fef3c7; color: #d97706; }

.card-description { font-size: 0.85rem; color: #444; border-top: 1px solid #f0f0f0; padding-top: 10px; }
.card-description p { margin: 0 0 8px 0; line-height: 1.4; }
</style>