import { AdaptiveDpr, Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { memo, Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

const GeometricCore = memo(() => {
    const group = useRef<THREE.Group>(null!)
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.rotation.y = t * 0.1
        group.current.position.y = Math.sin(t) * 0.2
    })

    const orbitingGeometry = useMemo(() => 
        Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            speed: 1 + Math.random(),
            position: [
                Math.cos(i * Math.PI / 6) * 6,
                Math.sin(i * Math.PI * 2) * 2,
                Math.sin(i * Math.PI / 6) * 6
            ] as [number, number, number]
        })), []
    )

    return (
        <group ref={group}>
            {/* CENTRAL DISTORTED SPHERE */}
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <mesh>
                    <sphereGeometry args={[2, 48, 48]} />
                    <MeshDistortMaterial
                        color="#4c1d95"
                        speed={3}
                        distort={0.4}
                        radius={1}
                        emissive="#2e1065"
                    />
                </mesh>
            </Float>

            {/* ORBITING GEOMETRY */}
            {orbitingGeometry.map((item) => (
                <Float key={item.id} speed={item.speed} rotationIntensity={2} floatIntensity={1}>
                    <mesh position={item.position}>
                        <octahedronGeometry args={[0.5, 0]} />
                        <meshStandardMaterial 
                            color="#8b5cf6" 
                            emissive="#4c1d95" 
                            metalness={0.9} 
                            roughness={0.1}
                        />
                    </mesh>
                </Float>
            ))}

            {/* WIREFRAME SHELL */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <icosahedronGeometry args={[8, 1]} />
                <meshBasicMaterial color="#ffffff" wireframe opacity={0.05} transparent />
            </mesh>
        </group>
    )
})
GeometricCore.displayName = 'GeometricCore'

export const Scene3D = memo(() => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 50 }}>
                <AdaptiveDpr pixelated />
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <Suspense fallback={null}>
                    <GeometricCore />
                </Suspense>
            </Canvas>
        </div>
    )
})
Scene3D.displayName = 'Scene3D'
