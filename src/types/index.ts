export type Category = 'beverages' | 'snacks' | 'suncare' | 'household' | 'ice_cream' | 'fresh'

export const CATEGORIES: Category[] = ['beverages', 'snacks', 'suncare', 'household', 'ice_cream', 'fresh']

export interface Product {
  id: string
  name: string
  category: Category
  color: string
  width: number
  height: number
  depth: number
  imageUrl?: string
}

export interface Placement {
  id: string
  productId: string
  shelfId: string
  position: number
  facings: number
}

export interface Shelf {
  id: string
  bayId: string
  order: number
  slots: number
}

export interface Bay {
  id: string
  order: number
}

export interface Planogram {
  id: string
  name: string
  bays: Bay[]
  shelves: Shelf[]
  placements: Placement[]
  createdAt: number
  updatedAt: number
}

export interface PlanogramSummary {
  id: string
  name: string
  updatedAt: number
}

export interface StoreProfile {
  id: string
  name: string
  description: string
  categoryWeights: Record<Category, number>
}
