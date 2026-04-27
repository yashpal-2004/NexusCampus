import React from 'react';
import { 
  Phone, 
  Mail, 
  Shield, 
  LifeBuoy, 
  HelpCircle, 
  BookOpen, 
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const Support: React.FC = () => {
  const subContacts = [
    { role: 'Warden Office', name: 'Mr. Mohit Sherawat', phone: '+91 98765 43210', email: 'warden@univ.edu', icon: Shield },
    { role: 'IT Support', name: 'Campus Tech Desk', phone: '+91 11223 34455', email: 'it.support@univ.edu', icon: LifeBuoy },
    { role: 'Wellness Desk', name: 'Student Counseling', phone: '+91 55667 78899', email: 'wellness@univ.edu', icon: HelpCircle },
  ];

  const faqs = [
    { q: 'How to reset my campus WiFi password?', a: 'Visit the IT portal at portal.univ.edu or visit Block B, Room 102.' },
    { q: 'What are the library timings?', a: 'The central library is open 24/7 during exam weeks, otherwise 8 AM to 10 PM.' },
    { q: 'How to apply for a room change?', a: 'Room change requests are open during the first week of each semester via the Warden portal.' },
    { q: 'Lost & Found Procedures?', a: 'Report any lost items to the main reception Desk at Student Plaza within 24 hours.' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-32 px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Campus Services</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-6">Support</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <Shield className="w-4 h-4 text-ramos-red" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Administrative Aid</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <LifeBuoy className="w-4 h-4 text-ramos-black/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">24/7 Technical Desk</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-8 py-4 rounded-[24px] bg-ramos-black text-white shadow-2xl shadow-ramos-black/20 border border-white/5">
          <HelpCircle className="w-5 h-5 text-ramos-red animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Support Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Support Grid */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subContacts.map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-ramos-black/5 rounded-[48px] p-10 hover:border-ramos-red/20 transition-all group shadow-2xl shadow-ramos-black/5 flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-[28px] bg-ramos-gray text-ramos-red mb-8 flex items-center justify-center group-hover:scale-110 transition-transform border border-ramos-black/5">
                    <contact.icon className="w-8 h-8" />
                  </div>
                  <p className="text-[9px] font-black text-ramos-red uppercase tracking-[0.3em] mb-3 ml-1">{contact.role}</p>
                  <h3 className="text-2xl font-bold text-ramos-black mb-10 tracking-tight leading-tight">{contact.name}</h3>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center justify-center space-x-3 w-full py-5 rounded-[24px] bg-ramos-black text-white hover:bg-ramos-red transition-all shadow-2xl shadow-ramos-black/20 active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dial Direct</span>
                  </a>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center justify-center space-x-3 w-full py-5 rounded-[24px] bg-ramos-gray border border-ramos-black/5 text-ramos-black/60 hover:bg-ramos-black hover:text-white transition-all active:scale-95"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Email</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed FAQs Section */}
          <div className="bg-ramos-black rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl shadow-ramos-black/20 border border-white/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ramos-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 relative z-10 gap-6">
              <div className="flex items-center space-x-5">
                <div className="p-4 rounded-[24px] bg-white/5 border border-white/10 text-ramos-red">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Knowledge Base</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Policy & Information</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-ramos-red transition-colors flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <span>Repository</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {faqs.map((faq, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-ramos-red/40 transition-all group">
                  <div className="flex items-start space-x-4 mb-4">
                    <span className="text-ramos-red font-black text-xs uppercase tracking-widest mt-1">Ref.</span>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {faq.q}
                    </h4>
                  </div>
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.1em] leading-relaxed pl-8 border-l border-white/10 group-hover:border-ramos-red/30 transition-colors">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Resources & Links */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white border border-ramos-black/5 rounded-[56px] p-10 shadow-2xl shadow-ramos-black/5">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-4 rounded-[20px] bg-ramos-gray text-ramos-black border border-ramos-black/5">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ramos-black tracking-tight">Resources</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Academic Calendar', desc: 'Session 2026 Schedule', icon: Clock },
                { label: 'Interactive Map', desc: 'Campus Building Guide', icon: MapPin },
                { label: 'Institutional Rules', desc: 'Mandatory Guidelines', icon: Shield },
                { label: 'Holiday List', desc: 'Annual Leave Schedule', icon: Clock },
              ].map((res, i) => (
                <button key={i} className="w-full flex items-center space-x-5 p-6 rounded-[32px] bg-ramos-gray border border-transparent hover:bg-white hover:border-ramos-red/20 hover:shadow-xl transition-all group text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-ramos-black/5 text-ramos-black/20 group-hover:text-ramos-red flex items-center justify-center transition-all group-hover:scale-105">
                    <res.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-ramos-black text-sm mb-1 tracking-tight group-hover:text-ramos-red transition-colors">{res.label}</h4>
                    <p className="text-[9px] font-black text-ramos-black/30 uppercase tracking-widest">{res.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ramos-black/10 group-hover:text-ramos-black group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Contact Banner */}
          <div className="bg-ramos-black rounded-[56px] p-10 text-white relative overflow-hidden shadow-2xl shadow-ramos-black/40 border border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-ramos-red/20 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h4 className="text-2xl font-bold tracking-tight mb-3">Campus Helpline</h4>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 leading-relaxed">
                Available for institutional assistance between 09:00 AM - 08:00 PM.
              </p>
              <a 
                href="tel:+911234567890"
                className="flex items-center justify-center space-x-4 w-full py-6 rounded-[28px] bg-white text-ramos-black hover:bg-ramos-red hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95"
              >
                <Phone className="w-5 h-5" />
                <span>Establish Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
