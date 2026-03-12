"use client";

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import StudioOrb from './StudioOrb';

export default function StudioScene() {
    return (
        <div className="w-full h-full min-h-[500px] relative">
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={42} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />

                {/* Lighting Setup */}
                <ambientLight intensity={1.2} />
                <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={2} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#f472b6" />
                <Environment preset="city" />

                {/* The Globe with requested enhancements exists inside StudioOrb */}
                <StudioOrb />

                {/* Dynamic Shadows */}
                <ContactShadows
                    position={[0, -1.8, 0]}
                    opacity={0.3}
                    scale={10}
                    blur={3}
                    far={4.5}
                />
            </Canvas>
        </div>
    );
}
