import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Internal controller to handle camera position dynamically based on GSAP scroll variables
function CameraController({ stateRef }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (!stateRef.current) return;
    const { cameraX, cameraY, cameraZ, cameraTargetY, mouseParallaxX, mouseParallaxY } = stateRef.current;
    
    // Smoothly interpolate camera position
    camera.position.x += (cameraX + mouseParallaxX * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (cameraY + mouseParallaxY * 1.0 - camera.position.y) * 0.05;
    camera.position.z += (cameraZ - camera.position.z) * 0.05;
    
    // Look slightly towards the satellite with y-offset target
    const currentTargetY = cameraTargetY || 0;
    camera.lookAt(0, currentTargetY, 0);
  });
  
  return null;
}

// Procedural Spacecraft Component (The Aditya-L1 Spacecraft - Engineered for high photorealism)
function Spacecraft({ stateRef, goldFoilBumpTexture, solarCellTexture }) {
  const groupRef = useRef();
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();
  const antennaRef = useRef();
  const instrumentRef = useRef();
  const thrustersRef = useRef();

  useFrame((state) => {
    if (!stateRef.current) return;
    const { assembly, satelliteRotationY, satelliteX, satelliteY, satelliteZ } = stateRef.current;

    const time = state.clock.getElapsedTime();
    
    // Float motion (very slow, heavy space weight)
    const floatOffset = Math.sin(time * 0.35) * 0.015;
    groupRef.current.position.x = -2.2 + (satelliteX || 0);
    groupRef.current.position.y = 0.6 + (satelliteY || 0) + floatOffset;
    groupRef.current.position.z = 0.5 + (satelliteZ || 0);

    // Slow majestic cinematic spin (almost static, typical of L1-stationkeeping satellites)
    const targetSpin = (satelliteRotationY || 0) + time * 0.012;
    groupRef.current.rotation.y = targetSpin;
    groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.012;
    groupRef.current.rotation.z = Math.cos(time * 0.12) * 0.008;

    // Scale it down to make it a smaller elegant sentinel monitoring the sun
    groupRef.current.scale.setScalar(0.4);

    // Phase animations driven by 'assembly' progress value (0 to 1)
    
    // Phase 1: Left Solar Panel (SoLEXS) [0.1 to 0.35]
    const p1 = Math.min(Math.max((assembly - 0.05) * 4, 0), 1);
    leftPanelRef.current.position.x = -4 + p1 * 2.3;
    leftPanelRef.current.scale.setScalar(p1);

    // Phase 2: Right Solar Panel (HEL1OS) [0.3 to 0.55]
    const p2 = Math.min(Math.max((assembly - 0.25) * 4, 0), 1);
    rightPanelRef.current.position.x = 4 - p2 * 2.3;
    rightPanelRef.current.scale.setScalar(p2);

    // Phase 3: High Gain Antenna [0.5 to 0.75]
    const p3 = Math.min(Math.max((assembly - 0.45) * 4, 0), 1);
    antennaRef.current.rotation.x = Math.PI / 2 - p3 * (Math.PI / 2);
    antennaRef.current.scale.setScalar(p3);

    // Phase 4: Instruments and Sensors [0.7 to 0.9]
    const p4 = Math.min(Math.max((assembly - 0.65) * 5, 0), 1);
    instrumentRef.current.position.z = -1.6 + p4 * 1.0;
    instrumentRef.current.scale.setScalar(p4);

    // Phase 5: Thruster Ignition and Glimmer [0.85 to 1.0]
    const p5 = Math.min(Math.max((assembly - 0.85) * 6.6, 0), 1);
    const flicker = 1.0 + Math.sin(time * 8) * 0.04;
    thrustersRef.current.scale.set(p5 * flicker, p5 * flicker * 1.2, p5 * flicker);
  });

  return (
    <group ref={groupRef}>
      {/* 1. CENTRAL MODULE (Refined satin MLI Gold Foil Spacecraft Bus with procedural bump mapping) */}
      <mesh castShadow receiveShadow name="spacecraft-bus">
        <boxGeometry args={[1.2, 1.5, 1.2]} />
        <meshStandardMaterial
          color="#e5c158" 
          metalness={0.96}
          roughness={0.28}
          bumpMap={goldFoilBumpTexture}
          bumpScale={0.035}
          emissive="#2d1d02"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Structural Carbon/Titanium Rings */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.28, 0.06, 1.28]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <boxGeometry args={[1.28, 0.06, 1.28]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Reaction Control System (RCS) Attitude Thruster Pods on the corners */}
      <group position={[0.58, 0.7, 0.58]}>
        <mesh><boxGeometry args={[0.1, 0.1, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, Math.PI/2, 0]}><cylinderGeometry args={[0.015, 0.03, 0.05]} /><meshStandardMaterial color="#7f8c8d" metalness={0.9} /></mesh>
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.015, 0.03, 0.05]} /><meshStandardMaterial color="#7f8c8d" metalness={0.9} /></mesh>
      </group>
      <group position={[-0.58, 0.7, -0.58]}>
        <mesh><boxGeometry args={[0.1, 0.1, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[-0.06, 0, 0]} rotation={[0, -Math.PI/2, 0]}><cylinderGeometry args={[0.015, 0.03, 0.05]} /><meshStandardMaterial color="#7f8c8d" metalness={0.9} /></mesh>
        <mesh position={[0, 0, -0.06]} rotation={[-Math.PI/2, 0, 0]}><cylinderGeometry args={[0.015, 0.03, 0.05]} /><meshStandardMaterial color="#7f8c8d" metalness={0.9} /></mesh>
      </group>

      {/* Magnetometer (MAG) Scientific Boom - High Realism signature instrument of Aditya-L1 */}
      <group position={[-0.55, -0.6, 0.55]} rotation={[Math.PI / 1.5, 0, -Math.PI / 4]}>
        {/* Long ultra-slender carbon composite spar */}
        <mesh>
          <cylinderGeometry args={[0.015, 0.01, 1.4, 8]} />
          <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.7} />
        </mesh>
        {/* Silver sensor sphere at the tip */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>

      {/* Plasma Analyzer instrument rod */}
      <group position={[0.55, -0.6, -0.55]} rotation={[Math.PI / 1.2, 0, Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.008, 0.9, 8]} />
          <meshStandardMaterial color="#1c1c1c" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.06]} />
          <meshStandardMaterial color="#dfb842" metalness={0.9} />
        </mesh>
      </group>

      {/* Star Trackers (Mini optical navigation sensors for high spatial realism) */}
      <group position={[0.55, 0.6, 0.55]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.035, 0.18, 12]} />
          <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      <group position={[-0.55, 0.6, -0.55]} rotation={[0, 0, Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.035, 0.18, 12]} />
          <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Silver Radiator Panels on fore/aft sides of the core bus */}
      <mesh position={[0, 0, 0.61]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshStandardMaterial color="#eceff1" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.61]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshStandardMaterial color="#eceff1" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* High-tech internal core details */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.48]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.7} />
      </mesh>

      {/* 2. LEFT SOLAR PANEL (SoLEXS Observatory System with realistic blue silicon textures) */}
      <group ref={leftPanelRef} position={[-4, 0, 0]} scale={0}>
        {/* Support boom */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.85, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.7]} />
          <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Panel Support frame */}
        <mesh position={[2.1, 0, 0]}>
          <boxGeometry args={[2.0, 0.9, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Solar Cells - high realistic silicon sheen mapped to high-fidelity grid */}
        <mesh position={[2.1, 0, 0.04]}>
          <boxGeometry args={[1.9, 0.82, 0.012]} />
          <meshStandardMaterial
            map={solarCellTexture}
            color="#ffffff" 
            metalness={0.98}
            roughness={0.08}
            emissive="#010614"
          />
        </mesh>
        {/* Procedural Solar Grid - very fine, subtle and realistic blue/dark pattern */}
        <mesh position={[2.1, 0, 0.048]} rotation={[Math.PI / 2, 0, 0]}>
          <gridHelper args={[1.9, 12, '#3b82f6', '#111827']} />
        </mesh>
      </group>

      {/* 3. RIGHT SOLAR PANEL (HEL1OS Observatory System with realistic blue silicon textures) */}
      <group ref={rightPanelRef} position={[4, 0, 0]} scale={0}>
        {/* Support boom */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.85, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.7]} />
          <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Panel Support frame */}
        <mesh position={[-2.1, 0, 0]}>
          <boxGeometry args={[2.0, 0.9, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Solar Cells - high realistic silicon sheen mapped to high-fidelity grid */}
        <mesh position={[-2.1, 0, 0.04]}>
          <boxGeometry args={[1.9, 0.82, 0.012]} />
          <meshStandardMaterial
            map={solarCellTexture}
            color="#ffffff" 
            metalness={0.98}
            roughness={0.08}
            emissive="#010614"
          />
        </mesh>
        {/* Procedural Solar Grid - very fine, subtle and realistic blue/dark pattern */}
        <mesh position={[-2.1, 0, 0.048]} rotation={[Math.PI / 2, 0, 0]}>
          <gridHelper args={[1.9, 12, '#3b82f6', '#111827']} />
        </mesh>
      </group>

      {/* 4. MAIN COMMUNICATIONS HIGH-GAIN DISH (Top Antenna) */}
      <group ref={antennaRef} position={[0, 0.8, 0]} scale={0}>
        {/* Boom mount */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#95a5a6" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Dish structural backing struts */}
        <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.36]} />
          <meshStandardMaterial color="#2d3436" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.36]} />
          <meshStandardMaterial color="#2d3436" metalness={0.9} />
        </mesh>
        {/* Dish */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.12, 0.22, 32, 1, true]} />
          <meshStandardMaterial color="#f0f3f4" metalness={0.88} roughness={0.22} side={2} />
        </mesh>
        {/* Central Feed Horn */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.02, 0.012, 0.45]} />
          <meshStandardMaterial color="#dfb842" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#ff7b00" />
        </mesh>
      </group>

      {/* 5. INSTRUMENT OBSERVATORY BAY (SoLEXS & HEL1OS Sensors) */}
      <group ref={instrumentRef} position={[0, 0, -1.6]} scale={0}>
        {/* Base bracket */}
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[0.8, 0.6, 0.3]} />
          <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* SoLEXS (Solar Low Energy X-ray Spectrometer) - Cylinder Pod */}
        <mesh position={[-0.22, 0.12, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.55]} />
          <meshStandardMaterial color="#1e272e" metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Glowing Orange aperture lens */}
        <mesh position={[-0.22, 0.12, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#ff5e00" emissive="#ff3d00" emissiveIntensity={3.0} />
        </mesh>

        {/* HEL1OS (High Energy L1 Orbiting Spectrometer) - Square Pod */}
        <mesh position={[0.22, -0.1, 0.15]}>
          <boxGeometry args={[0.32, 0.32, 0.5]} />
          <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Grid aperture detector */}
        <mesh position={[0.22, -0.1, -0.11]}>
          <boxGeometry args={[0.24, 0.24, 0.02]} />
          <meshStandardMaterial color="#ff9f00" emissive="#ff6f00" emissiveIntensity={2.0} />
        </mesh>

        {/* Glowing Data Bus Cable Line */}
        <mesh position={[0, -0.1, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6]} />
          <meshStandardMaterial color="#ff7b00" emissive="#ff3d00" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* 6. CONTROL THRUSTERS (Stabilizer plumes - realistic violet/blue ion glow) */}
      <group position={[0, -0.8, 0]}>
        {/* Thruster Bell */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 0.16]} />
          <meshStandardMaterial color="#2d3436" metalness={0.9} roughness={0.35} />
        </mesh>
        {/* Glowing engine plasma */}
        <mesh ref={thrustersRef} position={[0, -0.22, 0]} scale={[0, 0, 0]}>
          <coneGeometry args={[0.08, 0.3, 16]} />
          <meshBasicMaterial color="#5086ff" transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// Distant Earth at Lagrangian Point L1 (For geometric scale and majestic realism)
