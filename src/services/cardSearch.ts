// src/services/cardSearch.ts
import { CardSearchEngine } from '@master-strike/data'

const searchEngine = new CardSearchEngine()

export async function searchCards(query: string) {
  return searchEngine.search(query)
}