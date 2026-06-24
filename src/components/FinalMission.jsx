import { Rocket, Sparkles, MapPin, Globe } from "lucide-react";

export default function FinalMission({
  onNavigateToDashboard,
  onRestartMission,
}) {
  return (
    <main className="w-full min-h-screen flex flex-col justify-between items-center px-6 py-16 relative bg-black text-center overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
      </div>


      {/* Telemetry */}
      <div className="flex flex-wrap justify-center gap-4 items-center border border-white/10 bg-black/40 backdrop-blur-xl px-5 py-3 rounded-md text-[10px] font-mono text-gray-400 tracking-widest">

        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-orange-400" />
          STATION ID: L1_HALO_ORBIT
        </div>

        <span className="text-white/30">|</span>

        <div className="flex items-center gap-2">
          <Globe size={14} className="text-yellow-400" />
          EARTH SHIELD ACTIVE
        </div>

      </div>



      {/* Main section */}
      <section className="max-w-5xl my-auto space-y-8">

        <div>

          <h1 className="text-5xl md:text-7xl font-black uppercase italic text-white leading-tight">

            Protect Infrastructure

            <br />

            <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">

              Before Storms Strike

            </span>

          </h1>


          <p className="mt-5 text-xs font-mono tracking-[0.3em] text-yellow-400 uppercase">
            ADITYA-L1 // HELIOCAST AI SENTINEL MISSION
          </p>

        </div>



        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-lg leading-relaxed">

          HelioCast AI combines solar observations and AI forecasting models
          to predict solar storms before they impact satellites,
          communication systems, and power infrastructure.

        </p>



        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">


          <button
            onClick={onNavigateToDashboard}
            className="
            px-8 py-4
            bg-orange-500
            text-black
            font-bold
            uppercase
            text-xs
            rounded-md
            hover:bg-yellow-400
            transition-all
            "
          >

            <Rocket size={16} className="inline mr-2" />

            Launch Dashboard

          </button>



          <button
            onClick={onRestartMission}
            className="
            px-8 py-4
            border border-white/30
            text-white
            font-bold
            uppercase
            text-xs
            rounded-md
            hover:border-orange-400
            transition-all
            "
          >

            <Sparkles size={16} className="inline mr-2 text-yellow-400" />

            Restart Mission

          </button>


        </div>


      </section>



      {/* Footer */}
      <footer className="text-[10px] font-mono text-gray-600">

        © 2026 HELIOCAST AI // POWERED BY ADITYA-L1 DATA

      </footer>


    </main>
  );
}