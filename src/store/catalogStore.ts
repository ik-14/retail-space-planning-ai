import { create } from 'zustand'
import type { Category, Product } from '../types'
import { products } from '../data/products'

interface CatalogState {
  products: Product[]
  searchQuery: string
  categoryFilter: Category | null
  stagingProductIds: string[]

  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: Category | null) => void
  addToStaging: (productId: string) => void
  removeFromStaging: (productId: string) => void
  clearStaging: () => void
  getFilteredProducts: () => Product[]
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products,
  searchQuery: '',
  categoryFilter: null,
  stagingProductIds: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  addToStaging: (productId) =>
    set((s) => ({
      stagingProductIds: s.stagingProductIds.includes(productId)
        ? s.stagingProductIds
        : [...s.stagingProductIds, productId],
    })),

  removeFromStaging: (productId) =>
    set((s) => ({
      stagingProductIds: s.stagingProductIds.filter((id) => id !== productId),
    })),

  clearStaging: () => set({ stagingProductIds: [] }),

  getFilteredProducts: () => {
    const { products, searchQuery, categoryFilter } = get()
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !categoryFilter || p.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  },
}))
