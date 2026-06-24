import { useState } from "react";

import {
  ShieldAlert,
  Sun,
  Compass,
  Bell,
  Layers,
  CheckCircle
} from "lucide-react";
const REGIONS_DATA = {
  "AR3664": {
    name: "AR3664 (Active / Complex)",
    mProb: 94,
    xProb: 78,
    confidence: 98.4,
    riskLevel: "EXTREME",
    riskColor: "text-solar-red",
    riskBg: "bg-solar-red/10 border-solar-red/30",
    spotsCount: 42,
    magneticClass: "Beta-Gamma-Delta",
    prevFlares: "X1.1, X2.5, X4.8"
  },
  "AR3668": {
    name: "AR3668 (Emerging / Moderate)",
    mProb: 65,
    xProb: 24,
    confidence: 89.1,
    riskLevel: "HIGH",
    riskColor: "text-solar-orange",
    riskBg: "bg-solar-orange/10 border-solar-orange/30",
    spotsCount: 18,
    magneticClass: "Beta-Gamma",
    prevFlares: "M3.4, M5.2"
  },
  "AR3671": {
    name: "AR3671 (Stable / Decay)",
    mProb: 15,
    xProb: 2,
    confidence: 94.6,
    riskLevel: "LOW",
    riskColor: "text-green-400",
    riskBg: "bg-green-400/5 border-green-400/20",
    spotsCount: 7,
    magneticClass: "Alpha",
    prevFlares: "C1.2, C2.0"
  }
};

