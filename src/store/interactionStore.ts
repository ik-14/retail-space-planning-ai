import { create } from 'zustand'

type Mode =
  | { type: 'idle' }
  | { type: 'placing'; productId: string }
  | { type: 'dragging'; placementId: string; originalShelfId: string; originalPosition: number }

interface InteractionState {
  mode: Mode
  hoveredSlot: { shelfId: string; position: number } | null
  ghostPosition: [number, number, number] | null
  productPointerDown: boolean

  startPlacing: (productId: string) => void
  startDragging: (placementId: string, shelfId: string, position: number) => void
  setGhostPosition: (pos: [number, number, number] | null) => void
  cancel: () => void
  setHoveredSlot: (slot: { shelfId: string; position: number } | null) => void
  setProductPointerDown: (down: boolean) => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
  mode: { type: 'idle' },
  hoveredSlot: null,
  ghostPosition: null,
  productPointerDown: false,

  startPlacing: (productId) => set({ mode: { type: 'placing', productId }, hoveredSlot: null, ghostPosition: null }),
  startDragging: (placementId, shelfId, position) => set({
    mode: { type: 'dragging', placementId, originalShelfId: shelfId, originalPosition: position },
    hoveredSlot: null,
    ghostPosition: null,
  }),
  setGhostPosition: (pos) => set({ ghostPosition: pos }),
  cancel: () => set({ mode: { type: 'idle' }, hoveredSlot: null, ghostPosition: null, productPointerDown: false }),
  setHoveredSlot: (slot) => set({ hoveredSlot: slot }),
  setProductPointerDown: (down) => set({ productPointerDown: down }),
}))
