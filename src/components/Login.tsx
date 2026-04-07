import React from 'react';
import { 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight,
  Hexagon 
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
  isLoading: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const features = [
    { icon: Zap, title: 'Real-time Updates', desc: 'Get instant notifications for campus events.' },
    { icon: ShieldCheck, title: 'Verified Network', desc: 'Exclusive access for university students only.' },
    { icon: Globe, title: 'Campus Buddy', desc: 'Find companions for gym, travel, or coffee.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Branding */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Hexagon className="w-7 h-7 text-white fill-current" />
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">Nexus<span className="text-orange-500">Campus</span></span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
              THE MODERN <br />
              <span className="text-orange-500">
                CAMPUS
              </span> <br />
              HUB.
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              The professional operating system for student life. Queries, logistics, and community—streamlined.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="space-y-3"
              >
                <div className="p-2 rounded-xl bg-orange-50 w-fit text-orange-600">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-[60px] p-12 shadow-2xl shadow-slate-200/50 relative"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              Enterprise Ready
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3 italic">Welcome Back.</h2>
              <p className="text-slate-500 font-medium">Sign in with your university credentials to access the hub.</p>
            </div>

            {error && (
              <div className="p-4 rounded-3xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                <strong>Login Error:</strong> {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={onLogin}
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center space-x-4 py-5 rounded-[32px] bg-slate-900 text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                    <span>CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="flex items-center space-x-4 px-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Students Only</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 leading-relaxed text-center">
                By continuing, you agree to our <span className="text-slate-900 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-slate-900 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-slate-200">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Built for Excellence</span>
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">© 2026 NexusCampus</span>
      </div>
    </div>
  );
};

export default Login;
