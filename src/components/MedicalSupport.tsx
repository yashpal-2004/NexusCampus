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
  LifeBuoy, 
  Mail, 
  Shield, 
  BookOpen, 
  ExternalLink,
  HelpCircle,
  X,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface MedicalSupportProps {
  onAskAI: (query: string) => Promise<string>;
}

const MedicalSupport: React.FC<MedicalSupportProps> = ({ onAskAI }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

  const subContacts = [
    { role: 'Warden Office', name: 'Mr. Mohit Sherawat', phone: '+91 98765 43210', email: 'warden@univ.edu', icon: Shield },
    { role: 'IT Support', name: 'Campus Tech Desk', phone: '+91 11223 34455', email: 'it.support@univ.edu', icon: LifeBuoy },
    { role: 'Counseling', name: 'Student Wellness', phone: '+91 55667 78899', email: 'wellness@univ.edu', icon: HelpCircle },
  ];

  const faqs = [
    { q: 'How to reset my campus WiFi password?', a: 'Visit the IT portal at portal.univ.edu or visit Block B, Room 102.' },
    { q: 'What are the library timings?', a: 'The central library is open 24/7 during exam weeks, otherwise 8 AM to 10 PM.' },
    { q: 'How to apply for a room change?', a: 'Room change requests are open during the first week of each semester via the Warden portal.' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4 relative">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Wellness & Support</h2>
        <p className="text-slate-500 text-sm font-medium">Healthcare resources, administrative aid, and mental wellness in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Healthcare & Emergencies */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-red-100 rounded-[40px] p-8 shadow-xl shadow-red-500/5 h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Emergency</h3>
            </div>
            
            <div className="space-y-4">
              {healthcareInfo.map((info, i) => (
                <div key={i} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-red-200 transition-all group shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{info.type}</span>
                    <Phone className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-colors" />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">{info.name}</h4>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>{info.location}</span>
                  </p>
                  <a 
                    href={`tel:${info.contact}`}
                    className="block w-full py-4 rounded-2xl bg-red-600 text-white text-center text-[10px] font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest"
                  >
                    CALL NOW
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Contacts */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subContacts.map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-[40px] p-6 hover:bg-slate-50 transition-all group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-600 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">{contact.role}</p>
                  <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight uppercase leading-tight italic">{contact.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-md shadow-orange-600/10"
                  >
                    <Phone className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                  </a>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <Mail className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resources */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-3 italic uppercase">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <span>Resources</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Academic Calendar', desc: 'Session 2026' },
                  { label: 'Interactive Map', desc: 'Find your buildings' },
                  { label: 'Hostel Rules', desc: 'Guidelines 2026' },
                ].map((res, i) => (
                  <button key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-100 hover:bg-slate-50 transition-all group text-left shadow-sm">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm mb-0.5 uppercase tracking-tight italic group-hover:text-orange-600 transition-colors">{res.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-3 italic uppercase">
                <HelpCircle className="w-6 h-6 text-orange-600" />
                <span>FAQs</span>
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-orange-200 transition-all shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-900 mb-1 flex items-start space-x-2 leading-tight">
                      <span className="text-orange-600 uppercase italic">Q:</span>
                      <span className="uppercase tracking-tight">{faq.q}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium pl-5 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Bubble */}
      <div className="fixed bottom-24 right-8 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[40px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black italic tracking-tight uppercase text-sm">Health Assistant</h3>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Response Speed: Instant</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 no-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                    <div className="w-20 h-20 rounded-[32px] bg-white border border-slate-100 shadow-xl flex items-center justify-center text-blue-600">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase text-slate-900 mb-2">Hello, Student!</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        How are you feeling today? Ask me about symptoms, mental wellness, or campus healthcare facilities.
                      </p>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-start space-x-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-md",
                      msg.role === 'user' ? "bg-slate-900" : "bg-blue-600"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-3xl text-xs leading-relaxed shadow-sm",
                      msg.role === 'user' ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-700"
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-2xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative group">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your concern..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[20px] py-4 pl-6 pr-14 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 transition-all outline-none"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!query.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-blue-600 text-white hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-blue-600/20 group-focus-within:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Activity className="w-3 h-3 text-red-500" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Medical advice only • 24/7 Monitoring</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "w-16 h-16 rounded-[28px] shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group",
            isChatOpen ? "bg-slate-900" : "bg-blue-600 shadow-blue-600/30"
          )}
        >
          {isChatOpen ? <Minimize2 className="w-8 h-8" /> : (
            <div className="relative">
              <Bot className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600" />
            </div>
          )}
          <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
            Ask wellness AI
          </div>
        </button>
      </div>
    </div>
  );
};

export default MedicalSupport;
