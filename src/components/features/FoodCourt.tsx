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
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Campus Food Court</h2>
          <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Check real-time wait times and menus across campus.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {outlets.map((outlet, i) => (
          <motion.div
            key={outlet.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white border border-slate-200 rounded-[40px] overflow-hidden hover:border-orange-500/30 transition-all flex flex-col shadow-sm"
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

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{outlet.name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{outlet.type}</p>
                </div>
                <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
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

              <button 
                onClick={() => setSelectedOutlet(outlet)}
                className="w-full mt-auto py-4 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center space-x-2 hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10"
              >
                <span>VIEW FULL MENU</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Menu Modal */}
      <AnimatePresence>
        {selectedOutlet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOutlet(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={selectedOutlet.image} 
                  alt={selectedOutlet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={() => setSelectedOutlet(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-black text-white tracking-tighter">{selectedOutlet.name}</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{selectedOutlet.type}</p>
                </div>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                  {selectedOutlet.menu.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-500/30 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500 shadow-sm">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.item}</h4>
                          <div className="flex space-x-2 mt-1">
                            {item.tags.map((tag: string) => (
                              <span key={tag} className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-black text-slate-900 text-sm">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setSelectedOutlet(null)}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  Done
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
