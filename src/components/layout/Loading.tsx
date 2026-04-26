import React from 'react';
import { Hexagon } from 'lucide-react';
import { motion } from 'motion/react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      <div className="relative mb-10">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 rounded-3xl bg-white shadow-[0_20px_50px_rgba(249,115,22,0.15)] flex items-center justify-center relative z-10 border border-slate-100"
        >
          <Hexagon className="w-12 h-12 text-orange-500 fill-orange-500/10" />
        </motion.div>
        
        {/* Decorative background glow */}
        <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-3xl -z-0 animate-pulse scale-150" />
      </div>

      <div className="text-center flex flex-col items-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
          Nexus<span className="text-orange-500">Campus</span>
        </h2>
        
        <div className="flex items-center space-x-3 mb-10">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-orange-500" 
          />
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-orange-500" 
          />
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-orange-500" 
          />
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] mb-10">Initializing Campus Network</p>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-[2px] bg-slate-200 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        />
      </div>
      
      {/* Footer text */}
      <div className="mt-20 text-[10px] text-slate-400 font-medium">
        Securely connecting to university nodes...
      </div>
    </div>
  );
};

export default Loading;
