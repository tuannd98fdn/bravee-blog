import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Tạo chùm hạt sáng bao quanh lõi
function ParticleGalaxy({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorA = new THREE.Color('#3B82F6'); // Brand Blue
    const colorB = new THREE.Color('#8B5CF6'); // Brand Purple
    const colorC = new THREE.Color('#D8B4FE'); // Brand Light Purple

    for (let i = 0; i < particleCount; i++) {
      // Dàn trải theo dạng đĩa thiên hà (Galaxy disk)
      const radius = 1.5 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.8;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Trộn màu ngẫu nhiên cho hạt
      const mix = Math.random();
      const mixedColor = mix < 0.33 ? colorA : mix < 0.66 ? colorB : colorC;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.1;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles.positions} colors={particles.colors} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={0.06} 
        sizeAttenuation={true} 
        depthWrite={false} 
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        opacity={isLight ? 0.6 : 0.8}
      />
    </Points>
  );
}

// Khối lõi năng lượng phức tạp (TorusKnot + Sphere)
function EnergyCore({ isLight }: { isLight: boolean }) {
  const coreRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (coreRef.current) {
      // Tương tác xoay theo chuột
      const targetX = (state.pointer.x * Math.PI) / 2;
      const targetY = (state.pointer.y * Math.PI) / 2;
      
      coreRef.current.rotation.y += 0.05 * (targetX - coreRef.current.rotation.y);
      coreRef.current.rotation.x += 0.05 * (targetY - coreRef.current.rotation.x);
      
      // Xoay tự động
      coreRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Lõi đặc màu đen có viền sáng */}
      <Sphere args={[0.9, 64, 64]}>
        <meshStandardMaterial 
          color={isLight ? "#ffffff" : "#000000"} 
          emissive={isLight ? "#e2e8f0" : "#1a0b2e"} 
          emissiveIntensity={isLight ? 0.2 : 0.5} 
          roughness={isLight ? 0.5 : 0.2} 
          metalness={isLight ? 0.2 : 0.8} 
        />
      </Sphere>

      {/* Lớp lưới Năng lượng đan chéo - Lõi sáng */}
      <mesh>
        <torusKnotGeometry args={[1.2, 0.03, 128, 32]} />
        <meshBasicMaterial 
          color="#8B5CF6" 
          wireframe={true} 
          transparent
          opacity={isLight ? 0.8 : 0.5}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lớp lưới Fake Bloom 1 */}
      {!isLight && (
        <mesh scale={[1.01, 1.01, 1.01]}>
          <torusKnotGeometry args={[1.2, 0.03, 128, 32]} />
          <meshBasicMaterial 
            color="#8B5CF6" 
            wireframe={true} 
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Lớp lưới Fake Bloom 2 */}
      {!isLight && (
        <mesh scale={[1.03, 1.03, 1.03]}>
          <torusKnotGeometry args={[1.2, 0.03, 128, 32]} />
          <meshBasicMaterial 
            color="#D8B4FE" 
            wireframe={true} 
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Lớp lưới Xanh bọc ngoài */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial 
          color="#3B82F6" 
          wireframe={true} 
          transparent 
          opacity={isLight ? 0.3 : 0.2}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    };
    
    // Check initial
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', cursor: 'grab', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 45 }} 
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Lights */}
        <ambientLight intensity={isLight ? 0.8 : 0.2} />
        <pointLight position={[0, 0, 0]} intensity={isLight ? 1 : 2} color="#8B5CF6" distance={5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#8B5CF6" />
        
        {/* Floating Scene */}
        <Float 
          speed={2} 
          rotationIntensity={0.5} 
          floatIntensity={1}
          floatingRange={[-0.1, 0.1]}
        >
          <EnergyCore isLight={isLight} />
          <ParticleGalaxy isLight={isLight} />
        </Float>
      </Canvas>
    </div>
  );
}
