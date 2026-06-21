import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { usePlanogramStore } from '../../store/planogramStore'
import { useUIStore } from '../../store/uiStore'
import { useInteractionStore } from '../../store/interactionStore'
import { Bay } from './Bay'
import { DraggableProduct } from './DraggableProduct'
import { GhostProduct } from './GhostProduct'
import { StagingShelf } from './StagingShelf'
import { CameraController } from './CameraController'
import { DragHighlight } from './DragHighlight'

function PlacedProducts() {
  const planogram = usePlanogramStore((s) => s.activePlanogram)

  if (!planogram) return null

  return (
    <>
      {planogram.placements.map((placement) => {
        const shelf = planogram.shelves.find((s) => s.id === placement.shelfId)
        if (!shelf) return null

        const bay = planogram.bays.find((b) => b.id === shelf.bayId)
        if (!bay) return null

        const bayX = bay.order * 3.5
        const shelfY = shelf.order * 1.0 + 0.3
        const slotX = -1.3 + placement.position * 0.37

        return (
          <DraggableProduct
            key={placement.id}
            placement={placement}
            worldPosition={[bayX + slotX, shelfY + 0.28, 0]}
          />
        )
      })}
    </>
  )
}

export function PlanogramScene() {
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const cancel = useInteractionStore((s) => s.cancel)
  const selectPlacement = useUIStore((s) => s.selectPlacement)

  const baysSorted = useMemo(() => {
    if (!planogram) return []
    return [...planogram.bays].sort((a, b) => a.order - b.order)
  }, [planogram])

  const centerX = useMemo(() => {
    if (baysSorted.length === 0) return 0
    return ((baysSorted.length - 1) * 3.5) / 2
  }, [baysSorted.length])

  const cameraZ = useMemo(() => {
    return Math.max(8, baysSorted.length * 3)
  }, [baysSorted.length])

  const maxShelfCount = useMemo(() => {
    if (!planogram) return 4
    return Math.max(...planogram.bays.map((bay) =>
      planogram.shelves.filter((s) => s.bayId === bay.id).length
    ), 4)
  }, [planogram])

  const stagingY = maxShelfCount * 1.0 + 1.0

  if (!planogram) return null

  return (
    <Canvas camera={{ position: [centerX, 2, cameraZ], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      {baysSorted.map((bay) => {
        const bayShelves = planogram.shelves.filter((s) => s.bayId === bay.id)
        return (
          <Bay
            key={bay.id}
            bayIndex={bay.order}
            shelfCount={bayShelves.length}
            shelfIds={bayShelves.map((s) => s.id)}
          />
        )
      })}

      <PlacedProducts />
      <GhostProduct />
      <DragHighlight />
      <StagingShelf centerX={centerX} y={stagingY} />

      {/* Invisible click plane to cancel / deselect */}
      <mesh
        position={[centerX, 2, -0.5]}
        onClick={() => {
          cancel()
          selectPlacement(null)
        }}
      >
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <CameraController centerX={centerX} cameraZ={cameraZ} />
    </Canvas>
  )
}
