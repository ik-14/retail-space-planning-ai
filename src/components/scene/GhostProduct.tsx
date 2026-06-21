import { useInteractionStore } from '../../store/interactionStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { useCatalogStore } from '../../store/catalogStore'
import { ProductBox } from './ProductBox'

export function GhostProduct() {
  const mode = useInteractionStore((s) => s.mode)
  const ghostPosition = useInteractionStore((s) => s.ghostPosition)
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const products = useCatalogStore((s) => s.products)

  if (!ghostPosition) return null

  if (mode.type === 'dragging' && planogram) {
    const placement = planogram.placements.find((p) => p.id === mode.placementId)
    if (!placement) return null

    const product = products.find((p) => p.id === placement.productId)
    if (!product) return null

    return (
      <group position={ghostPosition}>
        <ProductBox
          product={product}
          position={[0, 0, 0]}
          facings={placement.facings}
          opacity={0.6}
        />
      </group>
    )
  }

  if (mode.type === 'placing') {
    const product = products.find((p) => p.id === mode.productId)
    if (!product) return null

    return (
      <group position={ghostPosition}>
        <ProductBox
          product={product}
          position={[0, 0, 0]}
          facings={1}
          opacity={0.6}
        />
      </group>
    )
  }

  return null
}
