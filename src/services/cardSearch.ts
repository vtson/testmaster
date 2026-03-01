// src/services/cardSearch.ts
import { } from '@/lib/master-strike-data/dist'

const searchEngine = new CardSearchEngine()

export async function searchCards(query: string) {
  return searchEngine.search(query)
}