export default function RiskDashboard() {
  const [selectedRegion, setSelectedRegion] = useState("AR3664");
  const [testSiren, setTestSiren] = useState(false);
  
  const current = REGIONS_DATA[selectedRegion] || REGIONS_DATA["AR3664"];

  // Radial Ring calculation
  const getCircleProps = (percent, radius = 45) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    return {
      strokeDasharray: circumference,
      strokeDashoffset: strokeDashoffset,
      r: radius
    };
  };

  return (
    <div className="w-full min-h-screen py-16 px-6 relative z-10 select-none max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Title */}
      <div className="mb-10 text-center md:text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-solar-orange/30 rounded-full bg-solar-orange/5 mb-2">
          <Compass className="w-4 h-4 text-solar-orange animate-spin-slow" />
          <span className="text-[10px] font-mono text-solar-orange tracking-[0.25em] uppercase font-semibold">
            Heliocast Operational Control
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight italic uppercase">
          Aditya-L1 <span className="text-solar-orange glitch-text">Mission Dashboard</span>
        </h2>
        <p className="text-gray-400 font-light text-sm max-w-xl border-l-2 border-solar-orange pl-4">
          Query spatial sunspot coordinates, assess magnetic instability classes, and monitor automated flare projection matrices.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Sunspot Selector & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active sunspot selector */}
          <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-lg space-y-4 shadow-2xl">
            <h4 className="font-mono text-[10px] tracking-widest text-solar-gold uppercase border-b border-white/10 pb-2">
              Select Active Photosphere Region
            </h4>
            
            <div className="flex flex-col gap-2">
              {Object.keys(REGIONS_DATA).map((key) => {
                const item = REGIONS_DATA[key];
                const isSelected = selectedRegion === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedRegion(key)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-md border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-solar-orange/55 bg-solar-orange/10 shadow-[0_0_20px_rgba(255,123,0,0.2)]' 
                        : 'border-white/5 bg-white/2 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className={`font-display text-sm font-bold block ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                        {item.name}
                      </span>
                      <span className="font-mono text-[10px] text-gray-500 uppercase">
                        Magnetic Class: {item.magneticClass}
                      </span>
                    </div>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      item.riskLevel === 'EXTREME' ? 'bg-solar-red/20 text-solar-red' :
                      item.riskLevel === 'HIGH' ? 'bg-solar-orange/20 text-solar-orange' : 'bg-green-400/20 text-green-400'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Details Card */}
          <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-lg space-y-4 shadow-2xl">
            <h4 className="font-mono text-[10px] tracking-widest text-solar-gold uppercase border-b border-white/10 pb-2">
              Spectral Diagnostics: {selectedRegion}
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] block uppercase">Sunspot Count:</span>
                <span className="text-white text-sm font-bold">{current.spotsCount} Spots</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] block uppercase">Instability Score:</span>
                <span className="text-white text-sm font-bold">Class {current.magneticClass.split("-")[0]}</span>
              </div>
              <div className="space-y-1 col-span-2 border-t border-white/10 pt-3">
                <span className="text-gray-500 text-[10px] block uppercase">Recent Eruptions (24h):</span>
                <span className="text-solar-orange text-xs font-bold">{current.prevFlares}</span>
              </div>
            </div>
          </div>

          {/* Warning System Demo */}
          <div className="p-4 border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${testSiren ? 'bg-solar-red/20 animate-pulse' : 'bg-white/5'}`}>
                <Bell className={`w-4 h-4 ${testSiren ? 'text-solar-red' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] tracking-widest text-gray-400 block uppercase">Manual Alert Broadcast</span>
                <span className="text-xs text-white font-medium">{testSiren ? 'SIREN EMITTING [X-CLASS ALERT]' : 'READY FOR TEST BROADCAST'}</span>
              </div>
            </div>
            <button
              onClick={() => setTestSiren(!testSiren)}
              className={`font-mono text-[10px] px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                testSiren 
                  ? 'border-solar-red/40 bg-solar-red/10 text-solar-red font-bold shadow-[0_0_15px_rgba(255,61,0,0.25)]' 
                  : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {testSiren ? 'MUTE BROADCAST' : 'TEST ALARM'}
            </button>
          </div>

        </div>

        {/* Right column: Gauges and Risk metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Predictive gauges wrapper */}
          <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-lg space-y-8 shadow-2xl satellite-glow">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-solar-gold" />
                <h3 className="font-display font-bold text-lg text-white">
                  Real-Time Eruption Probabilities
                </h3>
              </div>
              <div className="font-mono text-[10px] text-gray-500">
                PROJECTIONS UPDATED: JUST NOW
              </div>
            </div>

            {/* Glowing Gauges layout */}
            <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
              
              {/* Gauge 1: M-Class Probability */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="56" cy="56" r="45" stroke="#ffffff08" strokeWidth="6" fill="transparent" />
                    {/* Active circle */}
                    <circle
                      cx="56"
                      cy="56"
                      stroke="#ffb300"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      {...getCircleProps(current.mProb)}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-display font-extrabold text-white">{current.mProb}%</span>
                    <span className="text-[8px] font-mono tracking-widest text-solar-gold uppercase">M-Class</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-gray-400">Moderate Flare Threat</span>
              </div>

              {/* Gauge 2: X-Class Probability */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="56" cy="56" r="45" stroke="#ffffff08" strokeWidth="6" fill="transparent" />
                    {/* Active circle */}
                    <circle
                      cx="56"
                      cy="56"
                      stroke="#ff3d00"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      {...getCircleProps(current.xProb)}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-display font-extrabold text-white">{current.xProb}%</span>
                    <span className="text-[8px] font-mono tracking-widest text-solar-red uppercase">X-Class</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-gray-400">Extreme Flare Threat</span>
              </div>

              {/* Gauge 3: Model Confidence */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="56" cy="56" r="45" stroke="#ffffff08" strokeWidth="6" fill="transparent" />
                    {/* Active circle */}
                    <circle
                      cx="56"
                      cy="56"
                      stroke="#00d2d3"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      {...getCircleProps(current.confidence)}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-display font-extrabold text-white">{current.confidence}%</span>
                    <span className="text-[8px] font-mono tracking-widest text-blue-300 uppercase">Inference</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-gray-400">Model Certainty Score</span>
              </div>

            </div>

            {/* Risk Indicator Alert Box */}
            <div className={`p-5 rounded-md border ${current.riskBg} transition-all duration-1000 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-5 h-5 ${current.riskColor}`} />
                  <span className={`font-mono text-[11px] tracking-widest font-bold uppercase ${current.riskColor}`}>
                    Overall Space Weather Risk: {current.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-gray-300 max-w-md font-light leading-relaxed">
                  Severe geomagnetic storm warning triggered. Global power grids, communication satellites, and trans-polar aviation corridors advised to initialize mitigation protocols.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">ALERT LEVEL</span>
                <span className={`text-xl font-display font-black tracking-wide ${current.riskColor}`}>
                  {current.riskLevel === 'EXTREME' ? 'RED [K-9]' :
                   current.riskLevel === 'HIGH' ? 'ORANGE [K-6]' : 'GREEN [K-2]'}
                </span>
              </div>
            </div>

          </div>

          {/* High-tech auxiliary logs */}
          <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-lg space-y-4 shadow-2xl">
            <h4 className="font-mono text-[10px] tracking-widest text-solar-gold uppercase border-b border-white/10 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Autonomous Mitigation Checklist
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-solar-gold" />
                <span>GRID DISPATCH LIMITER: CONFIGURED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-solar-gold" />
                <span>SAT RAD-SHIELDS: ENGAGED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-solar-gold" />
                <span>AVIATION DETOUR PATHS: COMPUTED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-solar-gold" />
                <span>ISRO GROUND RECEPTORS: READY</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
