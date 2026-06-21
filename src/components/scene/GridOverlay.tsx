import { useInteractionStore } from '../../store/interactionStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { GridSlot } from './GridSlot'

export function GridOverlay() {
  const mode = useInteractionStore((s) => s.mode)
  const planogram = usePlanogramStore((s) => s.activePlanogram)

  if (mode.type === 'idle' || !planogram) return null

  return (
    <>
      {planogram.shelves.map((shelf) => {
        const bay = planogram.bays.find((b) => b.id === shelf.bayId)
        if (!bay) return null

        const bayX = bay.order * 3.5
        const shelfY = shelf.order * 1.0 + 0.3

        return Array.from({ length: shelf.slots }, (_, slotIdx) => {
          const slotX = -1.3 + slotIdx * 0.37
          return (
            <GridSlot
              key={`${shelf.id}-${slotIdx}`}
              shelfId={shelf.id}
              position={slotIdx}
              worldPosition={[bayX + slotX, shelfY + 0.28, 0]}
            />
          )
        })
      })}
    </>
  )
}
