"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Float, Stars } from "@react-three/drei";
import { Suspense } from "react";

function AbstractShape() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#d92323" wireframe roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

export default function CinematicIntro() {
  return (
    <div style={{ height: "100vh", width: "100%", position: "absolute", top: 0, left: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#d92323" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <AbstractShape />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
      {/* Cinematic Blur Overlay */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at center, transparent 0%, var(--background) 100%)",
          pointerEvents: "none"
        }}
      ></div>
    </div>
  );
}
