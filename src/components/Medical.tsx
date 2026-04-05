import React, { useState } from 'react';
import { 
  Stethoscope, 
  Phone, 
  MapPin, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Activity, 
  Heart, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface MedicalProps {
  onAskAI: (query: string) => Promise<string>;
}

const Medical: React.FC<MedicalProps> = ({ onAskAI }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
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
    <div className="max-w-5xl mx-auto pt-8 pb-24 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: AI Assistant */}
      <div className="lg:col-span-2 flex flex-col h-[calc(100vh-12rem)] bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight italic">Health AI Assistant</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Sparkles className="w-12 h-12 text-orange-600" />
              <p className="text-sm font-medium text-slate-600 max-w-xs">
                Ask me anything about your health, symptoms, or wellness. I'm here to help!
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-start space-x-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white",
                msg.role === 'user' ? "bg-orange-600" : "bg-slate-200 text-slate-600"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user' ? "bg-orange-600 text-white" : "bg-white border border-slate-100 text-slate-700"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-slate-100 text-slate-700 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your symptoms or ask a question..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!query.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
            Disclaimer: AI advice is not a substitute for professional medical consultation.
          </p>
        </div>
      </div>

      {/* Right Column: Contacts & Info */}
      <div className="space-y-6">
        <div className="bg-white border border-red-100 rounded-[32px] p-6 shadow-xl shadow-red-500/5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 tracking-tight italic">Emergency Contacts</h3>
          </div>
          
          <div className="space-y-4">
            {healthcareInfo.map((info, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-red-200 transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{info.type}</span>
                  <Phone className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{info.name}</h4>
                <p className="text-slate-500 text-xs flex items-center space-x-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{info.location}</span>
                </p>
                <a 
                  href={`tel:${info.contact}`}
                  className="block w-full py-3 rounded-2xl bg-red-600 text-white text-center text-xs font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest"
                >
                  CALL NOW
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <h3 className="font-black text-slate-900 tracking-tight mb-4 flex items-center space-x-2 italic">
            <Activity className="w-5 h-5 text-orange-600" />
            <span>Health Stats</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Heart className="w-5 h-5 text-pink-500 mx-auto mb-2" />
              <p className="text-xl font-black text-slate-900">72</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BPM Avg</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Activity className="w-5 h-5 text-green-500 mx-auto mb-2" />
              <p className="text-xl font-black text-slate-900">98%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SpO2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medical;
