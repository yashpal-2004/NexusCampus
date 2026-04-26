import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Sparkles, 
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
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4 lg:px-8 relative">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic leading-none whitespace-nowrap uppercase">Campus Wellness</h2>
          <div className="flex flex-wrap gap-4">
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Activity className="w-5 h-5 text-orange-500" />
              <span>Medical Emergencies</span>
            </p>
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Health Verification</span>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-3 px-6 py-3 rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 border border-orange-400">
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-nowrap">AI Health Bot Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Healthcare & Emergencies */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
          <div className="bg-white border border-red-100 rounded-[40px] p-8 shadow-xl shadow-red-500/5">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Emergency</h3>
            </div>
            
            <div className="space-y-4">
              {healthcareInfo.map((info, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-red-200 transition-all group shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">{info.type}</span>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-4 h-4 text-slate-300 group-hover:text-red-600" />
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 text-base mb-1 uppercase tracking-tighter">{info.name}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 mb-6">
                    <MapPin className="w-3 h-3" />
                    <span>{info.location}</span>
                  </p>
                  <a 
                    href={`tel:${info.contact}`}
                    className="block w-full py-5 rounded-[20px] bg-red-600 text-white text-center text-xs font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 uppercase tracking-widest"
                  >
                    DIAL IMMEDIATE
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Section: Professionalized View */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden h-[750px] flex flex-col relative group">
            <div className="absolute inset-0 bg-orange-600/[0.02] pointer-events-none" />
            
            {/* AI Header */}
            <div className="p-8 border-b border-slate-100 bg-white text-slate-900 flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/30">
                  <Bot className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2">Nexus Health Assistant</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Diagnostics</span>
                    </div>
                    <span className="text-slate-200">|</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Encrypted Session</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Response Speed: 0.2s
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar relative z-10">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
                  <div className="w-24 h-24 rounded-[36px] bg-white border border-slate-100 shadow-2xl flex items-center justify-center text-orange-500 hover:scale-110 transition-transform">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black italic uppercase text-slate-900 mb-4 tracking-tighter">Your Campus Wellness Bot</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose bg-slate-50 p-6 rounded-[28px] border border-slate-100 shadow-inner">
                      I'm here to help with stress management, symptom checks, and healthcare navigation. What's on your mind?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {['Headache help', 'Reduce stress'].map(tip => (
                      <button key={tip} onClick={() => { setQuery(tip); handleSend(); }} className="p-4 rounded-2xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest">
                        {tip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start space-x-4 max-w-[90%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-[14px] flex-shrink-0 flex items-center justify-center text-white shadow-xl",
                    msg.role === 'user' ? "bg-orange-500" : "bg-orange-600"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-6 rounded-[28px] text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' ? "bg-orange-500 text-white font-medium" : "bg-white border border-slate-100 text-slate-700"
                  )}>
                    <div className={cn(
                      "prose prose-sm max-w-none",
                      msg.role === 'user' ? "prose-invert" : ""
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-[14px] bg-orange-600 flex-shrink-0 flex items-center justify-center text-white shadow-xl">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-8 bg-white border-t border-slate-100 relative z-10">
              <div className="relative group">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about symptoms, wellness, or aid..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[28px] py-6 pl-8 pr-20 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 transition-all outline-none shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!query.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-orange-500 text-white hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <Activity className="w-3 h-3 text-red-500" />
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">Medical context only</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidential Chat</span>
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
