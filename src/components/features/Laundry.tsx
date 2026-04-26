import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Timer,
  X,
  History,
  Pencil,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const Laundry: React.FC = () => {
  const [clothCount, setClothCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    items: number;
    status: 'Processing' | 'Ready' | 'Delivered';
    dropDate: string;
    returnDate: string;
    timeLeftMs: number;
  } | null>(null);

  const [countdown, setCountdown] = useState<string>('48:00:00');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [editCount, setEditCount] = useState(0);

  useEffect(() => {
    if (!activeRequest) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const returnTime = new Date(activeRequest.returnDate).getTime();
      const diff = returnTime - now;

      if (diff <= 0) {
        setCountdown('00:00:00');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRequest]);

  const handleRequest = (countOverride?: number) => {
    const finalCount = countOverride ?? clothCount;
    if (finalCount <= 0 || finalCount > 10) return;
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const returnDate = new Date();
      returnDate.setHours(19, 0, 0, 0);
      returnDate.setDate(returnDate.getDate() + 2);

      setActiveRequest({
        id: activeRequest?.id || `L-${Math.floor(Math.random() * 9000) + 1000}`,
        items: finalCount,
        status: 'Processing',
        dropDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        returnDate: returnDate.toISOString(),
        timeLeftMs: returnDate.getTime() - now.getTime()
      });
      setIsSubmitting(false);
      setClothCount(0);
      setShowEditModal(false);
      setShowCancelModal(false);
    }, 1200);
  };

  const handleConfirmCancel = () => {
    setActiveRequest(null);
    setClothCount(0);
    setShowCancelModal(false);
  };

  const handleEditClick = () => {
    if (activeRequest) {
      setEditCount(activeRequest.items);
      setShowEditModal(true);
    }
  };

  const pastHistory = [
    { id: 'L-8422', date: '20 Apr', items: 8, status: 'Delivered' },
    { id: 'L-7193', date: '15 Apr', items: 4, status: 'Delivered' },
    { id: 'L-6401', date: '10 Apr', items: 10, status: 'Delivered' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic leading-none truncate">Campus Laundry</h2>
          <div className="flex flex-wrap gap-4">
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Unified Centre Plaza</span>
            </p>
            <p className="text-slate-500 text-sm font-bold flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Timer className="w-5 h-5 text-orange-500" />
              <span>08:30 AM - 10:30 AM • 04:30 PM - 07:00 PM</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 border border-orange-400">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-nowrap">Unified Live Status</span>
        </div>
      </div>

      {/* Main Grid: Horizontal Utilization */}
      <div className="space-y-8">
        {/* Active Request: Full Width Header when active */}
        <AnimatePresence>
          {activeRequest && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[40px] p-8 text-slate-900 relative overflow-hidden shadow-2xl shadow-orange-500/5 border-2 border-orange-100"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-[28px] bg-orange-600 flex items-center justify-center text-white shadow-2xl shadow-orange-600/40">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">Active Order {activeRequest.id}</h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{activeRequest.items} Items</span>
                      <span className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{activeRequest.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center space-x-2">
                      <Timer className="w-5 h-5 text-orange-500" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Est. Ready in <span className="text-orange-600 ml-1">{countdown}</span></span>
                    </div>
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                       {new Date(activeRequest.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                    <motion.div 
                      key={countdown}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      style={{ width: `${Math.max(5, 100 - ( (new Date(activeRequest.returnDate).getTime() - new Date().getTime()) / activeRequest.timeLeftMs * 100 ))}%` }}
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleEditClick}
                    className="group flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-all"
                  >
                    <Pencil className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="group flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Col 1: Action */}
          <div className={cn(
            "bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm transition-all",
            activeRequest && "opacity-50 pointer-events-none grayscale"
          )}>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">New Drop-off</h3>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 relative group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Cloth count</label>
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 rounded-3xl bg-white border-2 border-orange-500 flex flex-col items-center justify-center shadow-xl shadow-orange-500/10">
                    <span className="text-4xl font-black text-orange-600">{activeRequest ? '-' : clothCount}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Items</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    value={activeRequest ? 0 : clothCount}
                    onChange={(e) => setClothCount(parseInt(e.target.value))}
                    disabled={!!activeRequest}
                    className="w-full accent-orange-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button 
                onClick={() => handleRequest()}
                disabled={clothCount === 0 || isSubmitting || !!activeRequest}
                className="w-full py-5 rounded-[28px] bg-orange-500 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-orange-500/20"
              >
                {isSubmitting ? "Processing..." : "Confirm Drop-off"}
              </button>
            </div>
          </div>

          {/* Col 2: Timings */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">Timings</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Morning Slot', text: '08:30 AM - 10:30 AM', icon: Zap },
                { title: 'Evening Slot', text: '04:30 PM - 07:00 PM', icon: Clock },
                { title: 'Processing', text: 'Starts 07:00 PM onwards', icon: History },
              ].map((rule, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-[28px] bg-slate-50 border border-slate-100 group transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <rule.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-tighter italic leading-none mb-1">{rule.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Support */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 text-slate-900 shadow-sm relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-4 mb-8 relative z-10">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">Support</h3>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10 relative z-10 px-1 font-black flex-1">
              Lost items or delay inquiries? Visit the Plaza counter or contact warden for authorization.
            </p>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-full py-5 rounded-[24px] bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center space-x-2 relative z-10 shadow-xl shadow-slate-900/10"
            >
              <History className="w-4 h-4" />
              <span>PAST HISTORY</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-slate-900 text-white">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Laundry History</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your past 3 drop-offs</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-4">
                {pastHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm italic uppercase">{h.id}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.date} • {h.items} Items</p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest border border-green-100">
                      {h.status}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">End of History</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Request Modal */}
      <AnimatePresence>
        {showEditModal && activeRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-orange-600 text-white">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase italic">Edit Item Count</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 rounded-full bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">New cloth count</label>
                  <div className="flex items-center space-x-8 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={editCount}
                      onChange={(e) => setEditCount(parseInt(e.target.value))}
                      className="flex-1 accent-orange-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-orange-500 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-orange-600 leading-none">{editCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleRequest(editCount)}
                    className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-slate-900/10"
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black italic uppercase italic mb-2">Cancel Request?</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">
                Are you sure you want to cancel this laundry drop-off request? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Laundry;
