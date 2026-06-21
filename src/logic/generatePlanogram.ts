import type { Category, Placement, Product, Shelf, StoreProfile } from '../types'

const CATEGORY_SHELF_PRIORITY: Category[] = [
  'household',
  'beverages',
  'ice_cream',
  'snacks',
  'fresh',
  'suncare',
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function generatePlanogram(
  profile: StoreProfile,
  allProducts: Product[],
  shelves: Shelf[]
): Placement[] {
  const totalSlots = shelves.reduce((sum, s) => sum + s.slots, 0)
  const placements: Placement[] = []

  const sortedCategories = Object.entries(profile.categoryWeights)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat as Category)

  const categorySlots: Record<string, number> = {}
  for (const cat of sortedCategories) {
    categorySlots[cat] = Math.round(profile.categoryWeights[cat] * totalSlots)
  }

  const sortedShelves = [...shelves].sort((a, b) => a.order - b.order)

  const categoryProducts: Record<string, Product[]> = {}
  for (const cat of sortedCategories) {
    categoryProducts[cat] = allProducts.filter((p) => p.category === cat)
  }

  const shelfPriority = CATEGORY_SHELF_PRIORITY.filter((c) => sortedCategories.includes(c))
  const remainingCategories = sortedCategories.filter((c) => !shelfPriority.includes(c))
  const orderedCategories = [...shelfPriority, ...remainingCategories]

  let shelfIndex = 0
  for (const category of orderedCategories) {
    let slotsRemaining = categorySlots[category]
    const prods = categoryProducts[category]
    if (!prods.length || slotsRemaining <= 0) continue

    let prodIndex = 0
    while (slotsRemaining > 0 && shelfIndex < sortedShelves.length) {
      const shelf = sortedShelves[shelfIndex]
      const existingOnShelf = placements
        .filter((p) => p.shelfId === shelf.id)
        .reduce((sum, p) => sum + p.facings, 0)
      const available = shelf.slots - existingOnShelf

      if (available <= 0) {
        shelfIndex++
        continue
      }

      const product = prods[prodIndex % prods.length]
      const facings = Math.min(Math.max(1, Math.ceil(slotsRemaining / prods.length)), available, 3)

      placements.push({
        id: generateId(),
        productId: product.id,
        shelfId: shelf.id,
        position: existingOnShelf,
        facings,
      })

      slotsRemaining -= facings
      prodIndex++

      const newTotal = existingOnShelf + facings
      if (newTotal >= shelf.slots) {
        shelfIndex++
      }
    }
  }

  return placements
}
