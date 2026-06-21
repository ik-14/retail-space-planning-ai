import { create } from 'zustand'
import type { Bay, Placement, Planogram, PlanogramSummary, Shelf } from '../types'

const SLOTS_PER_SHELF = 8

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

interface PlanogramState {
  activePlanogram: Planogram | null

  createPlanogram: (name: string, bayCount: number, shelvesPerBay: number) => void
  loadPlanogram: (id: string) => void
  savePlanogram: () => void
  listSavedPlanograms: () => PlanogramSummary[]

  addBay: () => void
  removeBay: (bayId: string) => void

  addShelf: (bayId: string) => void
  removeShelf: (shelfId: string) => void

  addPlacement: (productId: string, shelfId: string, position: number, facings: number) => void
  updatePlacement: (placementId: string, changes: Partial<Pick<Placement, 'position' | 'facings' | 'shelfId'>>) => void
  removePlacement: (placementId: string) => void
  setPlacements: (placements: Placement[]) => void
}

export const usePlanogramStore = create<PlanogramState>((set, get) => ({
  activePlanogram: null,

  createPlanogram: (name, bayCount, shelvesPerBay) => {
    const id = generateId()
    const bays: Bay[] = Array.from({ length: bayCount }, (_, i) => ({
      id: generateId(),
      order: i,
    }))

    const shelves: Shelf[] = bays.flatMap((bay) =>
      Array.from({ length: shelvesPerBay }, (_, i) => ({
        id: generateId(),
        bayId: bay.id,
        order: i,
        slots: SLOTS_PER_SHELF,
      }))
    )

    const planogram: Planogram = {
      id,
      name,
      bays,
      shelves,
      placements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    set({ activePlanogram: planogram })
    get().savePlanogram()
  },

  loadPlanogram: (id) => {
    const raw = localStorage.getItem(`planogram-ai:planogram:${id}`)
    if (raw) {
      set({ activePlanogram: JSON.parse(raw) })
    }
  },

  savePlanogram: () => {
    const { activePlanogram } = get()
    if (!activePlanogram) return

    activePlanogram.updatedAt = Date.now()
    localStorage.setItem(
      `planogram-ai:planogram:${activePlanogram.id}`,
      JSON.stringify(activePlanogram)
    )

    const summaries = get().listSavedPlanograms()
    const existing = summaries.findIndex((s) => s.id === activePlanogram.id)
    const summary: PlanogramSummary = {
      id: activePlanogram.id,
      name: activePlanogram.name,
      updatedAt: activePlanogram.updatedAt,
    }
    if (existing >= 0) {
      summaries[existing] = summary
    } else {
      summaries.push(summary)
    }
    localStorage.setItem('planogram-ai:planograms', JSON.stringify(summaries))
  },

  listSavedPlanograms: () => {
    const raw = localStorage.getItem('planogram-ai:planograms')
    return raw ? JSON.parse(raw) : []
  },

  addBay: () =>
    set((s) => {
      if (!s.activePlanogram) return s
      const newBay: Bay = {
        id: generateId(),
        order: s.activePlanogram.bays.length,
      }
      const newShelves: Shelf[] = Array.from({ length: 4 }, (_, i) => ({
        id: generateId(),
        bayId: newBay.id,
        order: i,
        slots: SLOTS_PER_SHELF,
      }))
      return {
        activePlanogram: {
          ...s.activePlanogram,
          bays: [...s.activePlanogram.bays, newBay],
          shelves: [...s.activePlanogram.shelves, ...newShelves],
        },
      }
    }),

  removeBay: (bayId) =>
    set((s) => {
      if (!s.activePlanogram || s.activePlanogram.bays.length <= 1) return s
      const shelfIds = s.activePlanogram.shelves
        .filter((sh) => sh.bayId === bayId)
        .map((sh) => sh.id)
      return {
        activePlanogram: {
          ...s.activePlanogram,
          bays: s.activePlanogram.bays.filter((b) => b.id !== bayId),
          shelves: s.activePlanogram.shelves.filter((sh) => sh.bayId !== bayId),
          placements: s.activePlanogram.placements.filter(
            (p) => !shelfIds.includes(p.shelfId)
          ),
        },
      }
    }),

  addShelf: (bayId) =>
    set((s) => {
      if (!s.activePlanogram) return s
      const bayShelves = s.activePlanogram.shelves.filter((sh) => sh.bayId === bayId)
      const newShelf: Shelf = {
        id: generateId(),
        bayId,
        order: bayShelves.length,
        slots: SLOTS_PER_SHELF,
      }
      return {
        activePlanogram: {
          ...s.activePlanogram,
          shelves: [...s.activePlanogram.shelves, newShelf],
        },
      }
    }),

  removeShelf: (shelfId) =>
    set((s) => {
      if (!s.activePlanogram) return s
      const shelf = s.activePlanogram.shelves.find((sh) => sh.id === shelfId)
      if (!shelf) return s
      const bayShelves = s.activePlanogram.shelves.filter((sh) => sh.bayId === shelf.bayId)
      if (bayShelves.length <= 1) return s
      return {
        activePlanogram: {
          ...s.activePlanogram,
          shelves: s.activePlanogram.shelves.filter((sh) => sh.id !== shelfId),
          placements: s.activePlanogram.placements.filter((p) => p.shelfId !== shelfId),
        },
      }
    }),

  addPlacement: (productId, shelfId, position, facings) =>
    set((s) => {
      if (!s.activePlanogram) return s
      const placement: Placement = {
        id: generateId(),
        productId,
        shelfId,
        position,
        facings,
      }
      return {
        activePlanogram: {
          ...s.activePlanogram,
          placements: [...s.activePlanogram.placements, placement],
        },
      }
    }),

  updatePlacement: (placementId, changes) =>
    set((s) => {
      if (!s.activePlanogram) return s
      return {
        activePlanogram: {
          ...s.activePlanogram,
          placements: s.activePlanogram.placements.map((p) =>
            p.id === placementId ? { ...p, ...changes } : p
          ),
        },
      }
    }),

  removePlacement: (placementId) =>
    set((s) => {
      if (!s.activePlanogram) return s
      return {
        activePlanogram: {
          ...s.activePlanogram,
          placements: s.activePlanogram.placements.filter((p) => p.id !== placementId),
        },
      }
    }),

  setPlacements: (placements) =>
    set((s) => {
      if (!s.activePlanogram) return s
      return {
        activePlanogram: {
          ...s.activePlanogram,
          placements,
        },
      }
    }),
}))
