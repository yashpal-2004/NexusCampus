import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="w-full bg-ramos-black text-white pt-32 pb-12 px-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center space-x-3">
              <Logo size={32} />
              <span className="text-3xl font-bold tracking-tighter">NexusCampus</span>
            </div>
            <p className="text-white/40 font-medium max-w-sm leading-relaxed">
              The professional operating system for student life. We provide the tools you need to excel in your campus journey.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Platform</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-ramos-red transition-colors">Queries Hub</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Buddy Finder</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Wellness Center</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Laundry System</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Company</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-ramos-red transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-ramos-red transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/5 pt-12">
          <div className="flex flex-col space-y-2 mb-8 md:mb-0">
             <h3 className="text-4xl font-bold tracking-tighter hover:text-ramos-red transition-colors cursor-pointer">
               NexusCampus@gmail.com
             </h3>
             <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em]">Contact our campus success team</p>
          </div>
          <div className="flex space-x-6">
            {['Instagram', 'Twitter', 'LinkedIn', 'Facebook'].map(social => (
              <a key={social} href="#" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 text-center">
          © 2026 NexusCampus. All Rights Reserved. Engineered for Excellence.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
