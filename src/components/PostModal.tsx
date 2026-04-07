import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  ShoppingBag, 
  Image as ImageIcon, 
  Send, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostQuery: (content: string, imageUrl?: string) => void;
  onPostBlinkit: (item: string, window: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPostQuery, onPostBlinkit }) => {
  const [activeTab, setActiveTab] = useState<'query' | 'blinkit'>('query');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
    } else {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('query')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                    activeTab === 'query' ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>POST QUERY</span>
                </button>
                <button
                  onClick={() => setActiveTab('blinkit')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                    activeTab === 'blinkit' ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BLINKIT REQ</span>
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'query' ? (
                <div className="space-y-6">
                  <textarea
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind, student?"
                    className="w-full bg-transparent text-slate-900 text-xl font-medium placeholder:text-slate-300 border-none focus:ring-0 resize-none min-h-[150px] outline-none"
                  />
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">What are you ordering?</label>
                    <input 
                      autoFocus
                      type="text"
                      value={blinkitItem}
                      onChange={(e) => setBlinkitItem(e.target.value)}
                      placeholder="e.g. 2 Pizzas from Dominos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-lg text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>Order Window (Minutes)</span>
                    </label>
                    <div className="flex space-x-3">
                      {[5, 10, 15, 20].map((min) => (
                        <button
                          key={min}
                          onClick={() => setBlinkitWindow(min)}
                          className={cn(
                            "flex-1 py-3 rounded-2xl text-sm font-bold transition-all",
                            blinkitWindow === min 
                              ? "bg-orange-500 text-white scale-105 shadow-md" 
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
                          )}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Posting to NexusCampus</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={activeTab === 'query' ? !content.trim() : !blinkitItem.trim()}
                className={cn(
                  "flex items-center space-x-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl",
                  "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 shadow-orange-500/20"
                )}
              >
                <span>POST NOW</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
