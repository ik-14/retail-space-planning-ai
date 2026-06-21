import { Text } from '@react-three/drei'
import { Shelf } from './Shelf'

interface BayProps {
  bayIndex: number
  shelfCount: number
  shelfIds: string[]
}

export function Bay({ bayIndex, shelfCount, shelfIds: _shelfIds }: BayProps) {
  const xOffset = bayIndex * 3.5
  const bayHeight = shelfCount * 1.0 + 0.3

  return (
    <group position={[xOffset, 0, 0]}>
      {/* Left upright */}
      <mesh position={[-1.5, bayHeight / 2, 0]}>
        <boxGeometry args={[0.05, bayHeight, 0.6]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      {/* Right upright */}
      <mesh position={[1.5, bayHeight / 2, 0]}>
        <boxGeometry args={[0.05, bayHeight, 0.6]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Shelves */}
      {Array.from({ length: shelfCount }, (_, i) => (
        <Shelf key={i} position={[0, i * 1.0 + 0.3, 0]} />
      ))}

      {/* Bay label */}
      <Text
        position={[0, -0.25, 0.3]}
        fontSize={0.15}
        color="#6b7280"
        anchorX="center"
      >
        Bay {bayIndex + 1}
      </Text>
    </group>
  )
}
