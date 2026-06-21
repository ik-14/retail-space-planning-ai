import { Text } from '@react-three/drei'
import { useUIStore } from '../../store/uiStore'
import type { Product } from '../../types'

interface ProductBoxProps {
  product: Product
  position: [number, number, number]
  facings: number
  placementId?: string
  onClick?: () => void
  isSelected?: boolean
  opacity?: number
}

export function ProductBox({ product, position, facings, onClick, isSelected, opacity = 1 }: ProductBoxProps) {
  const showLabels = useUIStore((s) => s.showLabels)
  const boxWidth = 0.33
  const boxHeight = 0.5
  const boxDepth = 0.3
  const gap = 0.02

  return (
    <group position={position}>
      {Array.from({ length: facings }, (_, i) => {
        const x = i * (boxWidth + gap)
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh onClick={onClick}>
              <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
              <meshStandardMaterial
                color={product.color}
                transparent={opacity < 1}
                opacity={opacity}
              />
            </mesh>
            {isSelected && (
              <mesh>
                <boxGeometry args={[boxWidth + 0.04, boxHeight + 0.04, boxDepth + 0.04]} />
                <meshBasicMaterial color="#2563eb" wireframe />
              </mesh>
            )}
          </group>
        )
      })}

      {showLabels && (
        <Text
          position={[(facings - 1) * (boxWidth + gap) / 2, boxHeight / 2 + 0.12, boxDepth / 2 + 0.01]}
          fontSize={0.1}
          color="#1f2937"
          anchorX="center"
          anchorY="bottom"
          maxWidth={facings * (boxWidth + gap)}
        >
          {product.name}{facings > 1 ? ` x${facings}` : ''}
        </Text>
      )}
    </group>
  )
}
