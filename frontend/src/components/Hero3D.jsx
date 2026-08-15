import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Environment,
  useGLTF,
  Float,
  MeshReflectorMaterial,
  Sparkles
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Elite 3D Hero Component
 * Cinematic car reveal with scroll-linked choreography
 */

function CarModel({ scrollProgress, mousePosition }) {
  const groupRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Scroll-linked rotation (smooth and weighted)
    const targetRotationY = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );

    // Mouse parallax (subtle, premium feel)
    const targetRotationX = mousePosition.y * 0.3;
    const targetRotationZ = -mousePosition.x * 0.2;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.03
    );

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotationZ,
      0.03
    );

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Placeholder geometry - replace with actual car model */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Rim light effect */}
      <pointLight
        position={[0, 2, -2]}
        intensity={0.5}
        color="#C9A84C"
        distance={8}
      />
    </group>
  );
}

function Scene({ scrollProgress, mousePosition }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Key light (gold rim) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#E0C06A"
        castShadow
      />

      {/* Fill light */}
      <directionalLight
        position={[-3, 2, -5]}
        intensity={0.3}
        color="#ffffff"
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Main car model */}
      <Suspense fallback={null}>
        <CarModel scrollProgress={scrollProgress} mousePosition={mousePosition} />
      </Suspense>

      {/* Floor with reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={0.3}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0e"
          metalness={0.5}
        />
      </mesh>

      {/* Particle sparkles */}
      <Sparkles
        count={100}
        scale={10}
        size={1.5}
        speed={0.3}
        opacity={0.3}
        color="#C9A84C"
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.3}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
      </EffectComposer>
    </>
  );
}

export default function Hero3D({ className = '' }) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      setScrollProgress(progress);
    };

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene scrollProgress={scrollProgress} mousePosition={mousePosition} />
      </Canvas>

      {/* Loading indicator */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#C9A84C',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>
          Loading Experience...
        </div>
      )}
    </motion.div>
  );
}
