import React from 'react';
import { 
  ArrowRight, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeProps {
  onGetStarted: () => void;
  userName: string;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, userName }) => {
  const steps = [
    { icon: MessageSquare, title: 'Ask Queries', desc: 'Get answers from your campus community in real-time.' },
    { icon: ShoppingBag, title: 'Order Together', desc: 'Save on delivery fees with shared Blinkit requests.' },
    { icon: Users, title: 'Find Buddies', desc: 'Never go to the gym or a cafe alone again.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/5 blur-[120px] rounded-full" />

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-orange-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-600/20">
            <Zap className="w-10 h-10 text-white fill-current" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6 italic">
            WELCOME TO <br />
            <span className="bg-gradient-to-r from-orange-600 to-indigo-600 bg-clip-text text-transparent uppercase">NexusCampus</span>
          </h1>
          <p className="text-2xl text-slate-500 font-medium tracking-tight">
            Hey {userName.split(' ')[0]}, your campus life just got an upgrade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white border border-slate-200 rounded-[40px] p-8 hover:bg-slate-50 transition-all group shadow-sm"
            >
              <div className="p-4 rounded-2xl bg-orange-50 text-orange-600 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight italic">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onGetStarted}
          className="group relative inline-flex items-center space-x-4 px-12 py-6 rounded-[32px] bg-slate-900 text-white font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
        >
          <Zap className="w-6 h-6 fill-white" />
          <span>ENTER THE NexusCampus</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </motion.button>

        <div className="mt-12 flex items-center justify-center space-x-2 text-slate-200">
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ready to Launch</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
