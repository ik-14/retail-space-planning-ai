interface ShelfProps {
  position: [number, number, number]
  width?: number
}

export function Shelf({ position, width = 3 }: ShelfProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.05, 0.6]} />
      <meshStandardMaterial color="#9ca3af" />
    </mesh>
  )
}
