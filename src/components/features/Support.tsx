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
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic leading-none whitespace-nowrap uppercase">Campus Support</h2>
          <div className="flex flex-wrap gap-4">
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>Administrative Aid</span>
            </p>
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <LifeBuoy className="w-5 h-5 text-orange-500" />
              <span>24/7 Technical Support</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Support Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subContacts.map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-[40px] p-8 hover:bg-slate-50 transition-all group shadow-sm flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-[24px] bg-orange-50 text-orange-600 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <contact.icon className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">{contact.role}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-none italic">{contact.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-orange-600 text-white hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dial Direct</span>
                  </a>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Send Email</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed FAQs Section */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Knowledge Base</h3>
              </div>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors flex items-center space-x-2">
                <span>View Full Database</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {faqs.map((faq, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all group">
                  <h4 className="text-sm font-black text-slate-900 mb-4 flex items-start space-x-3 leading-tight uppercase italic min-h-[40px]">
                    <span className="text-orange-600">Q.</span>
                    <span className="tracking-tight">{faq.q}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-loose pl-8 border-l-2 border-orange-500/10 group-hover:border-orange-500/30">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Resources & Links */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Resources</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Academic Calendar', desc: 'Syllabus & Session 2026', icon: Clock },
                { label: 'Interactive Map', desc: 'Building & Entrance Guide', icon: MapPin },
                { label: 'Hostel Rules', desc: 'Mandatory Guidelines 2026', icon: Shield },
                { label: 'Holiday List', desc: 'Full Year Schedule', icon: Clock },
              ].map((res, i) => (
                <button key={i} className="w-full flex items-center space-x-5 p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-200 transition-all group text-left shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-300 group-hover:text-orange-500 flex items-center justify-center transition-colors">
                    <res.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tighter italic group-hover:text-orange-600 truncate">{res.label}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{res.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Contact Banner */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px]" />
            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2 relative z-10">Direct Helpline</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10 leading-relaxed">
              Available for immediate non-medical campus assistance between 9AM-8PM.
            </p>
            <a 
              href="tel:+911234567890"
              className="flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-white text-slate-900 hover:bg-orange-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              <Phone className="w-4 h-4" />
              <span>Connect Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
