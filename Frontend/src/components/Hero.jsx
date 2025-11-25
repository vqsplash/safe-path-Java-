import React from "react";
import { Megaphone } from "lucide-react";

const Hero = () => {
  const { scrollY } = useScrol();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-0">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center h-full pb-20">
        
        {/* Left Content */}
        <motion.div 
          style={{ y: y1 }}
          className="flex flex-col justify-center max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LiveIndicator />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x">
              Illuminate
            </span>{" "}
            <br className="hidden sm:block" />
            the Unsafe.
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-2xl sm:text-3xl font-medium text-gray-300 leading-snug"
          >
            Reclaim your city, one report at a time.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed"
          >
            Join a community dedicated to transparency. Anonymously report public harassment, view live safety heatmaps, and navigate with confidence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button className="group relative overflow-hidden bg-white text-black font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                <Megaphone size={20} className="text-rose-600" />
                Report Incident
              </span>
            </button>
            
            <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1">
              How it Works
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex items-center gap-6 text-sm text-gray-500"
          >
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold text-white relative overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*13}`} alt="User" className="w-full h-full" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                 +2k
               </div>
            </div>
            <p>Trusted by <span className="text-white font-bold">2,400+</span> citizens this month.</p>
          </motion.div>
        </motion.div>

        {/* Right Content - Abstract Map Visualization */}
        <motion.div 
          style={{ y: y2 }}
          className="hidden lg:block relative h-[600px] w-full"
        >
          {/* Main Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="absolute top-10 right-10 w-[400px] h-[500px] bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-20"
          >
            {/* Mock Map Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Live Heatmap</span>
              <Activity size={16} className="text-rose-500" />
            </div>
            
            {/* Mock Map Content */}
            <div className="relative w-full h-full bg-[#0F1115]">
               {/* Map Grid */}
               <div className="absolute inset-0 opacity-20" 
                    style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               </div>
               
               {/* Map Shapes (Roads/Blocks) */}
               <svg className="absolute inset-0 w-full h-full stroke-gray-700/50 stroke-1 fill-none" viewBox="0 0 400 500">
                  <path d="M50 0 V500 M150 0 V500 M250 0 V500 M350 0 V500" />
                  <path d="M0 100 H400 M0 250 H400 M0 400 H400" />
               </svg>

               {/* Incident Pins */}
               {[
                 { top: '20%', left: '30%', color: 'text-yellow-500' },
                 { top: '45%', left: '60%', color: 'text-rose-500' },
                 { top: '70%', left: '25%', color: 'text-orange-500' }
               ].map((pin, i) => (
                 <motion.div 
                    key={i}
                    className="absolute"
                    style={{ top: pin.top, left: pin.left }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + (i * 0.2) }}
                 >
                    <div className={`relative ${pin.color}`}>
                       <MapPin size={32} className="drop-shadow-lg" fill="currentColor" />
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
                        </span>
                    </div>
                 </motion.div>
               ))}

               {/* Scanning Line */}
               <motion.div 
                 className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                 animate={{ top: ['0%', '100%'] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               />
            </div>
          </motion.div>

          {/* Floating Card 1 - Stats */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.6 }}
             className="absolute bottom-32 left-0 z-30 bg-gray-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl w-48"
          >
             <div className="text-xs text-gray-400 mb-1">Safety Index</div>
             <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">94%</span>
                <span className="text-xs text-green-400 mb-1 flex items-center">
                  ▲ 2.4%
                </span>
             </div>
             <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
             </div>
          </motion.div>

          {/* Floating Card 2 - Notification */}
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.8 }}
             className="absolute top-40 -left-12 z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl w-64"
          >
             <div className="flex items-start gap-3">
                <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400">
                   <ShieldAlert size={20} />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-white">New Report Verified</h4>
                   <p className="text-xs text-gray-400 mt-1">2 mins ago • Downtown Sector 4</p>
                </div>
             </div>
          </motion.div>

        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </motion.div>
    </section>
  );
};
