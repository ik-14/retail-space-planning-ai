import { useInteractionStore } from '../../store/interactionStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { useCatalogStore } from '../../store/catalogStore'
import { useNotificationStore } from '../../store/notificationStore'
import { findPlacementPosition } from '../../logic/gridSnap'

interface GridSlotProps {
  shelfId: string
  position: number
  worldPosition: [number, number, number]
}

export function GridSlot({ shelfId, position, worldPosition }: GridSlotProps) {
  const mode = useInteractionStore((s) => s.mode)
  const hoveredSlot = useInteractionStore((s) => s.hoveredSlot)
  const setHoveredSlot = useInteractionStore((s) => s.setHoveredSlot)
  const cancel = useInteractionStore((s) => s.cancel)
  const addPlacement = usePlanogramStore((s) => s.addPlacement)
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const removeFromStaging = useCatalogStore((s) => s.removeFromStaging)
  const addNotification = useNotificationStore((s) => s.addNotification)

  // Only show grid slots in placing mode (dragging uses its own drop logic)
  if (mode.type !== 'placing' || !planogram) return null

  const shelfPlacements = planogram.placements.filter((p) => p.shelfId === shelfId)
  const shelf = planogram.shelves.find((s) => s.id === shelfId)
  if (!shelf) return null

  const isOccupied = shelfPlacements.some((p) => {
    return position >= p.position && position < p.position + p.facings
  })

  if (isOccupied) return null

  const isHovered = hoveredSlot?.shelfId === shelfId && hoveredSlot?.position === position

  const handleClick = (e: any) => {
    e.stopPropagation()

    const startPos = findPlacementPosition(shelfPlacements, shelf.slots, position, 1)

    if (startPos === null) {
      addNotification('Not enough space', 'error')
      return
    }

    if (mode.type === 'placing') {
      addPlacement(mode.productId, shelfId, startPos, 1)
      removeFromStaging(mode.productId)
    }

    cancel()
  }

  return (
    <mesh
      position={worldPosition}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHoveredSlot({ shelfId, position })
      }}
      onPointerLeave={() => setHoveredSlot(null)}
      onClick={handleClick}
    >
      <boxGeometry args={[0.33, 0.45, 0.28]} />
      <meshBasicMaterial
        color={isHovered ? '#93c5fd' : '#bfdbfe'}
        transparent
        opacity={isHovered ? 0.7 : 0.3}
      />
    </mesh>
  )
}
