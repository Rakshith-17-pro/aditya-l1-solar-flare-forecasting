import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Radio, ShieldAlert, Navigation, Activity, Compass, Cpu, Zap } from 'lucide-react';
import { gsap } from 'gsap';

export default function HeroScene({ onStartMission, stateRef }) {
  const containerRef = useRef();
  const [activeCard, setActiveCard] = useState(0);

  // Scientific data cards describing the Solar features and L1 Point
  const SOLAR_CARDS = useMemo(() => [
    {
      id: 0,
      title: "1. Photosphere & Convective Granules",
      subtitle: "CHURNING PLASMA GASES",
      icon: Activity,
      description: "Continuous monitoring of the Sun's bubbling surface, composed of convection cells (granules) about 1,000 km across, and high-intensity magnetic sunspot groups.",
      payload: "SoLEXS (Solar Low Energy X-ray Spectrometer)",
      telemetry: "SURFACE_TEMP: 5,778 K // CADENCE: 1.2s",
      color: "border-solar-orange/30 text-solar-orange",
      camera: { cx: 0.0, cy: 0.0, cz: 4.8, sx: 3.5, sy: 0.0, sz: 0.0, scale: 1.5, flare: 0.08 }
    },
    {
      id: 1,
      title: "2. Coronal Mass Ejections (CMEs)",
      subtitle: "SUPERHEATED PLASMA FLARES",
      icon: Zap,
      description: "Gigantic eruptions of solar plasma and magnetic field lines ejected into the heliosphere. These trigger severe geomagnetic storms and auroral disruptions on Earth.",
      payload: "HEL1OS (High Energy L1 Orbiting Spectrometer)",
      telemetry: "FLARE_PEAK: X1.8 CLASS // VELOCITY: 1,420 km/s",
      color: "border-solar-red/30 text-solar-red",
      camera: { cx: 0.6, cy: 0.2, cz: 5.2, sx: 3.5, sy: 0.0, sz: 0.0, scale: 1.3, flare: 1.0 }
    },
    {
      id: 2,
      title: "3. Lagrangian Point L1 Position",
      subtitle: "GRAVITATIONAL STATION-KEEPING",
      icon: Compass,
      description: "A unique orbital sanctuary situated 1.5 million kilometers towards the Sun. The gravitational forces of Earth and Sun balance here, enabling 24/7 unoccluded views.",
      payload: "Aditya-L1 Halo Insertion Navigation",
      telemetry: "L1_COORDS: [S-E LINE] // SOL_OCCULTATION: 0.00%",
      color: "border-solar-gold/30 text-solar-gold",
      camera: { cx: -0.6, cy: 0.2, cz: 5.4, sx: 1.0, sy: 0.0, sz: 1.5, scale: 0.95, flare: 0.15 }
    },
    {
      id: 3,
      title: "4. Aditya-L1 Spacecraft Core",
      subtitle: "THE GOLDEN SENTINEL SHIELD",
      icon: Cpu,
      description: "India's premier space observatory carrying 7 advanced co-aligned payloads to investigate solar winds, coronal heating, and magnetic field configurations.",
      payload: "Spacecraft MLI Gold Core & Deployed Arrays",
      telemetry: "TELEM_STATUS: NOMINAL // CORE_TEMP: 22.4°C",
      color: "border-solar-orange/30 text-solar-orange",
      camera: { cx: -1.2, cy: 0.8, cz: 4.5, sx: -0.8, sy: 0.1, sz: 1.5, scale: 0.9, flare: 0.1 }
    },
    {
      id: 4,
      title: "5. Planetary Safeguard Link",
      subtitle: "EARLY MAGNETOSPHERE WARNING",
      icon: Navigation,
      description: "Real-time stream predictions provide critical 1-hour early warnings to safeguard satellite fleets, power distribution grids, and communications systems.",
      payload: "MAG / PAPA (Plasma Analyzer System)",
      telemetry: "SHIELD_STATE: ONLINE // LEADT_EST: 62.4 min",
      color: "border-blue-500/30 text-blue-400",
      camera: { cx: 0.8, cy: -0.4, cz: 7.0, sx: 0.4, sy: 0.8, sz: 0.0, scale: 0.8, flare: 0.3 }
    }
  ], []);

  // Handle scroll events on the card container
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const cardHeight = 176; // Height of each card container
    const newIndex = Math.min(
      SOLAR_CARDS.length - 1,
      Math.max(0, Math.round(scrollTop / cardHeight))
    );

    if (newIndex !== activeCard) {
      setActiveCard(newIndex);
    }
  };

  // Smoothly trigger 3D scene camera animations using GSAP when activeCard changes
  useEffect(() => {
    if (!stateRef.current) return;
    const card = SOLAR_CARDS[activeCard];
    
    gsap.to(stateRef.current, {
      cameraX: card.camera.cx,
      cameraY: card.camera.cy,
      cameraZ: card.camera.cz,
      satelliteX: card.camera.sx,
      satelliteY: card.camera.sy,
      satelliteZ: card.camera.sz,
      sunScale: card.camera.scale,
      flareActive: card.camera.flare,
      duration: 1.4,
      ease: 'power2.out'
    });
  }, [activeCard, SOLAR_CARDS, stateRef]);

  // Handle direct clicking on indicators or pips
  const handleSelectCard = (index) => {
    setActiveCard(index);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * 176,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-between items-center px-4 md:px-6 py-6 md:py-8 relative z-10 select-none gap-6">
      
      {/* Top HUD Rail / Brand Logo and Status indicator */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 bg-black/40 backdrop-blur-md p-4 rounded-xl relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex items-center flex-wrap gap-4 md:gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-solar-orange/30 flex items-center justify-center bg-solar-orange/5 shadow-[0_0_15px_rgba(255,123,0,0.15)]">
              <Radio className="w-4.5 h-4.5 text-solar-orange animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black tracking-[0.2em] text-sm bg-gradient-to-r from-white via-gray-300 to-solar-gold bg-clip-text text-transparent uppercase">
                HELIOCAST AI
              </span>
              <p className="text-[8px] font-mono tracking-[0.2em] text-solar-orange/80 uppercase">L1 Space Weather Ops</p>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-6 bg-white/25"></div>
          <div className="text-[10px] font-mono opacity-85 tracking-widest text-solar-gold uppercase">
            MISSION: HELIOCAST-01 // STATUS: ACTIVE
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex items-center gap-6 md:gap-8 bg-black/50 px-4 py-1.5 rounded-lg border border-white/5"
        >
          <div className="text-right">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest">Solar Latitude</div>
            <div className="text-[10px] font-mono text-white">14° 22' 04" N</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest">X-Ray Flux Level</div>
            <div className="text-[10px] font-mono text-solar-gold">1.42e-07 W/m²</div>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solar-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-solar-orange"></span>
            </span>
            <span className="text-[9px] font-mono tracking-wider text-gray-300">ADITYA-L1 LINKED</span>
          </div>
        </motion.div>
      </div>

      {/* Main Container - Split Layout: Left Info, Right Scroll Explorer */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between items-stretch gap-8 my-auto pointer-events-auto">
        
        {/* Left Side: Cinematic Mission Intro */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-solar-red/30 rounded-full bg-solar-red/5 mb-6"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-solar-red animate-pulse" />
            <span className="text-[10px] font-mono text-solar-red tracking-[0.15em] uppercase font-semibold">
              Severe Solar Event Alert System
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-5 text-white"
          >
            Forecast Solar Flares <br />
            <span className="bg-gradient-to-r from-solar-orange via-solar-gold to-solar-red bg-clip-text text-transparent font-bold">
              Before They Strike
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="text-gray-300 text-sm md:text-base max-w-md font-light tracking-wide leading-relaxed mb-6"
          >
            AI-powered solar flare forecasting and coronal mass ejection alert framework driven by real-time observations from Aditya-L1's{' '}
            <span className="text-solar-gold font-mono text-sm border-b border-solar-gold/30 pb-0.5">SoLEXS</span> and{' '}
            <span className="text-solar-orange font-mono text-sm border-b border-solar-orange/30 pb-0.5">HEL1OS</span> payloads parked at Lagrangian L1 point.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <button
              onClick={onStartMission}
              className="w-full px-8 py-3.5 bg-solar-orange text-black font-display font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-solar-gold hover:shadow-[0_0_25px_rgba(255,123,0,0.55)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Begin Assembly Sequence</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Interactive Scroll-on-Sun HUD Explorer */}
        <div className="w-full lg:w-[500px] flex gap-4 items-stretch h-[370px] relative">
          
          {/* Vertical Stepper / Pips Indicator */}
          <div className="flex flex-col justify-between items-center py-2 h-full">
            {SOLAR_CARDS.map((card, idx) => {
              const isSelected = activeCard === idx;
              return (
                <button
                  key={card.id}
                  onClick={() => handleSelectCard(idx)}
                  className="group flex items-center gap-3 outline-none cursor-pointer"
                >
                  <div className={`text-[9px] font-mono tracking-widest ${isSelected ? 'text-solar-orange font-bold' : 'text-gray-600 group-hover:text-gray-300'} transition-all`}>
                    0{idx + 1}
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    isSelected ? 'border-solar-orange bg-solar-orange' : 'border-white/20 bg-transparent group-hover:border-white/50'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scrolling Deck */}
          <div className="flex-1 flex flex-col justify-center relative">
            
            {/* Scroll Indicator Label */}
            <div className="absolute -top-6 right-2 flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-solar-orange animate-pulse"></span>
              Scroll on the Sun / Swipe cards
            </div>

            {/* Scrollable Container */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="w-full h-[330px] overflow-y-auto scrollbar-none snap-y snap-mandatory flex flex-col gap-4 pr-1 scroll-smooth"
            >
              {SOLAR_CARDS.map((card, idx) => {
                const isSelected = activeCard === idx;
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(idx)}
                    className={`w-full h-[160px] flex-shrink-0 snap-start p-4 rounded-xl border backdrop-blur-md transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-solar-orange/50 bg-black/75 shadow-[0_0_20px_rgba(255,123,0,0.12)] scale-[1.01]'
                        : 'border-white/5 bg-black/45 opacity-40 hover:opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[10px] font-mono tracking-wider text-solar-gold uppercase">
                          {card.subtitle}
                        </div>
                        <h3 className="text-sm font-display font-black text-white tracking-wide mt-0.5">
                          {card.title}
                        </h3>
                      </div>
                      <div className={`p-1.5 rounded bg-white/5 border ${card.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] leading-relaxed text-gray-400 font-light tracking-wide line-clamp-2">
                      {card.description}
                    </p>

                    {/* Footer / Live Telemetry strip */}
                    <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[8px] font-mono text-gray-500">
                      <div className="truncate pr-2">
                        <span className="text-white opacity-80">INSTRUMENT:</span> {card.payload}
                      </div>
                      <div className="text-solar-orange font-bold whitespace-nowrap">
                        {card.telemetry}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom spacer block to allow final card to center properly */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

      </div>

      {/* Footer Navigation / Prompt */}
      <div className="w-full max-w-7xl flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-white/5 pt-4">
        <div>LAGRANGIAN L1 MISSION CONTROL // HELIOCAST v2.4</div>
        <div className="flex items-center gap-1.5 text-solar-gold">
          <span className="w-2 h-2 rounded-full bg-solar-gold animate-ping"></span>
          SCENE REALISM: 100% // PHYSICALLY BOUNDED SOL
        </div>
      </div>

    </div>
  );
}
