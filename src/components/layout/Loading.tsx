import React from 'react';
import { motion } from 'motion/react';
import Logo from './Logo';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-ramos-red/20 blur-3xl rounded-full scale-150 animate-pulse" />
        
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10"
        >
          <Logo size={120} />
        </motion.div>
      </div>

      <div className="text-center flex flex-col items-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
          Nexus<span className="text-ramos-red">Campus</span>
        </h2>
        
        <div className="flex items-center space-x-3 mb-10">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay }}
              className="w-2 h-2 rounded-full bg-ramos-red" 
            />
          ))}
        </div>

        <p className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.6em] mb-10">Initializing Campus Network</p>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-[2px] bg-ramos-gray rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-ramos-red to-transparent"
        />
      </div>
      
      {/* Footer text */}
      <div className="mt-20 text-[10px] text-ramos-black/30 font-bold uppercase tracking-widest">
        Securely connecting to university nodes
      </div>
    </div>
  );
};

export default Loading;
