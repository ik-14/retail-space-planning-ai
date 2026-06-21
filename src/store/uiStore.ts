import { create } from 'zustand'

interface UIState {
  viewMode: '2d' | '3d'
  showLabels: boolean
  showImages: boolean
  panelOpen: boolean
  selectedPlacementId: string | null
  activeScreen: 'home' | 'editor'
  editorMode: 'manual' | 'ai'

  toggleView: () => void
  toggleLabels: () => void
  toggleImages: () => void
  togglePanel: () => void
  selectPlacement: (id: string | null) => void
  setScreen: (screen: 'home' | 'editor') => void
  setEditorMode: (mode: 'manual' | 'ai') => void
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: '3d',
  showLabels: true,
  showImages: false,
  panelOpen: true,
  selectedPlacementId: null,
  activeScreen: 'home',
  editorMode: 'manual',

  toggleView: () => set((s) => ({ viewMode: s.viewMode === '2d' ? '3d' : '2d' })),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleImages: () => set((s) => ({ showImages: !s.showImages })),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  selectPlacement: (id) => set({ selectedPlacementId: id }),
  setScreen: (screen) => set({ activeScreen: screen }),
  setEditorMode: (mode) => set({ editorMode: mode }),
}))
