import { useInteractionStore } from '../../store/interactionStore'
import { usePlanogramStore } from '../../store/planogramStore'

export function DragHighlight() {
  const mode = useInteractionStore((s) => s.mode)
  const hoveredSlot = useInteractionStore((s) => s.hoveredSlot)
  const ghostPosition = useInteractionStore((s) => s.ghostPosition)
  const planogram = usePlanogramStore((s) => s.activePlanogram)

  // Only show during active drag (ghost visible)
  if (!hoveredSlot || !planogram || !ghostPosition) return null
  if (mode.type !== 'dragging' && mode.type !== 'placing') return null

  let facings = 1
  if (mode.type === 'dragging') {
    const placement = planogram.placements.find((p) => p.id === mode.placementId)
    if (!placement) return null
    facings = placement.facings
  }

  const shelf = planogram.shelves.find((s) => s.id === hoveredSlot.shelfId)
  if (!shelf) return null

  const bay = planogram.bays.find((b) => b.id === shelf.bayId)
  if (!bay) return null

  const bayX = bay.order * 3.5
  const shelfY = shelf.order * 1.0 + 0.3 + 0.28

  return (
    <>
      {Array.from({ length: facings }, (_, i) => {
        const slotIdx = hoveredSlot.position + i
        if (slotIdx >= shelf.slots) return null
        const slotX = bayX + (-1.3 + slotIdx * 0.37)
        return (
          <mesh key={i} position={[slotX, shelfY, 0.01]}>
            <boxGeometry args={[0.33, 0.45, 0.28]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.5} />
          </mesh>
        )
      })}
    </>
  )
}
