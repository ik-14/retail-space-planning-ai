import type { Placement } from '../types'

/**
 * Given a shelf's placements, slot count, and a clicked position,
 * find the best start position for `facings` consecutive free slots
 * that include the clicked position.
 * Returns the start position, or null if it can't fit.
 */
export function findPlacementPosition(
  shelfPlacements: Placement[],
  totalSlots: number,
  clickedPosition: number,
  facings: number,
  excludePlacementId?: string
): number | null {
  const occupied = new Set<number>()
  for (const p of shelfPlacements) {
    if (p.id === excludePlacementId) continue
    for (let i = p.position; i < p.position + p.facings; i++) {
      occupied.add(i)
    }
  }

  // Find all possible start positions where `facings` consecutive slots are free
  // and the range includes the clicked position
  const validStarts: number[] = []
  for (let start = 0; start <= totalSlots - facings; start++) {
    const end = start + facings - 1
    // Must include the clicked position
    if (clickedPosition < start || clickedPosition > end) continue

    // All slots in range must be free
    let allFree = true
    for (let i = start; i <= end; i++) {
      if (occupied.has(i)) {
        allFree = false
        break
      }
    }
    if (allFree) validStarts.push(start)
  }

  if (validStarts.length === 0) return null

  // Prefer the start that puts clicked position as the leftmost
  // (most intuitive: click the left edge of where you want it)
  // Actually prefer the one where clicked position is leftmost valid
  const preferLeft = validStarts.find((s) => s === clickedPosition)
  if (preferLeft !== undefined) return preferLeft

  // Otherwise pick the start closest to clicked being at the left
  return validStarts[0]
}
