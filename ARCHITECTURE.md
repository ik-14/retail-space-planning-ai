# Architecture

## Directory Structure

```
planogram-ai/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root layout (toolbar + panel + canvas)
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces/types
│   │
│   ├── store/
│   │   ├── planogramStore.ts       # Zustand store - planogram state (bays, shelves, placements)
│   │   ├── catalogStore.ts         # Zustand store - product catalog + filtering
│   │   └── uiStore.ts             # Zustand store - UI state (selected item, view mode, panel open)
│   │
│   ├── data/
│   │   ├── products.ts            # Mock product catalog (40 products, 6 categories)
│   │   └── storeProfiles.ts       # Store profile definitions + category weights
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Toolbar.tsx         # Top bar: mode, view toggle, labels, +/- shelf/bay
│   │   │   ├── LeftPanel.tsx       # Collapsible panel container
│   │   │   ├── CatalogPanel.tsx    # Product list with search + category filter
│   │   │   └── PropertiesPanel.tsx # Selected item properties (facings, delete, info)
│   │   │
│   │   ├── scene/
│   │   │   ├── PlanogramScene.tsx  # R3F Canvas wrapper + camera setup
│   │   │   ├── Bay.tsx            # Single bay (frame + shelves)
│   │   │   ├── Shelf.tsx          # Single shelf (surface + grid slots)
│   │   │   ├── ProductBox.tsx     # 3D product representation
│   │   │   ├── StagingShelf.tsx   # Bottom staging area
│   │   │   ├── GridSlot.tsx       # Visual slot indicator (hover highlight)
│   │   │   └── CameraController.tsx # 2D/3D view toggle logic
│   │   │
│   │   └── screens/
│   │       ├── HomeScreen.tsx      # Landing: new planogram / load existing / AI generate
│   │       └── EditorScreen.tsx    # Main editor (toolbar + panel + scene)
│   │
│   ├── logic/
│   │   ├── generatePlanogram.ts   # Mock AI: takes profile → returns shelf placements
│   │   ├── gridSnap.ts            # Calculate snap positions given shelf dimensions
│   │   └── persistence.ts         # localStorage save/load helpers
│   │
│   └── styles/
│       └── index.css              # Global styles (light mode)
│
├── public/
│   └── textures/                  # Optional: product face images
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Data Model

```typescript
// === Core Types ===

interface Product {
  id: string
  name: string
  category: Category
  color: string            // Hex color for 3D box
  width: number            // In grid units (most are 1)
  height: number           // Visual height of box
  depth: number            // Visual depth of box
  imageUrl?: string        // Optional front-face image
}

type Category = 'beverages' | 'snacks' | 'suncare' | 'household' | 'ice_cream' | 'fresh'

interface Placement {
  id: string
  productId: string
  shelfId: string
  position: number         // Grid slot index (0-based from left)
  facings: number          // How many units side-by-side
}

interface Shelf {
  id: string
  bayId: string
  order: number            // 0 = bottom shelf, increments up
  slots: number            // Total grid slots available
}

interface Bay {
  id: string
  planogramId: string
  order: number            // 0 = leftmost bay
  shelfCount: number       // Current number of shelves
}

interface Planogram {
  id: string
  name: string
  bays: Bay[]
  shelves: Shelf[]
  placements: Placement[]
  createdAt: number
  updatedAt: number
}

// === Store Profiles ===

interface StoreProfile {
  id: string
  name: string             // "Seaside Town", "Urban Center", etc.
  description: string
  categoryWeights: Record<Category, number>  // Weights sum to 1.0
}

// === UI State ===

interface UIState {
  viewMode: '2d' | '3d'
  showLabels: boolean
  showImages: boolean
  panelOpen: boolean
  selectedPlacementId: string | null
  activeScreen: 'home' | 'editor'
  editorMode: 'manual' | 'ai'
}
```

## State Management (Zustand)

Three separate stores for clean separation:

### planogramStore
- `activePlanogram: Planogram | null`
- `addBay()` / `removeBay(bayId)`
- `addShelf(bayId)` / `removeShelf(shelfId)`
- `addPlacement(productId, shelfId, position, facings)`
- `updatePlacement(placementId, changes)`
- `removePlacement(placementId)`
- `movePlacement(placementId, newShelfId, newPosition)`
- `loadPlanogram(id)` / `savePlanogram()`
- `listSavedPlanograms()`

### catalogStore
- `products: Product[]`
- `searchQuery: string`
- `categoryFilter: Category | null`
- `filteredProducts` (derived)
- `stagingProducts: Product[]` (products on staging shelf)
- `addToStaging(productId)` / `removeFromStaging(productId)`

### uiStore
- All UIState fields
- `toggleView()` / `toggleLabels()` / `toggleImages()` / `togglePanel()`
- `selectPlacement(id)` / `clearSelection()`

## Interaction Flow

```
CATALOG CLICK:
  User clicks product in left panel
  → catalogStore.addToStaging(productId)
  → ProductBox appears on StagingShelf in 3D scene

DRAG TO SHELF:
  User drags product from staging shelf
  → On hover over shelf, GridSlot highlights valid snap position
  → On drop, gridSnap calculates nearest slot
  → planogramStore.addPlacement(productId, shelfId, slotIndex, 1)
  → catalogStore.removeFromStaging(productId)
  → ProductBox renders in placed position

SELECT PLACED PRODUCT:
  User clicks placed product in 3D scene
  → uiStore.selectPlacement(placementId)
  → PropertiesPanel shows: product name, facings control, delete button

ADJUST FACINGS:
  User changes facings in PropertiesPanel
  → planogramStore.updatePlacement(id, { facings: newCount })
  → ProductBox re-renders with N boxes side-by-side

AI GENERATE:
  User selects store profile on HomeScreen
  → generatePlanogram(profile, products) returns Placement[]
  → planogramStore creates new planogram with those placements
  → Navigate to EditorScreen
```

## Camera Modes

### 3D Mode (default)
- OrbitControls from Drei
- Perspective camera
- User can rotate, zoom, pan

### 2D Mode
- Orthographic camera, front-on
- No rotation (pan + zoom only)
- Classic planogram view (like looking at real shelf)

Toggle preserves the current zoom level where possible.

## Grid System

Each shelf has N slots (default: 8 per shelf).
- Slot width = shelf width / slot count
- Products occupy `facings` number of consecutive slots
- Collision detection: cannot place if slots are occupied
- Visual indicator: empty slots show subtle dotted outline on hover

## Persistence

```typescript
// localStorage keys:
'planogram-ai:planograms'  → PlanogramSummary[]  (id, name, updatedAt)
'planogram-ai:planogram:{id}' → Planogram        (full data)
```

Auto-save on every state change (debounced 1s).
