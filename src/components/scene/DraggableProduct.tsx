import { useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useInteractionStore } from '../../store/interactionStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useUIStore } from '../../store/uiStore'
import { useCatalogStore } from '../../store/catalogStore'
import { findPlacementPosition } from '../../logic/gridSnap'
import { ProductBox } from './ProductBox'
import type { Placement } from '../../types'

interface DraggableProductProps {
  placement: Placement
  worldPosition: [number, number, number]
}

const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const DRAG_THRESHOLD = 0.05

export function DraggableProduct({ placement, worldPosition }: DraggableProductProps) {
  const { raycaster, camera } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const [dragActive, setDragActive] = useState(false)
  const downPosRef = useRef<THREE.Vector3 | null>(null)
  const hasDraggedRef = useRef(false)

  const mode = useInteractionStore((s) => s.mode)
  const startDragging = useInteractionStore((s) => s.startDragging)
  const setGhostPosition = useInteractionStore((s) => s.setGhostPosition)
  const cancel = useInteractionStore((s) => s.cancel)
  const setHoveredSlot = useInteractionStore((s) => s.setHoveredSlot)

  const updatePlacement = usePlanogramStore((s) => s.updatePlacement)
  const planogram = usePlanogramStore((s) => s.activePlanogram)

  const selectedPlacementId = useUIStore((s) => s.selectedPlacementId)
  const selectPlacement = useUIStore((s) => s.selectPlacement)

  const products = useCatalogStore((s) => s.products)
  const addNotification = useNotificationStore((s) => s.addNotification)

  const product = products.find((p) => p.id === placement.productId)
  if (!product || !planogram) return null

  const isDragging = mode.type === 'dragging' && mode.placementId === placement.id
  const isSelected = selectedPlacementId === placement.id

  const getRayPlaneIntersect = (event: THREE.Event & { ray?: THREE.Ray; pointer?: THREE.Vector2 }): THREE.Vector3 | null => {
    let ray: THREE.Ray
    if (event.ray) {
      ray = event.ray
    } else {
      const pointer = (event as any).pointer
      if (pointer) {
        raycaster.setFromCamera(pointer, camera)
        ray = raycaster.ray
      } else {
        return null
      }
    }
    const result = new THREE.Vector3()
    ray.intersectPlane(dragPlane, result)
    return result
  }

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    if (mode.type === 'placing') return

    const point = getRayPlaneIntersect(e)
    if (!point) return

    downPosRef.current = point.clone()
    hasDraggedRef.current = false
    setDragActive(true)
    ;(e.target as any)?.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: any) => {
    if (!dragActive || !downPosRef.current) return
    e.stopPropagation()

    const point = getRayPlaneIntersect(e)
    if (!point) return

    const dist = point.distanceTo(downPosRef.current)

    if (!hasDraggedRef.current) {
      if (dist < DRAG_THRESHOLD) return
      hasDraggedRef.current = true
      startDragging(placement.id, placement.shelfId, placement.position)
    }

    const ghostPos: [number, number, number] = [point.x, point.y, point.z]
    setGhostPosition(ghostPos)

    const nearestSlot = findNearestSlot(ghostPos, planogram)
    setHoveredSlot(nearestSlot)
  }

  const handlePointerUp = (e: any) => {
    if (!dragActive) return
    e.stopPropagation()
    ;(e.target as any)?.releasePointerCapture?.(e.pointerId)

    setDragActive(false)

    if (!hasDraggedRef.current) {
      downPosRef.current = null
      if (mode.type === 'idle') {
        selectPlacement(placement.id)
      }
      return
    }

    downPosRef.current = null

    const hoveredSlot = useInteractionStore.getState().hoveredSlot
    if (hoveredSlot) {
      const shelf = planogram.shelves.find((s) => s.id === hoveredSlot.shelfId)
      if (shelf) {
        const shelfPlacements = planogram.placements.filter((p) => p.shelfId === hoveredSlot.shelfId)
        const startPos = findPlacementPosition(
          shelfPlacements,
          shelf.slots,
          hoveredSlot.position,
          placement.facings,
          placement.id
        )

        if (startPos !== null) {
          updatePlacement(placement.id, { shelfId: hoveredSlot.shelfId, position: startPos })
        } else {
          addNotification(`Not enough space — need ${placement.facings} consecutive free slots`, 'error')
        }
      }
    } else {
      addNotification('Drop on a shelf to move', 'error')
    }

    setGhostPosition(null)
    setHoveredSlot(null)
    cancel()
  }

  const boxWidth = placement.facings * 0.35
  const boxHeight = 0.5

  return (
    <group position={worldPosition}>
      {/* Invisible hit area for drag events */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <boxGeometry args={[boxWidth, boxHeight, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <ProductBox
        product={product}
        position={[0, 0, 0]}
        facings={placement.facings}
        isSelected={isSelected}
        opacity={isDragging ? 0.3 : 1}
      />
    </group>
  )
}

function findNearestSlot(
  worldPos: [number, number, number],
  planogram: { bays: { id: string; order: number }[]; shelves: { id: string; bayId: string; order: number; slots: number }[] }
): { shelfId: string; position: number } | null {
  let best: { shelfId: string; position: number; dist: number } | null = null

  for (const shelf of planogram.shelves) {
    const bay = planogram.bays.find((b) => b.id === shelf.bayId)
    if (!bay) continue

    const bayX = bay.order * 3.5
    const shelfY = shelf.order * 1.0 + 0.3 + 0.28

    const dy = Math.abs(worldPos[1] - shelfY)
    if (dy > 0.6) continue

    for (let slot = 0; slot < shelf.slots; slot++) {
      const slotX = bayX + (-1.3 + slot * 0.37)
      const dx = Math.abs(worldPos[0] - slotX)
      const dist = dx + dy
      if (dist < (best?.dist ?? Infinity) && dist < 0.8) {
        best = { shelfId: shelf.id, position: slot, dist }
      }
    }
  }

  return best ? { shelfId: best.shelfId, position: best.position } : null
}
