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
import { cn } from '../lib/utils';

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
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Campus Laundry</h2>
          <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>Unified Centre • Morning (8:30-10:30 AM) • Evening (4:30-7:00 PM)</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <Clock className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-nowrap">Unified centre plaza</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Action: New Request */}
          <div className={cn(
            "bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm transition-all",
            activeRequest && "opacity-50 pointer-events-none grayscale"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                  <Shirt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">New Drop-off</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Single active request per student</p>
                </div>
              </div>
              {activeRequest && (
                <div className="px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest animate-pulse">
                  Request in Progress
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 relative group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Cloth count (Max 10 items)</label>
                <div className="flex items-center space-x-8">
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    value={activeRequest ? 0 : clothCount}
                    onChange={(e) => setClothCount(parseInt(e.target.value))}
                    disabled={!!activeRequest}
                    className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
                  />
                  <div className="w-24 h-24 rounded-3xl bg-white border-2 border-blue-500 flex flex-col items-center justify-center shadow-xl shadow-blue-500/10 transition-transform group-hover:scale-105">
                    <span className="text-4xl font-black text-blue-600 leading-none">{activeRequest ? '-' : clothCount}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase mt-2 tracking-widest">Items</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center space-x-4">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Standard Turnaround</p>
                    <p className="text-sm font-black text-blue-600">48H from 7:00 PM</p>
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-orange-50/50 border border-orange-100 flex items-center space-x-4">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Service Inclusion</p>
                    <p className="text-sm font-black text-orange-600">Wash, Iron & Fold</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleRequest()}
                disabled={clothCount === 0 || isSubmitting || !!activeRequest}
                className="w-full py-5 rounded-[28px] bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-slate-900/10"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>{activeRequest ? 'REQUEST ACTIVE' : 'Confirm Drop-off'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Request View */}
          <AnimatePresence>
            {activeRequest && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#121212] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/10"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black italic tracking-tight uppercase">Request {activeRequest.id}</h4>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{activeRequest.items} Items • Scheduled Return</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleEditClick}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5">Collection Day</p>
                      <p className="text-base font-black text-blue-400 uppercase tracking-tighter">
                        {new Date(activeRequest.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Timer className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-bold text-white/70 tracking-tight">READY IN <span className="text-blue-400 font-black ml-1">{countdown}</span></span>
                    </div>
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full">{activeRequest.status}</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                    <motion.div 
                      key={countdown}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      style={{ width: `${Math.max(5, 100 - ( (new Date(activeRequest.returnDate).getTime() - new Date().getTime()) / activeRequest.timeLeftMs * 100 ))}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
            <h3 className="font-black text-slate-900 tracking-tight mb-8 italic flex items-center space-x-3 uppercase">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <span>Timings</span>
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Morning Slot', text: '08:30 AM - 10:30 AM', icon: Zap },
                { title: 'Evening Slot', text: '04:30 PM - 07:00 PM', icon: Clock },
                { title: 'Processing', text: 'Starts 07:00 PM onwards', icon: History },
              ].map((rule, i) => (
                <div key={i} className="flex items-start space-x-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 group transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <rule.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight italic">{rule.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-black rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-black italic tracking-tight uppercase">Support</h3>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-loose mb-8 relative z-10">
              Lost items or delay inquiries? Visit the Plaza counter or contact warden for authorization.
            </p>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-full py-5 rounded-[24px] bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center space-x-2 relative z-10"
            >
              <History className="w-4 h-4" />
              <span>VIEW PAST HISTORY</span>
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
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-500">
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
                  <div className="p-3 rounded-2xl bg-blue-600 text-white">
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
                      className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-500 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-blue-600 leading-none">{editCount}</span>
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
                    className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-900/10"
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
