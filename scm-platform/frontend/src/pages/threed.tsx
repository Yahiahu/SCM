"use client";

import React, { useMemo, Suspense, useState, useEffect, useRef } from "react";
import { FaCloud, FaWarehouse, FaBuilding } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { cn } from "@/lib/utils";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// Model components remain the same as before
function FactoryModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/Factory_origin.glb");
  const modelRef = useRef<THREE.Group>(null);

  const factoryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = factoryMaterial;
      }
    });
  }, [scene, factoryMaterial]);

  useFrame(() => {
    if (modelRef.current) {
      const targetRotation = Math.min(scrollProgress, 1) * (Math.PI / 2);
      modelRef.current.rotation.y +=
        (targetRotation - modelRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={2}
      position={[-1, -2.5, 0]}
      rotation={[-0.5, 0, 0]}
    />
  );
}

function PalletModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/Pallet.glb");
  const modelRef = useRef<THREE.Group>(null);

  const factoryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0,
        metalness: 0,
      }),
    []
  );

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = factoryMaterial;
      }
    });
  }, [scene, factoryMaterial]);

  useFrame(() => {
    if (!modelRef.current) return;

    const slideProgress = Math.max(0, Math.min(1, scrollProgress - 1));
    const fadeOut = Math.max(0, Math.min(1, (scrollProgress - 2.2) / 0.3));

    const x = -1 + slideProgress * 1.5 + 1;
    modelRef.current.position.x = x;

    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && "material" in child) {
        const mat = (child as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = 1 - fadeOut;
      }
    });

    modelRef.current.visible = fadeOut < 1;
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.4}
      position={[-1, -2, 0]}
      rotation={[-0.5, 0, 0]}
    />
  );
}

function TruckModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/Truckk.glb");
  const modelRef = useRef<THREE.Group>(null);

  const truckMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.5,
        metalness: -0,
      }),
    []
  );

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = truckMaterial;
      }
    });
  }, [scene, truckMaterial]);

  useFrame(() => {
    if (!modelRef.current) return;

    const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 1.5) / 0.5));
    const driveOut = Math.min(1, Math.max(0, (scrollProgress - 2.5) / 12));

    modelRef.current.visible = fadeIn > 0;

    const startX = 4;
    const targetX = 3.5;
    const easedDriveOut = (1 - Math.cos(Math.PI * driveOut)) / 2;
    const parkedX = 1.5 + easedDriveOut * 220;

    const finalX =
      scrollProgress < 2.5 ? startX + (targetX - startX) * fadeIn : parkedX;

    const z = 0;
    const y = -3;

    modelRef.current.position.set(finalX, y, z);
    modelRef.current.rotation.set(-0.5, -3.2, 0);
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.25}
      position={[0, -2, 0]}
      rotation={[-0.5, 1, 0]}
    />
  );
}

// Preload models
useGLTF.preload("/Factory_origin.glb");
useGLTF.preload("/Pallet.glb");
useGLTF.preload("/Truckk.glb");

function SectionOne({
  scrollProgress,
  floatingClouds,
}: {
  scrollProgress: number;
  floatingClouds: Array<{
    id: number;
    top: number;
    left: number;
    delay: number;
    size: number;
  }>;
}) {
  return (
    <section
      className="pt-0 pb-0 min-h-screen flex items-center justify-center text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, 
          rgb(175, 232, 255) 0%,     
          rgb(61, 81, 135) 70%,     
          #0f172a 90%,              
          #000000 100%              
        )`,
      }}
    >
      {/* Skyline at the top */}
      <div className="absolute top-0 left-0 w-full h-32 z-10 overflow-hidden"></div>

      {/* Perspective grid */}
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

      {/* 3D Factory */}
      <div className="absolute bottom-0 left-0 w-[200vw] h-[40vh] -translate-x-[90vw] z-20 pointer-events-none overflow-visible">
        <Canvas
          camera={{ zoom: 50, position: [0, 5, 5], near: 0.1, far: 1000 }}
          orthographic
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} />
          <Suspense fallback={null}>
            <FactoryModel scrollProgress={scrollProgress} />
            <PalletModel scrollProgress={scrollProgress} />
            <TruckModel scrollProgress={scrollProgress} />
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
  );
}

function SectionTwo() {
  return (
    <section
      className="pt-0 pb-0 min-h-screen flex items-center justify-center text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, 
          rgb(175, 232, 255) 0%,     
          rgb(61, 81, 135) 70%,     
          #0f172a 90%,              
          #000000 100%              
        )`,
      }}
    >
      {/* Add your second canvas/scene here */}
      <div className="relative z-15 text-white pt-40">
        <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
          Next Destination
        </h1>
        <p className="text-xl opacity-90 drop-shadow-md">
          The journey continues...
        </p>
      </div>
    </section>
  );
}

export default function MinimalHero() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

 useEffect(() => {
   const container = scrollContainerRef.current;
   if (!container) return;

   const handleWheel = (e: WheelEvent) => {
     e.preventDefault();

     setScrollProgress((prev) => {
       const newProgress = Math.max(
         0,
         Math.min(10, prev + Math.sign(e.deltaY) * 0.05)
       );

       const newScrollLeft = (newProgress / 7) * window.innerWidth;
       container.scrollTo({ left: newScrollLeft, behavior: "smooth" });

       return newProgress;
     });
   };

   window.addEventListener("wheel", handleWheel, { passive: false });

   return () => {
     window.removeEventListener("wheel", handleWheel);
   };
 }, []);


  return (
    <div className="min-h-screen text-gray-800 overflow-x-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full h-screen flex overflow-x-scroll scroll-smooth snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="w-screen h-screen snap-start flex-shrink-0">
          <SectionOne
            scrollProgress={scrollProgress}
            floatingClouds={floatingClouds}
          />
        </div>
        <div className="w-screen h-screen snap-start flex-shrink-0">
          <SectionTwo />
        </div>
      </div>

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
