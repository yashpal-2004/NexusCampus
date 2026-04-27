import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Send, 
  Bot, 
  User, 
  Activity, 
  AlertCircle,
  X,
  Minimize2,
  Shield,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface WellnessProps {
  onAskAI: (query: string) => Promise<string>;
}

const Wellness: React.FC<WellnessProps> = ({ onAskAI }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMsg = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await onAskAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting to my healthy brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const healthcareInfo = [
    { name: 'College Health Center', contact: '+91 98765 43210', location: 'Block A, Ground Floor', type: 'On-Campus' },
    { name: 'City General Hospital', contact: '+91 11223 34455', location: 'Main Road, 2km away', type: 'Emergency' },
    { name: '24/7 Pharmacy', contact: '+91 55667 78899', location: 'Student Plaza', type: 'Pharmacy' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-32 px-6 lg:px-8 relative">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Health & Support</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-6">Wellness</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <Activity className="w-4 h-4 text-ramos-red" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Medical Services</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <Shield className="w-4 h-4 text-ramos-black/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Confidential</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-8 py-4 rounded-[24px] bg-ramos-black text-white shadow-2xl shadow-ramos-black/20 border border-white/5">
          <Bot className="w-5 h-5 animate-pulse text-ramos-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Health Intelligence Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Healthcare & Emergencies */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-ramos-black rounded-[48px] p-10 shadow-2xl shadow-ramos-black/20 border border-white/5">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 rounded-[20px] bg-ramos-red flex items-center justify-center text-white shadow-xl shadow-ramos-red/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Emergency</h3>
            </div>
            
            <div className="space-y-6">
              {healthcareInfo.map((info, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-ramos-red uppercase tracking-[0.2em] bg-ramos-red/10 px-3 py-1.5 rounded-full border border-ramos-red/20">{info.type}</span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-ramos-red transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1 tracking-tight">{info.name}</h4>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 mb-8">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{info.location}</span>
                  </p>
                  <a 
                    href={`tel:${info.contact}`}
                    className="block w-full py-5 rounded-[20px] bg-white text-ramos-black text-center text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-white/5"
                  >
                    Direct Dial
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-ramos-black/5 rounded-[48px] shadow-2xl shadow-ramos-black/5 overflow-hidden h-[800px] flex flex-col relative">
            <div className="absolute inset-0 bg-ramos-gray/50 pointer-events-none" />
            
            {/* AI Header */}
            <div className="p-10 border-b border-ramos-black/5 bg-white/80 backdrop-blur-xl flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-ramos-black flex items-center justify-center text-white shadow-2xl shadow-ramos-black/20 border border-white/10">
                  <Bot className="w-10 h-10 text-ramos-red" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-ramos-black leading-none mb-2">Nexus Support Bot</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/20">System Online</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-ramos-black/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-ramos-red">End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar relative z-10">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-sm mx-auto">
                  <div className="w-24 h-24 rounded-[36px] bg-white border border-ramos-black/5 shadow-2xl flex items-center justify-center text-ramos-red hover:scale-110 transition-transform">
                    <Activity className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-ramos-black mb-4 tracking-tight leading-tight">Professional Wellness Guidance</h4>
                    <p className="text-sm font-bold text-ramos-black/40 uppercase tracking-[0.1em] leading-relaxed">
                      Assisting with healthcare navigation, mental wellness, and symptom assessments.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {['Healthcare info', 'Stress support'].map(tip => (
                      <button key={tip} onClick={() => { setQuery(tip); handleSend(); }} className="p-5 rounded-[24px] bg-white border border-ramos-black/5 text-[10px] font-black text-ramos-black/40 hover:border-ramos-red hover:text-ramos-red transition-all uppercase tracking-widest">
                        {tip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start space-x-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-[18px] flex-shrink-0 flex items-center justify-center text-white shadow-xl",
                    msg.role === 'user' ? "bg-ramos-red shadow-ramos-red/20" : "bg-ramos-black border border-white/10"
                  )}>
                    {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6 text-ramos-red" />}
                  </div>
                  <div className={cn(
                    "p-8 rounded-[32px] text-base leading-relaxed shadow-sm tracking-tight",
                    msg.role === 'user' ? "bg-ramos-red text-white font-medium rounded-tr-none shadow-xl shadow-ramos-red/20" : "bg-white border border-ramos-black/5 text-ramos-black/80 rounded-tl-none"
                  )}>
                    <div className={cn(
                      "prose prose-sm max-w-none",
                      msg.role === 'user' ? "prose-invert font-bold" : ""
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-[18px] bg-ramos-black flex-shrink-0 flex items-center justify-center border border-white/10">
                    <Bot className="w-6 h-6 text-ramos-red" />
                  </div>
                  <div className="p-8 rounded-[32px] bg-white border border-ramos-black/5 shadow-sm flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-ramos-red animate-bounce" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ramos-red animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ramos-red animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-10 bg-white border-t border-ramos-black/5 relative z-10">
              <div className="relative group">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire about symptoms or campus support..."
                  className="w-full bg-ramos-gray border border-transparent rounded-[32px] py-7 pl-10 pr-24 text-base font-bold text-ramos-black placeholder:text-ramos-black/10 focus:bg-white focus:border-ramos-red/20 transition-all outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!query.trim() || isLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[24px] bg-ramos-black text-white hover:bg-ramos-red disabled:opacity-20 transition-all shadow-2xl shadow-ramos-black/20 flex items-center justify-center active:scale-95"
                >
                  <Send className="w-7 h-7" />
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-ramos-red/5 border border-ramos-red/10">
                  <Activity className="w-3.5 h-3.5 text-ramos-red" />
                  <span className="text-[9px] font-black text-ramos-red uppercase tracking-[0.2em]">Verified Context</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-ramos-black/5 border border-ramos-black/10">
                  <Shield className="w-3.5 h-3.5 text-ramos-black/40" />
                  <span className="text-[9px] font-black text-ramos-black/40 uppercase tracking-[0.2em]">Secure Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
