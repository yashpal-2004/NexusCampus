import React from 'react';
import { Shirt, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Laundry: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4 h-[calc(100vh-8rem)] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <Shirt className="w-16 h-16 animate-bounce" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-blue-500/30 rounded-full"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Coming Soon</h2>
          <p className="text-xl text-slate-600 font-medium max-w-md mx-auto">
            We're digitalizing your laundry experience. Real-time machine status and slot booking are on the way.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">ETA: Q3 2026</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">NexusCampus Digital Laundry</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 max-w-sm mx-auto flex items-start space-x-4 text-left">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Until then, please use the manual token system at the hostel reception. We appreciate your patience!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Laundry;
