import React from 'react';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  LayoutGrid,
  CirclePlay,
  Activity,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import Footer from '../layout/Footer';
import Logo from '../layout/Logo';

interface LandingPageProps {
  onLogin: () => void;
  isLoading: boolean;
  error?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoading, error }) => {
  return (
    <div className="w-screen min-h-screen bg-white text-ramos-black font-sans selection:bg-ramos-red selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-50 glass border-b border-ramos-black/5 mb-12">
        <div className="flex items-center space-x-3">
          <Logo size={32} />
          <span className="text-xl font-bold tracking-tighter">NexusCampus</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium hover:text-ramos-red transition-colors">Home</button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium hover:text-ramos-red transition-colors">Features</button>
          <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium hover:text-ramos-red transition-colors">Get Started</button>
          <button onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium hover:text-ramos-red transition-colors">Contact</button>
        </div>
        <button 
          onClick={onLogin}
          className="px-6 py-2.5 rounded-full bg-ramos-black text-white text-sm font-bold hover:bg-ramos-red transition-all"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="pt-80 pb-20 px-6 w-full bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-40">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-12 mt-20"
            >
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                 <div className="relative">
                   <Logo size={64} className="animate-float" />
                   <div className="absolute inset-0 bg-ramos-red/20 blur-2xl -z-10 rounded-full animate-pulse" />
                 </div>
                 <h1 className="text-huge">
                  NexusCampus<br />
                  <span className="text-ramos-black/40">shape the future</span>
                 </h1>
                 <div className="w-12 h-12 rounded-full border-2 border-ramos-red flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group">
                   <CirclePlay className="w-6 h-6 text-ramos-red group-hover:fill-current transition-colors" />
                 </div>
              </div>
              <p className="text-xl text-ramos-black/50 font-medium max-w-2xl mx-auto leading-relaxed">
                Streamline your campus life with a professional intelligence hub. Queries, logistics, and community coordination—all in one place.
              </p>
            </motion.div>
          </div>

          {/* Bento Grid Features */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-40 pt-20">
            {/* Queries Hub - Premium Major Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-8 group relative overflow-hidden rounded-[48px] bg-white border border-ramos-gray p-16 flex flex-col justify-between min-h-[550px] transition-all duration-700 hover:shadow-2xl hover:shadow-ramos-black/5"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-ramos-red/5 blur-[120px] rounded-full group-hover:bg-ramos-red/10 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-ramos-gray border border-ramos-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-ramos-red">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ramos-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-ramos-red"></span>
                  </span>
                  <span>Community Network</span>
                </div>
                <h2 className="text-7xl font-bold tracking-tighter leading-[0.9] max-w-2xl">
                  Strategic campus<br />
                  <span className="text-ramos-black/30 italic">intelligence.</span>
                </h2>
                <p className="text-xl text-ramos-black/50 font-medium max-w-lg leading-relaxed pt-4">
                  The Queries Hub isn't just a forum. It's a real-time data engine powered by 2,400+ verified campus voices.
                </p>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between space-y-10 md:space-y-0">
                 <div className="space-y-8">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-ramos-gray overflow-hidden shadow-xl">
                          <img src={`https://i.pravatar.cc/100?u=stu_${i}`} alt="Student" />
                        </div>
                      ))}
                      <div className="w-14 h-14 rounded-full border-4 border-white bg-ramos-red flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                        +2.4K
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                       <div className="space-y-1">
                          <p className="text-3xl font-bold tracking-tighter">98.2%</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ramos-black/30">Accuracy</p>
                       </div>
                       <div className="w-px h-10 bg-ramos-gray" />
                       <div className="space-y-1">
                          <p className="text-3xl font-bold tracking-tighter">1.2s</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ramos-black/30">Response Time</p>
                       </div>
                    </div>
                 </div>
                 <div className="px-8 py-4 rounded-3xl bg-ramos-black text-white flex items-center space-x-4 group/btn cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-ramos-red translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 text-sm font-bold uppercase tracking-widest">Explore Hub</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                 </div>
              </div>
            </motion.div>

            {/* Laundry IQ - High Tech Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 rounded-[48px] bg-ramos-black border border-white/5 p-12 flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-all duration-700" />
              
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center animate-float">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold tracking-tight text-white leading-tight">Laundry<br />Intelligence</h3>
                  <p className="text-white/30 text-sm font-medium leading-relaxed">
                    Live machine tracking. Integrated availability metrics.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Campus Load</span>
                       <span className="text-xs font-bold text-green-400">Low</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: "35%" }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full bg-green-400" 
                       />
                    </div>
                    <p className="text-[10px] font-bold text-white/20 text-center uppercase tracking-widest">12 Machines Available</p>
                 </div>
              </div>
            </motion.div>

            {/* Buddy Finder - Professional Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 rounded-[48px] bg-ramos-gray border border-ramos-black/5 p-12 flex flex-col justify-between group"
            >
              <div className="space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-ramos-red flex items-center justify-center shadow-lg shadow-ramos-red/20 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold tracking-tight text-ramos-black">Buddy Finder</h3>
                  <p className="text-ramos-black/30 text-sm font-medium leading-relaxed">
                    Connect with study, gym, and project partners. Verified only.
                  </p>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-center space-x-2 text-ramos-red font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span>Start Connecting</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Nexus AI - High End Major Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 rounded-[48px] bg-white border border-ramos-gray p-16 flex flex-col justify-between min-h-[400px] overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-ramos-red/5 blur-[100px] rounded-full group-hover:bg-ramos-red/10 transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                <div className="space-y-6 flex-1">
                  <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-ramos-red/10 text-[10px] font-black uppercase tracking-widest text-ramos-red">
                    AI Wellness Engine
                  </div>
                  <h2 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                    Nexus AI. Your<br />
                    <span className="text-ramos-red italic">wellness guardian.</span>
                  </h2>
                  <p className="text-lg text-ramos-black/40 font-medium max-w-md leading-relaxed">
                    A specialized intelligence hub trained on campus medical resources for instant, reliable wellness guidance.
                  </p>
                </div>
                <div className="w-full md:w-auto min-w-[320px]">
                   <div className="p-8 rounded-[40px] bg-ramos-gray/50 border border-ramos-black/5 backdrop-blur-sm space-y-6">
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-2xl bg-ramos-red flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-xs font-black uppercase tracking-widest">Medical Assistant</p>
                            <p className="text-[10px] font-bold text-ramos-black/30">System Operational</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "85%" }}
                              transition={{ duration: 2, delay: 0.8 }}
                              className="h-full bg-ramos-red" 
                            />
                         </div>
                         <div className="h-1.5 w-[60%] bg-white rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "40%" }}
                              transition={{ duration: 1.5, delay: 1 }}
                              className="h-full bg-ramos-red/30" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Minimalist Get Started Section */}
          <div id="get-started" className="flex flex-col items-center text-center space-y-16 pb-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <h2 className="text-[12rem] font-bold tracking-tighter leading-[0.8] text-ramos-black italic">
                Ready?
              </h2>
              <p className="text-2xl text-ramos-black/30 font-medium max-w-xl mx-auto leading-relaxed">
                Join the professional network that powers student success. Instant, secure, and university-verified.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg"
            >
              {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={onLogin}
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center space-x-6 py-8 rounded-[40px] bg-ramos-black text-white font-bold text-2xl hover:bg-ramos-red active:scale-[0.98] transition-all duration-500 shadow-2xl shadow-ramos-black/20"
              >
                {isLoading ? (
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
                    <span className="tracking-tighter">CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center space-x-4 text-ramos-black/20">
                <div className="w-12 h-px bg-ramos-black/10" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade Security</span>
                <div className="w-12 h-px bg-ramos-black/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
