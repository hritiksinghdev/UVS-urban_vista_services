'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ============================================
// EARTH TEXTURE CONFIGURATION
// Place your earth image in: public/textures/
// Then update the path below:
const EARTH_TEXTURE_PATH = '/textures/earth.jpg'
// ============================================

function GlobeTexture() {
  const texture = useTexture(EARTH_TEXTURE_PATH)
  return <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
}

function GlobeFallback() {
  return (
    <>
      <meshStandardMaterial
        color="#1a4fa0"
        roughness={0.4}
        metalness={0.3}
        emissive="#0a2a5e"
        emissiveIntensity={0.2}
      />
    </>
  )
}

export default function StudioOrb() {
  const globeRef = useRef<THREE.Mesh>(null!)
  const dot1Ref = useRef<THREE.Mesh>(null!)
  const dot2Ref = useRef<THREE.Mesh>(null!)
  const dot3Ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (globeRef.current) globeRef.current.rotation.y += 0.003
    if (dot1Ref.current) {
      dot1Ref.current.position.x = Math.cos(t * 0.5) * 1.6
      dot1Ref.current.position.z = Math.sin(t * 0.5) * 1.6
      dot1Ref.current.position.y = 0.6
    }
    if (dot2Ref.current) {
      dot2Ref.current.position.x = Math.cos(t * 0.3 + 2) * 1.8
      dot2Ref.current.position.z = Math.sin(t * 0.3 + 2) * 1.8
      dot2Ref.current.position.y = 0
    }
    if (dot3Ref.current) {
      dot3Ref.current.position.x = Math.cos(t * 0.4 + 4) * 1.5
      dot3Ref.current.position.z = Math.sin(t * 0.4 + 4) * 1.5
      dot3Ref.current.position.y = -0.4
    }
  })

  return (
    <group scale={[0.85, 0.85, 0.85]}>
      {/* Main Globe */}
      <mesh ref={globeRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* Try texture first, fallback to solid color */}
        <GlobeTexture />
      </mesh>

      {/* Wireframe overlay for grid lines */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[1.002, 16, 16]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[1.08, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Shadow below globe */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color="#2563EB"
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh
        position={[0, -1.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.5, 0.6, 1]}
      >
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial
          color="#2563EB"
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Equator ring */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[1.05, 0.008, 8, 64]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.25} />
      </mesh>

      {/* Orbiting dots */}
      <mesh ref={dot1Ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#2563EB"
          emissive="#2563EB"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh ref={dot2Ref}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh ref={dot3Ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}