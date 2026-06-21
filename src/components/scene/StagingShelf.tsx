import { Text } from '@react-three/drei'
import { useCatalogStore } from '../../store/catalogStore'
import { DraggableStagingProduct } from './DraggableStagingProduct'

interface StagingShelfProps {
  centerX: number
  y: number
}

export function StagingShelf({ centerX, y }: StagingShelfProps) {
  const stagingProductIds = useCatalogStore((s) => s.stagingProductIds)
  const products = useCatalogStore((s) => s.products)

  const stagingProducts = stagingProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const shelfWidth = Math.max(4, stagingProducts.length * 0.5 + 1)

  return (
    <group position={[centerX, y, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[shelfWidth, 0.05, 0.6]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>

      <Text
        position={[0, -0.2, 0.3]}
        fontSize={0.12}
        color="#9ca3af"
        anchorX="center"
      >
        Staging — drag to a shelf
      </Text>

      {stagingProducts.map((product, i) => {
        if (!product) return null
        const x = -((stagingProducts.length - 1) * 0.4) / 2 + i * 0.4
        return (
          <DraggableStagingProduct
            key={product.id}
            product={product}
            position={[x, 0.3, 0]}
          />
        )
      })}
    </group>
  )
}
