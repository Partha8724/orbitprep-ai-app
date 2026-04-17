"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function OrbitalRing({ radius, color, speed, tilt }: {
  radius: number;
  color: string;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function OrbitingDot({ orbitRadius, color, speed, offset, tilt }: {
  orbitRadius: number;
  color: string;
  speed: number;
  offset: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = useRef(offset);

  useFrame((_, delta) => {
    angle.current += delta * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(angle.current) * orbitRadius;
      ref.current.position.y = Math.sin(angle.current) * orbitRadius * Math.sin(tilt);
      ref.current.position.z = Math.sin(angle.current) * orbitRadius * Math.cos(tilt);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        roughness={0}
        metalness={0.8}
      />
    </mesh>
  );
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
      ref.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 64, 64]} />
      <meshStandardMaterial
        color="#050816"
        emissive="#0891b2"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.9}
        wireframe={false}
      />
    </mesh>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.15;
      ref.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.58, 32, 32]} />
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#06b6d4" />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[0, -5, 3]} intensity={0.8} color="#10b981" />

      {/* Stars background */}
      <Stars radius={80} depth={60} count={3000} factor={3} fade speed={0.5} />

      {/* Core sphere */}
      <CoreSphere />
      <WireframeSphere />

      {/* Orbital rings */}
      <OrbitalRing radius={1.1} color="#06b6d4" speed={0.5} tilt={0.2} />
      <OrbitalRing radius={1.5} color="#8b5cf6" speed={-0.3} tilt={1.1} />
      <OrbitalRing radius={2.0} color="#10b981" speed={0.2} tilt={0.7} />

      {/* Orbiting dots */}
      <OrbitingDot orbitRadius={1.1} color="#06b6d4" speed={1.2} offset={0} tilt={0.2} />
      <OrbitingDot orbitRadius={1.5} color="#a78bfa" speed={-0.8} offset={2.5} tilt={1.1} />
      <OrbitingDot orbitRadius={2.0} color="#34d399" speed={0.6} offset={1.2} tilt={0.7} />
      <OrbitingDot orbitRadius={1.1} color="#67e8f9" speed={1.2} offset={Math.PI} tilt={0.2} />
    </>
  );
}

export function OrbitGlobe() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
      {/* Glow overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "30%",
          background: "radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

