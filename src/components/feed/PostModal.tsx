import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  ShoppingBag, 
  Image as ImageIcon, 
  Send, 
  Clock, 
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostQuery: (content: string, imageUrl?: string) => void;
  onPostBlinkit: (item: string, window: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPostQuery, onPostBlinkit }) => {
  const [activeTab, setActiveTab] = useState<'query' | 'blinkit'>('query');
  
  // Query State
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Blinkit State
  const [blinkitItem, setBlinkitItem] = useState('');
  const [blinkitWindow, setBlinkitWindow] = useState(10);

  const handleSubmit = () => {
    if (activeTab === 'query') {
      if (content.trim()) {
        onPostQuery(content, imageUrl);
        onClose();
        setContent('');
        setImageUrl('');
      }
    } else if (activeTab === 'blinkit') {
      if (blinkitItem.trim()) {
        onPostBlinkit(blinkitItem, blinkitWindow);
        onClose();
        setBlinkitItem('');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ramos-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
          >
            {/* Header / Tab System */}
            <div className="pt-10 px-10 pb-6 flex items-center justify-between border-b border-ramos-gray">
              <div className="flex bg-ramos-gray p-1.5 rounded-[24px]">
                <button
                  onClick={() => setActiveTab('query')}
                  className={cn(
                    "flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
                    activeTab === 'query' ? "bg-white text-ramos-black shadow-xl shadow-ramos-black/5" : "text-ramos-black/20 hover:text-ramos-black"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Query</span>
                </button>
                <button
                  onClick={() => setActiveTab('blinkit')}
                  className={cn(
                    "flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
                    activeTab === 'blinkit' ? "bg-white text-ramos-black shadow-xl shadow-ramos-black/5" : "text-ramos-black/20 hover:text-ramos-black"
                  )}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shared Order</span>
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-ramos-gray text-ramos-black/20 hover:text-ramos-black hover:bg-ramos-gray/80 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-12">
              <AnimatePresence mode="wait">
                {activeTab === 'query' ? (
                  <motion.div 
                    key="query-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-ramos-red" />
                        <span>Post a Query</span>
                      </label>
                      <textarea
                        autoFocus
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's the current status on campus?"
                        className="w-full bg-transparent text-ramos-black text-2xl font-bold tracking-tight placeholder:text-ramos-black/5 border-none focus:ring-0 resize-none min-h-[180px] outline-none"
                      />
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-ramos-gray flex items-center justify-center border border-ramos-black/5">
                        <ImageIcon className="w-4 h-4 text-ramos-black/40" />
                      </div>
                      <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Add image URL (optional)"
                        className="w-full bg-ramos-gray border border-transparent rounded-[24px] py-5 pl-18 pr-6 text-sm font-bold text-ramos-black placeholder:text-ramos-black/20 focus:bg-white focus:border-ramos-red/20 transition-all outline-none"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="blinkit-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] flex items-center space-x-2">
                        <ShoppingBag className="w-3 h-3 text-ramos-red" />
                        <span>Shared Order Details</span>
                      </label>
                      <input 
                        autoFocus
                        type="text"
                        value={blinkitItem}
                        onChange={(e) => setBlinkitItem(e.target.value)}
                        placeholder="What are you ordering? (e.g. Pizza)"
                        className="w-full bg-ramos-gray border border-transparent rounded-[24px] py-6 px-8 text-xl font-bold text-ramos-black placeholder:text-ramos-black/20 focus:bg-white focus:border-ramos-red/20 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] flex items-center space-x-3">
                        <Clock className="w-3 h-3 text-ramos-red" />
                        <span>Order Window (Minutes)</span>
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {[5, 10, 15, 20].map((min) => (
                          <button
                            key={min}
                            onClick={() => setBlinkitWindow(min)}
                            className={cn(
                              "py-5 rounded-[20px] text-[10px] font-black transition-all border uppercase tracking-widest",
                              blinkitWindow === min 
                                ? "bg-ramos-black text-white border-ramos-black shadow-2xl shadow-ramos-black/20" 
                                : "bg-ramos-gray text-ramos-black/20 border-transparent hover:bg-ramos-gray/80 hover:text-ramos-black"
                            )}
                          >
                            {min}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Footer */}
            <div className="p-10 bg-ramos-gray flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-ramos-red animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-black/20 italic">Nexus Protocol</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={activeTab === 'query' ? !content.trim() : !blinkitItem.trim()}
                className={cn(
                  "flex items-center space-x-4 px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95",
                  "bg-ramos-red text-white hover:scale-105 disabled:opacity-20 shadow-ramos-red/30 border border-ramos-red/20"
                )}
              >
                <span>Publish Post</span>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
