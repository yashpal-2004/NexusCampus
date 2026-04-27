import React from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, Hexagon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-[40px] p-12 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -ml-16 -mb-16" />
        
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 rounded-[32px] bg-orange-500 flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-orange-500/20"
        >
          <Hexagon className="w-12 h-12 fill-current" />
        </motion.div>
        
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">
          {title}
        </h2>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="h-px w-8 bg-slate-200" />
          <div className="flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coming Soon</span>
          </div>
          <div className="h-px w-8 bg-slate-200" />
        </div>
        
        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed mb-10">
          {description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "linear"
                }}
                className="h-full w-1/2 bg-orange-500/30"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex items-center justify-center space-x-2 text-slate-400">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Stay Tuned</span>
          <Zap className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
