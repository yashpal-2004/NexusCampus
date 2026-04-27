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
  MapPin,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const FoodCourt: React.FC = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<any | null>(null);

  const outlets = [
    { 
      name: 'Chai Adda', 
      rating: 4.8, 
      waitTime: '5-10 min', 
      status: 'Open', 
      type: 'Cafe', 
      image: '/mock/chai.png',
      menu: [
        { item: 'Masala Chai', price: '₹15', tags: ['Popular'] },
        { item: 'Cardamom Chai', price: '₹15', tags: [] },
        { item: 'Ginger Chai', price: '₹15', tags: [] },
        { item: 'Bun Maska', price: '₹30', tags: ['Popular'] },
        { item: 'Samosa (2 pcs)', price: '₹20', tags: ['Popular'] },
        { item: 'Tea-Rusk (2 pcs)', price: '₹10', tags: [] },
      ]
    },
    { 
      name: 'Tuck Shop', 
      rating: 4.2, 
      waitTime: '2-5 min', 
      status: 'Open', 
      type: 'Convenience', 
      image: '/mock/tuck.png',
      menu: [
        { item: 'Veg Maggi', price: '₹25', tags: ['Popular'] },
        { item: 'Cheese Maggi', price: '₹40', tags: [] },
        { item: 'Egg Maggi', price: '₹35', tags: [] },
        { item: 'Cold Coffee', price: '₹40', tags: ['Popular'] },
        { item: 'Lays/Kurkure', price: '₹20', tags: [] },
        { item: 'Soft Drink (Can)', price: '₹35', tags: [] },
      ]
    },
    { 
      name: 'CCD', 
      rating: 4.5, 
      waitTime: '10-15 min', 
      status: 'Open', 
      type: 'Premium Cafe', 
      image: '/mock/ccd.png',
      menu: [
        { item: 'Cappuccino', price: '₹120', tags: ['Popular'] },
        { item: 'Cafe Latte', price: '₹130', tags: [] },
        { item: 'Garlic Bread', price: '₹90', tags: ['Popular'] },
        { item: 'Veg Sandwich', price: '₹110', tags: [] },
        { item: 'Choco Brownie', price: '₹80', tags: ['Popular'] },
      ]
    },
    { 
      name: 'Mess Canteen', 
      rating: 3.8, 
      waitTime: 'varies', 
      status: 'Open', 
      type: 'Dining Hall', 
      image: '/mock/mess.png',
      menu: [
        { item: 'Special Thali', price: '₹80', tags: ['Popular'] },
        { item: 'Rajma Chawal', price: '₹50', tags: ['Popular'] },
        { item: 'Paneer Butter Masala', price: '₹70', tags: [] },
        { item: 'Dal Makhani', price: '₹60', tags: [] },
        { item: 'Roti (1 pc)', price: '₹5', tags: [] },
      ]
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-32 px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Campus Dining</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-6">Food Court</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <MapPin className="w-4 h-4 text-ramos-red" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Main Food Court Area</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <Info className="w-4 h-4 text-ramos-black/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Live Wait Times</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-8 py-4 rounded-[24px] bg-ramos-black text-white shadow-2xl shadow-ramos-black/20 border border-white/5">
          <Utensils className="w-5 h-5 text-ramos-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">All Vendors Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {outlets.map((outlet, i) => (
          <motion.div
            key={outlet.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white border border-ramos-black/5 rounded-[48px] overflow-hidden hover:border-ramos-red/20 transition-all flex flex-col shadow-2xl shadow-ramos-black/5"
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <img 
                src={outlet.image} 
                alt={outlet.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ramos-black/90 via-ramos-black/20 to-transparent" />
              
              <div className="absolute top-6 right-6">
                <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center space-x-2">
                  <Star className="w-3.5 h-3.5 text-ramos-red fill-current" />
                  <span className="text-xs font-black text-white tracking-tight">{outlet.rating}</span>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{outlet.name}</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{outlet.type}</p>
                
                <button 
                  onClick={() => setSelectedOutlet(outlet)}
                  className="w-full py-5 rounded-[24px] bg-white text-ramos-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-red hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3"
                >
                  <span>Explore Menu</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOutlet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOutlet(null)}
              className="absolute inset-0 bg-ramos-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[56px] overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={selectedOutlet.image} 
                  alt={selectedOutlet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ramos-black/90 via-ramos-black/40 to-transparent" />
                <button 
                  onClick={() => setSelectedOutlet(null)}
                  className="absolute top-8 right-8 p-4 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-ramos-red transition-all active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-10 left-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[10px] font-black text-ramos-red uppercase tracking-[0.3em] bg-ramos-red/10 px-3 py-1.5 rounded-full border border-ramos-red/20">{selectedOutlet.type}</span>
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                      <Star className="w-3 h-3 text-ramos-red fill-current" />
                      <span className="text-[10px] font-black text-white">{selectedOutlet.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-bold text-white tracking-tighter">{selectedOutlet.name}</h3>
                </div>
              </div>

              <div className="p-10 max-h-[50vh] overflow-y-auto no-scrollbar bg-ramos-gray/30">
                <div className="grid grid-cols-1 gap-4">
                  {selectedOutlet.menu.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-white border border-ramos-black/5 hover:border-ramos-red/20 transition-all group">
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 rounded-2xl bg-ramos-gray border border-ramos-black/5 flex items-center justify-center text-ramos-red group-hover:scale-105 transition-transform">
                          <Utensils className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-ramos-black text-lg tracking-tight mb-1">{item.item}</h4>
                          <div className="flex space-x-2">
                            {item.tags.map((tag: string) => (
                              <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-ramos-red/5 text-ramos-red border border-ramos-red/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-ramos-black text-xl tracking-tighter leading-none mb-2">{item.price}</span>
                        <div className="w-8 h-8 rounded-full bg-ramos-black text-white flex items-center justify-center hover:bg-ramos-red transition-colors cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 bg-white border-t border-ramos-black/5">
                <button 
                  onClick={() => setSelectedOutlet(null)}
                  className="w-full py-6 rounded-[28px] bg-ramos-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-red transition-all shadow-2xl shadow-ramos-black/20 active:scale-95"
                >
                  Close Menu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodCourt;
