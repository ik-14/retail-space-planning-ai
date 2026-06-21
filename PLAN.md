# Planogram AI - MVP Plan

## Overview

AI-native 3D web planogram tool targeting the mid-market gap (no competitor combines AI + 3D + web + mid-market). Users can generate planograms from store profiles or build them manually — both use the same editor.

## Modes

### 1. AI Generate Mode
- User selects a store profile (seaside town, urban, suburban, etc.)
- System instantly populates shelves with products weighted toward that profile's categories
- Opens the editor with pre-filled planogram for user to tweak

### 2. Manual Mode
- User creates a new planogram from scratch
- Opens the editor with empty bays/shelves
- User drags products from catalog onto shelves

### 3. Shared Editor
- Both modes open into the same editing experience
- Full drag-and-drop, add/remove shelves, configure facings, etc.

## Key Features (MVP)

| Feature | Description |
|---------|-------------|
| Multi-bay fixtures | Multiple bays side by side, each with N shelves |
| Add/remove shelves | User can add or remove shelves from any bay |
| 3D product boxes | Colored boxes with toggleable labels and front images |
| Facings | Multiple units of same product side-by-side (e.g., 3x Coca-Cola) |
| Staging shelf | In-scene shelf where products land when clicked from catalog |
| Grid snapping | Products snap to grid positions on shelves |
| 2D/3D toggle | Front-on orthographic view vs orbitable 3D perspective |
| Store profiles | Seaside, urban, suburban → auto-populate based on category weights |
| localStorage | Planograms persist across refreshes |
| Collapsible left panel | Catalog (searchable) + properties of selected item |

## Tech Stack

- **Build**: Vite
- **Language**: TypeScript
- **UI**: React
- **3D**: React Three Fiber + Drei + Three.js
- **State**: Zustand (lightweight, works well with R3F)
- **Styling**: CSS Modules or Tailwind (TBD)
- **Persistence**: localStorage
- **No backend** for MVP

## Mock AI Logic

No actual AI API calls. Store profiles map to category weight tables:

```
seaside_town → suncare: 0.25, beverages: 0.22, ice_cream: 0.20, snacks: 0.18, fresh: 0.10, household: 0.05
urban        → beverages: 0.25, fresh: 0.22, snacks: 0.20, household: 0.18, ice_cream: 0.10, suncare: 0.05
suburban     → household: 0.25, fresh: 0.22, beverages: 0.20, snacks: 0.18, ice_cream: 0.10, suncare: 0.05
```

Products are selected and placed based on these weights, filling available shelf slots proportionally.

## Build Order

### Phase 1: Foundation
1. Project scaffold (Vite + TS + React + R3F)
2. Data models and types
3. Zustand store
4. Mock product catalog (40 products, 6 categories)
5. Store profiles with category weights

### Phase 2: 3D Scene
6. Bay component (frame/uprights)
7. Shelf component (flat surface with grid)
8. Product box component (with label toggle)
9. Staging shelf
10. Camera controls + 2D/3D toggle

### Phase 3: Editor UI
11. Left panel (catalog list with search/filter)
12. Properties sub-panel (facings, delete, selected item info)
13. Toolbar (mode toggle, view toggle, label toggle, +/- shelf, +/- bay)
14. Collapsible panel behavior

### Phase 4: Interactions
15. Click catalog item → appears on staging shelf
16. Drag from staging shelf → snap to grid slot on bay shelf
17. Click placed product → select it, show properties
18. Adjust facings from properties panel
19. Remove product (drag off or delete button)

### Phase 5: AI Generate
20. Profile selection UI
21. Auto-populate algorithm (weighted category fill)
22. Instant populate into editor

### Phase 6: Persistence
23. Save/load planograms to localStorage
24. Planogram list / management (create new, load existing)
