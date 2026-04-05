import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  Star, 
  ChevronRight, 
  Search, 
  Flame, 
  Leaf, 
  Info,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const FoodCourt: React.FC = () => {
  const [activeCourt, setActiveCourt] = useState<'North' | 'South' | 'Central'>('North');

  const outlets = [
    { name: 'Dominos', rating: 4.5, waitTime: '15-20 min', status: 'Open', type: 'Fast Food', image: 'https://picsum.photos/seed/dominos/400/300' },
    { name: 'Subway', rating: 4.2, waitTime: '5-10 min', status: 'Open', type: 'Healthy', image: 'https://picsum.photos/seed/subway/400/300' },
    { name: 'Starbucks', rating: 4.8, waitTime: '10-15 min', status: 'Open', type: 'Cafe', image: 'https://picsum.photos/seed/starbucks/400/300' },
    { name: 'Indian Kitchen', rating: 4.0, waitTime: '20-25 min', status: 'Busy', type: 'Main Course', image: 'https://picsum.photos/seed/indian/400/300' },
    { name: 'Wok to Walk', rating: 4.3, waitTime: '15-20 min', status: 'Open', type: 'Asian', image: 'https://picsum.photos/seed/wok/400/300' },
    { name: 'Juice Bar', rating: 4.6, waitTime: '2-5 min', status: 'Open', type: 'Beverages', image: 'https://picsum.photos/seed/juice/400/300' },
  ];

  const courts = ['North', 'South', 'Central'];

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Campus Food Court</h2>
          <p className="text-white/40 text-sm font-medium flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Check real-time wait times and menus across campus.</span>
          </p>
        </div>
        
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl">
          {courts.map((court) => (
            <button
              key={court}
              onClick={() => setActiveCourt(court as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                activeCourt === court 
                  ? "bg-white text-black shadow-lg" 
                  : "text-white/40 hover:text-white"
              )}
            >
              {court}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative mb-10">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input 
          type="text"
          placeholder="Search for outlets, cuisines, or dishes..."
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-white/20 focus:border-orange-500/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {outlets.map((outlet, i) => (
            <motion.div
              key={outlet.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden hover:border-orange-500/30 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={outlet.image} 
                  alt={outlet.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center space-x-1.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-black text-white">{outlet.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    outlet.status === 'Open' ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                  )}>
                    {outlet.status}
                  </span>
                  <div className="flex items-center space-x-1.5 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">{outlet.waitTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{outlet.name}</h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{outlet.type}</p>
                  </div>
                  <button className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Popular</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <Leaf className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Veg Options</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5">
                  <span>VIEW FULL MENU</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 text-center">
          <p className="text-4xl font-black text-white mb-2 tracking-tighter">12</p>
          <p className="text-xs font-black text-white/40 uppercase tracking-widest">Active Outlets</p>
        </div>
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 text-center">
          <p className="text-4xl font-black text-white mb-2 tracking-tighter">15m</p>
          <p className="text-xs font-black text-white/40 uppercase tracking-widest">Avg Wait Time</p>
        </div>
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 text-center">
          <p className="text-4xl font-black text-white mb-2 tracking-tighter">4.2</p>
          <p className="text-xs font-black text-white/40 uppercase tracking-widest">Avg Rating</p>
        </div>
      </div>
    </div>
  );
};

export default FoodCourt;