function EarthAtL1({ earthTexture }) {
  const earthRef = useRef();
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.getElapsedTime() * 0.003;
      earthRef.current.rotation.x = 0.4; // Realistic planetary tilt
    }
  });

  return (
    <group position={[5.2, -1.8, 3.2]}>
      {/* Earth Sphere */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.65}
          metalness={0.12}
          emissive="#02091c"
        />
      </mesh>
      
      {/* Atmospheric Blue Halo Glow */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.16} 
          side={2}
        />
      </mesh>
    </group>
  );
}

// Lagrangian L1 Halo Orbit path visualization
function L1HaloOrbit() {
  return (
    <group position={[-2.2, 0.6, 0.5]}>
      {/* Extremely delicate, beautiful halo orbit guide ring */}
      <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[0.9, 0.003, 8, 64]} />
        <meshBasicMaterial color="#dfb842" transparent opacity={0.15} />
      </mesh>
      {/* Core L1 beacon gravity center */}
      <mesh>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Camera Lens Flare optical elements to replicate space camera aperture reflections
function CameraFlares() {
  const f1 = useRef();
  const f2 = useRef();
  const f3 = useRef();
  const f4 = useRef();

  useFrame((state) => {
    const sunPos = new THREE.Vector3(0, 0, -2.5);
    const camPos = state.camera.position;
    
    // Line up flares along refraction line between the sun and camera lens
    if (f1.current) f1.current.position.copy(new THREE.Vector3().lerpVectors(sunPos, camPos, 0.38));
    if (f2.current) f2.current.position.copy(new THREE.Vector3().lerpVectors(sunPos, camPos, 0.52));
    if (f3.current) f3.current.position.copy(new THREE.Vector3().lerpVectors(sunPos, camPos, 0.66));
    if (f4.current) f4.current.position.copy(new THREE.Vector3().lerpVectors(sunPos, camPos, 0.78));
  });

  return (
    <group>
      <mesh ref={f1}>
        <ringGeometry args={[0.1, 0.106, 32]} />
        <meshBasicMaterial color="#ff7b00" transparent opacity={0.12} side={2} />
      </mesh>
      <mesh ref={f2}>
        <ringGeometry args={[0.03, 0.033, 32]} />
        <meshBasicMaterial color="#00d2ff" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh ref={f3}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffa600" transparent opacity={0.03} />
      </mesh>
      <mesh ref={f4}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// Sun and Solar Flare Component (Engineered for majestic, physically grounded solar realism)
function SunAndFlare({ stateRef, sunTexture }) {
  const sunGroupRef = useRef();
  const flareParticlesRef = useRef();
  const solarPlumesRef = useRef();
  const particleCount = 140;

  // Initialize random trajectory properties for the solar flare plasma eruption (smaller, finer particles)
  const flareMeta = useMemo(() => {
    const list = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        offsetX: (Math.random() - 0.5) * 4.5,
        offsetY: (Math.random() - 0.5) * 4.5,
        offsetZ: (Math.random() - 0.5) * 1.5,
        startDelay: Math.random() * 0.8,
        size: 0.016 + Math.random() * 0.045, // small, high-fidelity plasma dust
      });
    }
    return list;
  }, [particleCount]);

  useFrame((state) => {
    if (!stateRef.current) return;
    const { sunScale, flareActive } = stateRef.current;
    const time = state.clock.getElapsedTime();

    // Scale and rotate Sun in the center (unwavering, stable scale for physical accuracy)
    if (sunGroupRef.current) {
      const activeScale = (sunScale || 1.0) * 1.8;
      sunGroupRef.current.scale.setScalar(activeScale);
      sunGroupRef.current.rotation.y = time * 0.005; // slow majestic solar rotation
      sunGroupRef.current.position.set(0, 0, -2.5);
      
      // Animate texture offset to create realistic convective churning of plasma gas
      if (sunTexture) {
        sunTexture.offset.x = time * 0.002;
        sunTexture.offset.y = time * 0.0008;
      }
    }

    // Spin solar coronal loops slowly representing twisting magnetosphere
    if (solarPlumesRef.current) {
      solarPlumesRef.current.rotation.z = time * 0.015;
      solarPlumesRef.current.rotation.y = time * 0.01;
    }

    // Flare Particle Projector (Erupts outwards from central Sun)
    if (flareParticlesRef.current) {
      const children = flareParticlesRef.current.children;
      const progress = flareActive || 0;
      
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i];
        const meta = flareMeta[i];
        
        // Loop timeline for each particle
        const t = (progress * 1.4 + meta.startDelay) % 1.0;
        
        // Erupt outwards from the central sun position
        const startX = 0;
        const startY = 0;
        const startZ = -2.5;
        
        const endX = meta.offsetX * 3.5;
        const endY = meta.offsetY * 3.5;
        const endZ = 5 + meta.offsetZ * 2;
        
        // Mid-point curve sway representing coronal loops
        const midX = (startX + endX) / 2 + meta.offsetX * (1 - t);
        const midY = (startY + endY) / 2 + meta.offsetY * Math.sin(t * Math.PI) * 0.5;
        const midZ = (startZ + endZ) / 2 + meta.offsetZ * 0.5;
        
        // Quadratic Bezier interpolation for natural physics flows
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
        const z = (1 - t) * (1 - t) * startZ + 2 * (1 - t) * t * midZ + t * t * endZ;
        
        mesh.position.set(x, y, z);
        
        // Fade out particle as it moves further away from the sun's surface
        const scaleVal = meta.size * Math.sin(t * Math.PI) * (1.0 - t * 0.3);
        mesh.scale.setScalar(scaleVal > 0 ? scaleVal : 0.001);
      }
    }
  });

  return (
    <group>
      {/* 1. THE SUN ASSEMBLY */}
      <group ref={sunGroupRef} position={[0, 0, -2.5]} scale={0}>
        {/* Core hot plasma - high fidelity convection texture mapped as color and emissive */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial 
            map={sunTexture} 
            color="#ffffff" 
          />
        </mesh>
        
        {/* Layer 2: Glowing solar atmosphere */}
        <mesh scale={[1.04, 1.04, 1.04]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ff7b00" transparent opacity={0.6} />
        </mesh>

        {/* Layer 3: Magnetic coronal shell */}
        <mesh scale={[1.12, 1.12, 1.12]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ff9f00" transparent opacity={0.3} />
        </mesh>

        {/* Layer 4: Soft solar wind glow */}
        <mesh scale={[1.25, 1.25, 1.25]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffb300" transparent opacity={0.12} />
        </mesh>

        {/* Rotating Corona Prominence Coronal Loops (Fusing physics with elegant UI) */}
        <group ref={solarPlumesRef}>
          {/* Loop 1: Equatorial magnetic ring */}
          <mesh rotation={[0.2, 0.4, 0]}>
            <torusGeometry args={[1.18, 0.012, 8, 48]} />
            <meshBasicMaterial color="#ff5100" transparent opacity={0.4} />
          </mesh>
          {/* Loop 2: Tilted magnetic loop */}
          <mesh rotation={[0.8, -0.6, 0.3]}>
            <torusGeometry args={[1.3, 0.008, 8, 48]} />
            <meshBasicMaterial color="#ffb000" transparent opacity={0.3} />
          </mesh>
          {/* Loop 3: Opposite tilt loop */}
          <mesh rotation={[-0.5, 1.0, -0.4]}>
            <torusGeometry args={[1.24, 0.01, 8, 48]} />
            <meshBasicMaterial color="#ff3300" transparent opacity={0.35} />
          </mesh>
          {/* Loop 4: Outer faint magnetic shell */}
          <mesh rotation={[1.3, 0.1, 0.6]}>
            <torusGeometry args={[1.4, 0.006, 8, 48]} />
            <meshBasicMaterial color="#ffa200" transparent opacity={0.2} />
          </mesh>
        </group>
      </group>

      {/* 2. ERUPTING SOLAR FLARE PARTICLE VECTOR STREAM (High-fidelity fine plasma mist) */}
      <group ref={flareParticlesRef}>
        {Array.from({ length: particleCount }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial 
              color={i % 3 === 0 ? "#ff2200" : i % 3 === 1 ? "#ff6a00" : "#ffb300"} 
              transparent 
              opacity={0.75} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Interactive holographic HUD projection rings around the spacecraft
function HUDOverlay({ stateRef }) {
  const overlayRef = useRef();

  useFrame((state) => {
    if (!stateRef.current) return;
    const { predictionUI } = stateRef.current;
    
    if (overlayRef.current) {
      overlayRef.current.scale.setScalar(predictionUI);
      overlayRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
      overlayRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.08;
    }
  });

  return (
    <group ref={overlayRef} scale={0}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Main telemetry ring */}
        <mesh>
          <torusGeometry args={[2.0, 0.015, 8, 64]} />
          <meshBasicMaterial color="#ff7b00" transparent opacity={0.5} />
        </mesh>
        {/* Outer dotted scanning ring */}
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[2.3, 0.01, 8, 48, Math.PI * 1.6]} />
          <meshBasicMaterial color="#ffb300" transparent opacity={0.3} />
        </mesh>
        {/* Inner high-frequency targeting ring */}
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <torusGeometry args={[1.7, 0.008, 8, 32, Math.PI * 0.8]} />
          <meshBasicMaterial color="#ff3d00" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Futuristic prediction laser trajectories */}
      <group>
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const dist = 2.0;
          return (
            <group key={i} position={[Math.cos(angle) * dist, Math.sin(angle) * dist, 0]} rotation={[0, 0, angle]}>
              <mesh position={[0, 0, 0.8]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 1.6]} />
                <meshBasicMaterial color="#ff7b00" transparent opacity={0.2} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Main 3D Scene Wrapper
export default function SolarScene({ stateRef }) {
  
  // 1. Procedural Wrinkled Gold Foil MLI Bump Map
  const goldFoilBumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);
    
    // Draw micro fine random lines to replicate wrinkled insulation sheets
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 128, Math.random() * 128);
      ctx.lineTo(Math.random() * 128, Math.random() * 128);
      ctx.stroke();
    }
    ctx.strokeStyle = '#666666';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 128, Math.random() * 128);
      ctx.lineTo(Math.random() * 128, Math.random() * 128);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // 2. Procedural Silicon Solar Cell Grid Texture
  const solarCellTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#081432'; // Deep space solar-blue base
    ctx.fillRect(0, 0, 256, 256);
    
    // Fine cell boundaries
    ctx.strokeStyle = '#3a7bd5';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 256; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y <= 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    // High contrast black segments
    ctx.strokeStyle = '#020510';
    ctx.lineWidth = 2;
    for (let x = 0; x <= 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // 3. Procedural Photorealistic Earth Surface Texture (Oceans, Continents & Swirling Atmosphere)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Deep Ocean Water
    ctx.fillStyle = '#0b1d3a';
    ctx.fillRect(0, 0, 256, 128);
    
    // Draw continental green/brown land masses
    ctx.fillStyle = '#22543d';
    // Africa-ish / Europe
    ctx.beginPath(); ctx.arc(110, 64, 24, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(118, 42, 17, 0, Math.PI * 2); ctx.fill();
    // Asia-ish / India
    ctx.beginPath(); ctx.arc(162, 46, 26, 0, Math.PI * 2); ctx.fill();
    // America-ish
    ctx.beginPath(); ctx.arc(42, 48, 20, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(52, 88, 16, 0, Math.PI * 2); ctx.fill();
    // Australia
    ctx.beginPath(); ctx.arc(195, 92, 13, 0, Math.PI * 2); ctx.fill();

    // Vibrant vegetation details
    ctx.fillStyle = '#2f855a';
    ctx.beginPath(); ctx.arc(112, 54, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(158, 42, 13, 0, Math.PI * 2); ctx.fill();
    
    // Swirling atmospheric clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
    ctx.beginPath(); ctx.arc(95, 48, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(128, 64, 44, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(128, 64, 24, Math.PI, Math.PI * 1.8); ctx.stroke();

    // White Polar ice caps
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, 256, 11);
    ctx.fillRect(0, 117, 256, 11);
    
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // 4. Procedural Photorealistic Sun Surface (Granular Convective cells + Dynamic Sunspots)
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const imgData = ctx.createImageData(512, 256);
    const data = imgData.data;
    
    // Generate organic high-density solar convective granules using multi-octave solar noise
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;
        
        const nx = (x / 512) * Math.PI * 2;
        const ny = (y / 256) * Math.PI;
        
        // Multi-octave convective turbulence mapping
        let val = Math.sin(nx * 18) * Math.cos(ny * 18) * 0.3
                + Math.sin(nx * 38 + ny * 22) * 0.18
                + Math.sin(nx * 76 - ny * 38) * 0.12
                + Math.sin(nx * 150 + ny * 90) * 0.08
                + Math.sin(nx * 280 - ny * 150) * 0.04
                + 0.5;
        
        val = Math.max(0, Math.min(1, val));
        
        // Advanced Solar Blackbody Color Mapping (rich burning orange, blazing gold and deep plasma valleys)
        data[idx] = Math.floor(255 * Math.min(1, 0.82 + val * 0.35)); // Red (highly saturated)
        data[idx + 1] = Math.floor(255 * (Math.pow(val, 1.4) * 0.72 + 0.12)); // Green (rich orange-yellow, avoiding artificial butter-yellow)
        data[idx + 2] = Math.floor(255 * (Math.pow(val, 3) * 0.22)); // Blue
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    
    // Layer 5 sunspot clusters (active magnetic zones with dark cooler cores)
    for (let s = 0; s < 5; s++) {
      const sx = Math.random() * 512;
      const sy = 80 + Math.random() * 96;
      const size = 6 + Math.random() * 7;
      
      const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, size);
      grad.addColorStop(0, '#0a0100'); // Cold magnetic umbra
      grad.addColorStop(0.4, '#380b00'); // Penumbra thermal zone
      grad.addColorStop(1, 'rgba(255, 110, 0, 0)'); // Dissolve blend
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Fine filament loops out of sunspots
      ctx.strokeStyle = '#ffae00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sx + size, sy, size * 1.4, Math.PI, Math.PI * 1.8);
      ctx.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping; // seamless scrolling
    return tex;
  }, []);

  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#03050c']} />
        
        {/* Space Dust, Cosmic Backdrop & Stars */}
        <Stars radius={120} depth={50} count={3800} factor={4} saturation={0.5} fade speed={1.5} />
        <Sparkles count={80} scale={15} size={1.2} speed={0.4} color="#ffb300" />
        <Sparkles count={40} scale={8} size={2.0} speed={0.8} color="#ff3d00" />
        
        {/* Cinematic dramatic space lighting */}
        <ambientLight intensity={0.15} />
        
        {/* Key Light representing far-away solar illumination */}
        <directionalLight
          position={[10, 5, -8]}
          intensity={2.8}
          color="#ffebd9"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Accent Orange backlight from the erupting sun */}
        <directionalLight
          position={[0, 1, -5]}
          intensity={5.0}
          color="#ff7b00"
        />

        {/* Cool cosmic rim blue light */}
        <directionalLight
          position={[-8, -4, 4]}
          intensity={1.2}
          color="#2563eb"
        />
        
        {/* Faint subtle fill light */}
        <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />

        {/* L1 Halo Orbit ring line */}
        <L1HaloOrbit />

        {/* Distant Earth model seen facing the Sun from L1 */}
        <EarthAtL1 earthTexture={earthTexture} />

        {/* Photorealistic Spacecraft with custom MLI gold wrapping and solar cells */}
        <Spacecraft 
          stateRef={stateRef} 
          goldFoilBumpTexture={goldFoilBumpTexture} 
          solarCellTexture={solarCellTexture} 
        />
        
        {/* Photorealistic Textured Sun with plasma convective fields and sunspots */}
        <SunAndFlare stateRef={stateRef} sunTexture={sunTexture} />
        
        {/* Floating cinematic camera lens flares */}
        <CameraFlares />

        {/* Interactive targeting overlays */}
        <HUDOverlay stateRef={stateRef} />

        {/* Global camera coordinator */}
        <CameraController stateRef={stateRef} />
      </Canvas>
    </div>
  );
}
