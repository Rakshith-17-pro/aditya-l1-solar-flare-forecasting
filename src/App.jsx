import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

import SolarScene from './components/SolarScene.jsx';
import HeroScene from './components/HeroScene.jsx';
import SatelliteAssembly from './components/SatelliteAssembly.jsx';
import LiveGraph from './components/LiveGraph.jsx';
import RiskDashboard from './components/RiskDashboard.jsx';
import FinalMission from './components/FinalMission.jsx';

const MODULES = [
  { id: 0, label: "Overview", code: "SYS_OVERVIEW" },
  { id: 1, label: "Satellite Assembly", code: "SAT_ASSEMBLY" },
  { id: 2, label: "Solar Spectrum", code: "XRAY_SPECTRUM" },
  { id: 3, label: "Mission Control", code: "MISSION_CTRL" },
  { id: 4, label: "Earth Deflection", code: "EARTH_SHIELD" }
];

export default function App() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  // Global 3D scene state object used directly in the R3F render loop for 60fps animations
  const stateRef = useRef({
    assembly: 0,         // 0 to 1 (procedural parts deployment)
    sunScale: 1.0,       // 0 to 1 (sun entry and size)
    flareActive: 0,      // 0 to 1 (plasma particles velocity and scale)
    predictionUI: 0,     // 0 to 1 (holographic scanning rings opacity)
    cameraX: 0,          // target coordinates
    cameraY: 0.1,
    cameraZ: 6.2,
    cameraTargetY: 0,
    satelliteRotationY: 0,
    satelliteX: 0,
    satelliteY: 0,
    satelliteZ: 0,
    mouseParallaxX: 0,   // mouse motion coordinates
    mouseParallaxY: 0,
  });

  // Track global mouse moves for premium organic camera floating parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      gsap.to(stateRef.current, {
        mouseParallaxX: x,
        mouseParallaxY: -y,
        duration: 1.0,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update active 3D camera coordinates when module or step changes
  useEffect(() => {
    const stateObj = stateRef.current;
    
    if (activeModule === 0) {
      // 0: OVERVIEW
      // Place the satellite at a gorgeous, highly visible L1 alignment position (offset x=0.8 means -2.2 + 0.8 = -1.4)
      gsap.to(stateObj, {
        cameraX: -0.6,
        cameraY: 0.2,
        cameraZ: 5.8,
        cameraTargetY: 0.2,
        satelliteX: 0.8,
        satelliteY: 0.0,
        satelliteZ: 1.2,
        sunScale: 1.0,
        assembly: 0.0,
        flareActive: 0.1,
        duration: 1.5,
        ease: 'power2.out',
      });
    } else if (activeModule === 1) {
      // 1: SATELLITE ASSEMBLY
      // Close up on the spacecraft with a cinematic, highly visible centering
      const targetAssembly = activeStep === 1 ? 0.25 :
                             activeStep === 2 ? 0.5 :
                             activeStep === 3 ? 0.75 :
                             activeStep === 4 ? 0.9 : 1.0;
      
      gsap.to(stateObj, {
        cameraX: -0.8,
        cameraY: 0.4,
        cameraZ: 4.8,
        cameraTargetY: 0.3,
        satelliteX: 1.4, // placed in center-right focus
        satelliteY: -0.2,
        satelliteZ: 1.8,
        sunScale: 1.0,
        assembly: targetAssembly,
        flareActive: 0.1,
        duration: 1.2,
        ease: 'power2.out',
      });
    } else if (activeModule === 2) {
      // 2: SOLAR SPECTRA (LiveGraph)
      gsap.to(stateObj, {
        cameraX: 1.2,
        cameraY: 0.3,
        cameraZ: 6.8,
        cameraTargetY: 0.1,
        satelliteX: 0.5,
        satelliteY: 0.5,
        satelliteZ: 0.8,
        sunScale: 1.1,
        assembly: 1.0,
        flareActive: 0.4,
        duration: 1.5,
        ease: 'power2.out',
      });
    } else if (activeModule === 3) {
      // 3: MISSION CONTROL (Risk Dashboard)
      gsap.to(stateObj, {
        cameraX: -1.0,
        cameraY: -0.4,
        cameraZ: 6.5,
        cameraTargetY: 0,
        satelliteX: 0.4,
        satelliteY: 0.6,
        satelliteZ: 0.2,
        sunScale: 1.2,
        assembly: 1.0,
        flareActive: 1.0,
        duration: 1.5,
        ease: 'power2.out',
      });
    } else if (activeModule === 4) {
      // 4: EARTH DEFLECTION (Final Mission)
      gsap.to(stateObj, {
        cameraX: 0.4,
        cameraY: 0.1,
        cameraZ: 7.5,
        cameraTargetY: 0,
        satelliteX: 0.2,
        satelliteY: 0.8,
        satelliteZ: -0.5,
        sunScale: 1.25,
        assembly: 1.0,
        flareActive: 0.5,
        duration: 1.5,
        ease: 'power2.out',
      });
    }
  }, [activeModule, activeStep]);

  return (
    <div className="w-full h-screen overflow-hidden text-white relative bg-[#02040a] font-sans">
      
      {/* Immersive UI: Fixed Edge Framing Corner Accents */}
      <div className="fixed inset-6 pointer-events-none z-50 border border-white/5">
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-solar-orange/40"></div>
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-solar-orange/40"></div>
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-solar-orange/40"></div>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-solar-orange/40"></div>
      </div>

      {/* 1. PERSISTENT BACKDROP 3D GRAPHICS (Fixed Behind Content) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SolarScene stateRef={stateRef} />
      </div>

      {/* 2. DYNAMIC NARRATIVE OVERLAY PANELS */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-8 overflow-y-auto scrollbar-none pb-28 md:pb-24">
        
        {/* Render Active Stage Component */}
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center">
          {activeModule === 0 && (
            <HeroScene onStartMission={() => setActiveModule(1)} stateRef={stateRef} />
          )}
          {activeModule === 1 && (
            <SatelliteAssembly 
              activeStep={activeStep} 
              setActiveStep={setActiveStep} 
              onCompleted={() => setActiveModule(2)} 
            />
          )}
          {activeModule === 2 && (
            <div className="w-full max-w-4xl">
              <LiveGraph />
            </div>
          )}
          {activeModule === 3 && (
            <div className="w-full">
              <RiskDashboard />
            </div>
          )}
          {activeModule === 4 && (
            <FinalMission 
              onNavigateToDashboard={() => setActiveModule(3)} 
              onRestartMission={() => {
                setActiveStep(1);
                setActiveModule(0);
              }}
            />
          )}
        </div>
      </div>

      {/* 3. CONTROL CENTER NAVIGATION DOCK (Horizontal Clicking Boxes) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-6 pointer-events-auto">
        <div className="flex items-center justify-between gap-2 bg-black/60 border border-white/10 p-2 rounded-lg backdrop-blur-xl shadow-2xl overflow-x-auto scrollbar-none">
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-sm border text-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-solar-orange/50 bg-solar-orange/15 text-white shadow-[0_0_15px_rgba(255,123,0,0.25)]'
                    : 'border-white/5 bg-transparent text-gray-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <div className="text-[8px] font-mono tracking-widest uppercase opacity-60">0{mod.id + 1} // {mod.code}</div>
                <div className="text-[10px] font-display font-black tracking-wider uppercase mt-0.5 truncate">{mod.label}</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
