"use client";

import React, { useMemo, Suspense, useState, useEffect } from "react";
import { FaCloud, FaWarehouse, FaBuilding } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { cn } from "@/lib/utils";
import * as THREE from "three";

// Load 3D model
function FactoryModel() {
  const { scene } = useGLTF("/Factory_origin.glb");

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#1e293b", // Dark blue-gray
          roughness: 0.5,
          metalness: 0.1,
        });
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={2}
      position={[-2, -2.5, 0]}
      rotation={[-0.5, -0.1, 0]}
    />
  );
}
useGLTF.preload("/Factory_origin.glb");

function SmokeParticle({ position }: { position: [number, number, number] }) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const startY = position[1];
  const startTime = useMemo(() => Date.now(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const elapsed = (Date.now() - startTime) / 1000;
    mesh.position.y = startY + Math.sin(elapsed) * 0.5 + elapsed * 0.3;
    if (mesh.material && "opacity" in mesh.material) {
      (mesh.material as THREE.Material & { opacity: number }).opacity = Math.max(0, 1 - elapsed / 5);
    }
    mesh.scale.setScalar(1 + elapsed * 0.2);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 12, 3]} />
      <meshStandardMaterial
        color={"#1e293b"}
        transparent
        opacity={0.8}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function getRandomDelay(mean = 1000, stdDev = 700) {
  const u = Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(100, mean + z * stdDev); // Cap at min 100ms
}

function SmokeEmitter({ origin }: { origin: [number, number, number] }) {
  const [particles, setParticles] = useState<
    { id: number; offset: [number, number, number]; createdAt: number }[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    const spawnSmoke = () => {
      if (!isMounted) return;

      const id = Date.now();
      const offset: [number, number, number] = [
        origin[0] + (Math.random() - 0.5) * 0.2,
        origin[1],
        origin[2] + (Math.random() - 0.5) * 0.2,
      ];
      setParticles((prev) => [...prev, { id, offset, createdAt: Date.now() }]);

      const nextDelay = getRandomDelay(); // normally distributed delay
      setTimeout(spawnSmoke, nextDelay);
    };

    spawnSmoke();

    return () => {
      isMounted = false;
    };
  }, [origin]);

  // Remove old particles after 5s
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) =>
        prev.filter((p) => Date.now() - p.createdAt < 5000)
      );
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <SmokeParticle key={p.id} position={p.offset} />
      ))}
    </>
  );
}



export default function MinimalHero() {
  const floatingClouds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: 5 + (i % 3) * 8,
        left: -5 + i * 14,
        delay: i * 0.7,
        size: 180 + (i % 3) * 40,
      })),
    []
  );



  return (
    <div className="min-h-screen text-gray-800 overflow-x-hidden">
      <section
        className={cn(
          "pt-0 pb-0 min-h-screen flex items-center justify-center text-center relative overflow-hidden"
        )}
        style={{
          background: `linear-gradient(to bottom, 
rgb(175, 232, 255) 0%,      /* Sky blue */
rgb(61, 81, 135) 70%,     /* Dark blue */
    #0f172a 90%,     /* Even darker navy blue */
    #000000 100%     /* Black at bottom */
  )`,
        }}
      >
        {/* Skyline at the top */}
        <div className="absolute top-0 left-0 w-full h-32 z-10 overflow-hidden"></div>

        {/* Perspective grid that goes down toward ground */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(
                rgba(135, 206, 235, 0.15) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(135, 206, 235, 0.15) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "80px 80px",
            transform: "perspective(800px) rotateX(60deg)",
            transformOrigin: "center top",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 70%, transparent 100%)",
          }}
        />

        {/* Additional perspective grid for depth */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(
                rgba(70, 130, 180, 0.1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(70, 130, 180, 0.1) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "40px 40px",
            transform: "perspective(600px) rotateX(70deg)",
            transformOrigin: "center 40%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 80%, transparent 100%)",
          }}
        />

        {/* Floating clouds */}
        {floatingClouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute opacity-40 hidden md:block"
            style={{
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              animation: `float-bounce 8s ease-in-out ${cloud.delay}s infinite`,
            }}
          >
            <FaCloud
              style={{ width: `${cloud.size}px`, height: `${cloud.size}px` }}
              className="text-white drop-shadow-lg"
            />
          </div>
        ))}

        {/* 3D Factory in bottom-left */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] z-20 pointer-events-none">
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <Suspense fallback={null}>
              <FactoryModel />
              <SmokeEmitter origin={[-1.6, 0.8, 0.5]} />
              <SmokeEmitter origin={[-1.4, 0.8, 0.5]} />
              <Environment preset="sunset" />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Suspense>
          </Canvas>
        </div>


        {/* Content area */}
        <div className="relative z-15 text-white pt-40">
          <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
            Urban Skyline
          </h1>
          <p className="text-xl opacity-90 drop-shadow-md">
            Where the city meets the horizon
          </p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float-bounce {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-3px);
          }
          75% {
            transform: translateY(-12px) translateX(2px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
