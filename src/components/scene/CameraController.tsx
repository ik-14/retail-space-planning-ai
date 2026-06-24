import { useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useUIStore } from '../../store/uiStore'
import { useInteractionStore } from '../../store/interactionStore'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CameraControllerProps {
  centerX: number
  cameraZ?: number
}

export function CameraController({ centerX }: CameraControllerProps) {
  const viewMode = useUIStore((s) => s.viewMode)
  const mode = useInteractionStore((s) => s.mode)
  const productPointerDown = useInteractionStore((s) => s.productPointerDown)
  const { size } = useThree()
  const controlsRef = useRef(null)

  const target: [number, number, number] = [centerX, 1.5, 0]
  const isDragging = mode.type === 'dragging' || productPointerDown

  useEffect(() => {
    if (controlsRef.current) {
      (controlsRef.current as any).target.set(...target)
      ;(controlsRef.current as any).update()
    }
  }, [centerX])

  if (viewMode === '2d') {
    const frustumSize = 6
    const aspect = size.width / size.height
    return (
      <>
        <OrthographicCamera
          makeDefault
          position={[centerX, 1.5, 10]}
          zoom={80}
          left={-frustumSize * aspect}
          right={frustumSize * aspect}
          top={frustumSize}
          bottom={-frustumSize}
          near={0.1}
          far={100}
        />
        <OrbitControls
          ref={controlsRef}
          target={new THREE.Vector3(...target)}
          enableRotate={false}
          enableZoom={!isDragging}
          enablePan={!isDragging}
        />
      </>
    )
  }

  return (
    <>
      <perspectiveCamera />
      <OrbitControls
        ref={controlsRef}
        target={new THREE.Vector3(...target)}
        enabled={!isDragging}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}
