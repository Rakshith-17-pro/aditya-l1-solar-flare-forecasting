import { motion, AnimatePresence } from "framer-motion";

import {
  Eye,
  Zap,
  Radio,
  Cpu,
  Orbit,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
const ASSEMBLY_STEPS = [
  {
    phase: 1,
    title: "SoLEXS Payload Integration",
    sensor: "Solar Low Energy X-ray Spectrometer",
    energy: "1 keV to 22 keV spectrum",
    icon: Eye,
    description: "Designed to monitor low-energy X-ray emission during active solar periods. SoLEXS tracks the thermodynamic evolution of the solar corona, detecting soft X-ray precursors hours before a flare erupts.",
    metric: "PRE-FLARE DURATION DETECTOR ACCURACY: 99.4%"
  },
  {
    phase: 2,
    title: "HEL1OS Instrument Deployment",
    sensor: "High Energy L1 Orbiting Spectrometer",
    energy: "4 keV to 150 keV spectrum",
    icon: Zap,
    description: "HEL1OS captures the highest-energy acceleration phases of solar flares. By resolving hard X-rays with microsecond precision, it maps fast particle transport and magnetic reconnection hotspots.",
    metric: "SPECTRUM SAMPLING RATE: 100 Hz RESOLUTION"
  },
  {
    phase: 3,
    title: "High-Gain Communications Dish",
    sensor: "Adaptive Telemetry Network",
    energy: "Gigabit-speed microwave band",
    icon: Radio,
    description: "Unfolding the parabolic telecommunications array. This high-performance boom positions the transmitter dish directly with ground control arrays, enabling zero-latency multi-channel telemetry streams.",
    metric: "UPLINK CAPACITY: 1200 MBPS STABLE LATENCY"
  },
  {
    phase: 4,
    title: "AI Inference Engine Initialization",
    sensor: "HELIOS-NET Core Synapse",
    energy: "Server-side pipeline integration",
    icon: Cpu,
    description: "Activating the server-side predictive models. Real-time multi-band observations from Aditya-L1 are fed into deep neural networks to extract solar magnetogram patterns and calculate flare probabilities.",
    metric: "INFERENCE VELOCITY: < 40ms LATENCY WINDOW"
  },
  {
    phase: 5,
    title: "Lagrangian Point L1 Orbital Insertion",
    sensor: "Deep Space Continuous Observer",
    energy: "1.5 Million Kilometers from Earth",
    icon: Orbit,
    description: "Aditya-L1 settles into an uninterrupted halo orbit around the Sun-Earth Lagrangian Point 1. From this gravity-stable vantage point, it enjoys a 100% duty cycle, viewing the Sun without occultation.",
    metric: "CONTINUOUS OBSERVATION DUTY CYCLE: 100.00%"
  }
];

export default function SatelliteAssembly({ activeStep, setActiveStep, onCompleted }) {
  const currentStep = ASSEMBLY_STEPS[activeStep - 1] || ASSEMBLY_STEPS[0];
  const StepIcon = currentStep.icon;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-black/60 border border-white/10 rounded-lg backdrop-blur-xl satellite-glow relative z-10 select-none">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left column: Step Tracker Navigation */}
        <div className="w-full md:w-64 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
          <div className="mb-2">
            <span className="font-mono text-[10px] tracking-widest text-solar-gold uppercase block">Assembly Blueprint</span>
            <h3 className="font-display font-black text-white text-base uppercase italic tracking-wider">PAYLOAD DEPLOYMENT</h3>
          </div>

          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 scrollbar-none py-1">
            {ASSEMBLY_STEPS.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.phase;
              const isBuilt = activeStep > step.phase;

              return (
                <button
                  key={step.phase}
                  onClick={() => setActiveStep(step.phase)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all duration-300 min-w-[160px] md:min-w-0 cursor-pointer ${
                    isSelected
                      ? 'border-solar-orange/50 bg-solar-orange/15 text-white'
                      : isBuilt
                      ? 'border-green-500/30 bg-green-500/5 text-green-400'
                      : 'border-white/5 bg-white/2 text-gray-500 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    {isBuilt ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-solar-orange animate-pulse' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] font-mono tracking-widest uppercase">Stage 0{step.phase}</div>
                    <div className="text-[10px] font-display font-bold truncate tracking-wide">
                      {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Step Details (Single Screen content) */}
        <div className="flex-1 flex flex-col justify-between min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-solar-orange">
                  0{currentStep.phase}
                </span>
                <div className="h-[1px] w-8 bg-solar-orange/30"></div>
                <span className="font-mono text-[9px] tracking-widest text-solar-orange uppercase">
                  ACTIVE OBSERVATORY SUB-ASSEMBLY
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2 uppercase italic">
                  <StepIcon className="w-5 h-5 text-solar-gold animate-pulse" />
                  {currentStep.title}
                </h2>
                <p className="font-mono text-[10px] text-solar-gold/80 tracking-wide uppercase">
                  System: {currentStep.sensor} // {currentStep.energy}
                </p>
              </div>

              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                {currentStep.description}
              </p>

              {/* Technical telemetry diagnostics bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-sm border border-solar-orange/20 bg-solar-orange/5 font-mono text-[9px] tracking-wide text-solar-orange">
                  <span className="font-bold uppercase block mb-1">SYSTEM STATS:</span>
                  <div className="text-white">SYS STATUS: CONNECTED & ONLINE</div>
                  <div className="text-gray-400 mt-1">{currentStep.metric}</div>
                </div>

                <div className="p-3 rounded-sm border border-white/5 bg-black/40 font-mono text-[9px] text-gray-400 space-y-1">
                  <span className="font-bold text-solar-gold block mb-1">TELEMETRY DIAGNOSTICS:</span>
                  <div className="flex justify-between border-b border-white/5 pb-0.5">
                    <span>Power Load:</span>
                    <span className="text-white">36.4V [OK]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Temp:</span>
                    <span className="text-solar-red">242.1 K</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Action buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
            {activeStep < 5 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2.5 bg-solar-orange text-black font-display font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-solar-gold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-solar-orange/20"
              >
                Assemble Next Module
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onCompleted}
                className="px-5 py-2.5 bg-green-500 text-black font-display font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-green-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-green-500/20"
              >
                Initialize Observatory Link
                <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
