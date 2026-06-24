import { useState, useEffect } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";;
import { Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LiveGraph() {
  const [data, setData] = useState(() => {
    // Seed initial data simulating a rising solar flare flux
    const list = [];
    const baseTime = Date.now();
    for (let i = 18; i >= 0; i--) {
      const timeStr = new Date(baseTime - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // Generate a flare curve path
      let value = 1.2 + Math.sin(i * 0.3) * 0.5;
      if (i < 8) {
        // Build the flare peak
        value += (8 - i) * 1.5 + Math.random() * 0.4;
      } else {
        value += Math.random() * 0.2;
      }
      list.push({ time: timeStr, flux: parseFloat(value.toFixed(2)) });
    }
    return list;
  });

  const [activePayload, setActivePayload] = useState("SoLEXS");

  useEffect(() => {
    // Periodically append new data points to create a scrolling feed
    const interval = setInterval(() => {
      setData((prev) => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Simulating fluctuations around a high plateau or decay phase
        const lastVal = (prev && prev.length > 0) ? prev[prev.length - 1].flux : 1.2;
        let change = (Math.random() - 0.45) * 0.5;
        
        // Keep within realistic limits
        let nextVal = Math.max(0.5, Math.min(15.0, lastVal + change));
        
        const nextList = [...prev.slice(1), { time: nextTime, flux: parseFloat(nextVal.toFixed(2)) }];
        return nextList;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-6 relative z-10 select-none max-w-7xl mx-auto py-16">
      <div className="w-full max-w-4xl space-y-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-lg relative overflow-hidden shadow-2xl satellite-glow">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-solar-orange/50 to-transparent"></div>
        
        {/* Header telemetry and stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-solar-orange">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest uppercase">Observed Real-Time Telemetry</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-black text-white italic uppercase">
              Solar <span className="text-solar-orange glitch-text">X-Ray Flux</span> Levels
            </h3>
            <p className="text-xs text-gray-400 font-light border-l border-solar-orange/50 pl-3">
              Live spectrum capture from Aditya-L1 observatory payload vectors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-solar-orange/10 border border-solar-orange/30 px-3 py-1.5 rounded-sm">
            <ShieldCheck className="w-4 h-4 text-solar-gold" />
            <div className="font-mono text-[10px] text-solar-gold tracking-widest uppercase">
              FLARE ALGORITHM ACTIVE // CONFIRMED
            </div>
          </div>
        </div>

        {/* Payload switches */}
        <div className="flex gap-2">
          {["SoLEXS (Soft X-Ray)", "HEL1OS (Hard X-Ray)"].map((payload, i) => {
            const label = payload.split(" ")[0];
            const isActive = activePayload === label;
            return (
              <button
                key={i}
                onClick={() => setActivePayload(label)}
                className={`px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                  isActive 
                    ? "bg-solar-orange/25 border border-solar-orange/50 text-solar-orange font-bold shadow-[0_0_12px_rgba(255,123,0,0.3)]" 
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {payload}
              </button>
            );
          })}
        </div>

        {/* Interactive glowing chart */}
        <div className="h-[250px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Stunning solar orange glowing gradient */}
                <linearGradient id="solarGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7b00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff7b00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis 
                dataKey="time" 
                stroke="#4b5563" 
                fontSize={9} 
                tickLine={false} 
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#4b5563" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#050816', 
                  borderColor: '#ff7b0055', 
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#ffb300', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="flux" 
                stroke="#ff7b00" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#solarGlow)" 
                dot={{ stroke: '#ffb300', strokeWidth: 1, r: 2 }}
                activeDot={{ stroke: '#ff3d00', strokeWidth: 2, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Diagnostic footnotes */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[9px] text-gray-500 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-solar-orange animate-spin-slow" />
            <span>LAST SEC TRANSMISSION RECEIVED: JUST NOW</span>
          </div>
          <div>STATION COORDINATES: LAGRANGIAN POINT L1 [1,500,000 KM]</div>
        </div>
      </div>
    </div>
  );
}
