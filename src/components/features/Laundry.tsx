import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Clock, 
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
    <div className="max-w-6xl mx-auto pt-12 pb-32 px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Campus Services</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-6">Laundry</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <MapPin className="w-4 h-4 text-ramos-red" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">Unified Centre Plaza</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-ramos-gray border border-ramos-black/5">
              <Timer className="w-4 h-4 text-ramos-black/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ramos-black/60">08:30 AM - 07:00 PM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-8 py-4 rounded-[24px] bg-ramos-black text-white shadow-2xl shadow-ramos-black/20 border border-white/5">
          <Zap className="w-5 h-5 animate-pulse text-ramos-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Service Status: Active</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-10">
        <AnimatePresence>
          {activeRequest && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-ramos-black rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-ramos-black/20 border border-white/10"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ramos-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-24 rounded-[32px] bg-ramos-red flex items-center justify-center text-white shadow-2xl shadow-ramos-red/40 border border-white/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-3xl font-bold tracking-tight">Order {activeRequest.id}</h4>
                      <span className="text-[10px] font-black text-ramos-red uppercase tracking-[0.2em] bg-ramos-red/10 px-3 py-1.5 rounded-full border border-ramos-red/20">{activeRequest.status}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{activeRequest.items} Units Registered</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-ramos-red" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estimated Completion: <span className="text-white ml-1">{countdown}</span></span>
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                       Return: {new Date(activeRequest.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10">
                    <motion.div 
                      key={countdown}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      style={{ width: `${Math.max(5, 100 - ( (new Date(activeRequest.returnDate).getTime() - new Date().getTime()) / activeRequest.timeLeftMs * 100 ))}%` }}
                      className="h-full bg-ramos-red rounded-full shadow-[0_0_30px_rgba(255,46,0,0.5)]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleEditClick}
                    className="p-5 rounded-[24px] bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    <Pencil className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="p-5 rounded-[24px] bg-ramos-red/10 border border-ramos-red/20 text-ramos-red hover:bg-ramos-red hover:text-white transition-all active:scale-95"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* New Drop-off */}
          <div className={cn(
            "bg-white border border-ramos-black/5 rounded-[48px] p-10 shadow-2xl shadow-ramos-black/5 transition-all",
            activeRequest && "opacity-40 pointer-events-none grayscale"
          )}>
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-4 rounded-[20px] bg-ramos-gray text-ramos-black border border-ramos-black/5">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ramos-black tracking-tight">Drop-off</h3>
            </div>

            <div className="space-y-10">
              <div className="p-10 rounded-[40px] bg-ramos-gray border border-ramos-black/5 relative flex flex-col items-center">
                <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] mb-8">Cloth Count</label>
                <div className="w-28 h-28 rounded-[36px] bg-white border border-ramos-black/5 flex flex-col items-center justify-center shadow-2xl shadow-ramos-black/5 mb-8">
                  <span className="text-5xl font-bold text-ramos-black leading-none">{activeRequest ? '-' : clothCount}</span>
                  <span className="text-[9px] font-black text-ramos-black/20 uppercase tracking-widest mt-2">Units</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={activeRequest ? 0 : clothCount}
                  onChange={(e) => setClothCount(parseInt(e.target.value))}
                  disabled={!!activeRequest}
                  className="w-full accent-ramos-red h-2 bg-white rounded-full appearance-none cursor-pointer border border-ramos-black/5"
                />
              </div>

              <button 
                onClick={() => handleRequest()}
                disabled={clothCount === 0 || isSubmitting || !!activeRequest}
                className="w-full py-6 rounded-[28px] bg-ramos-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-red disabled:opacity-20 transition-all shadow-2xl shadow-ramos-black/20 active:scale-95"
              >
                {isSubmitting ? "Processing..." : "Confirm Drop-off"}
              </button>
            </div>
          </div>

          {/* Timings */}
          <div className="bg-white border border-ramos-black/5 rounded-[48px] p-10 shadow-2xl shadow-ramos-black/5">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-4 rounded-[20px] bg-ramos-gray text-ramos-black border border-ramos-black/5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ramos-black tracking-tight">Service Slots</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Morning Slot', text: '08:30 AM - 10:30 AM', icon: Zap },
                { title: 'Evening Slot', text: '04:30 PM - 07:00 PM', icon: Clock },
                { title: 'Return Policy', text: '48 Hour Processing Cycle', icon: History },
              ].map((rule, i) => (
                <div key={i} className="flex items-center space-x-5 p-6 rounded-[32px] bg-ramos-gray border border-transparent hover:border-ramos-black/5 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-ramos-black/5 text-ramos-red flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <rule.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ramos-black text-xs uppercase tracking-tight mb-1">{rule.title}</h4>
                    <p className="text-[10px] text-ramos-black/40 font-black uppercase tracking-widest">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white border border-ramos-black/5 rounded-[48px] p-10 shadow-2xl shadow-ramos-black/5 flex flex-col group relative overflow-hidden">
            <div className="absolute inset-0 bg-ramos-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-4 mb-10 relative z-10">
              <div className="p-4 rounded-[20px] bg-ramos-gray text-ramos-black border border-ramos-black/5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ramos-black tracking-tight relative z-10">Support</h3>
            </div>
            <p className="text-ramos-black/40 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 relative z-10 flex-1">
              Lost items or delay inquiries? Visit the Plaza counter or contact warden for authorization.
            </p>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-full py-5 rounded-[24px] bg-ramos-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-red transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-ramos-black/20 relative z-10"
            >
              <History className="w-4 h-4" />
              <span>Full Archive</span>
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
