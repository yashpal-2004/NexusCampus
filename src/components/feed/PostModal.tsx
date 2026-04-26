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
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('query')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                    activeTab === 'query' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>QUERY</span>
                </button>
                <button
                  onClick={() => setActiveTab('blinkit')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                    activeTab === 'blinkit' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BLINKIT</span>
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'query' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <span>What's on your mind?</span>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      autoFocus
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts with the campus..."
                      className="w-full bg-transparent text-slate-900 text-xl font-bold placeholder:text-slate-200 border-none focus:ring-0 resize-none min-h-[150px] outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <span>What are you ordering?</span>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      autoFocus
                      type="text"
                      value={blinkitItem}
                      onChange={(e) => setBlinkitItem(e.target.value)}
                      placeholder="e.g. 2 Pizzas from Dominos"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-lg font-bold text-slate-900 placeholder:text-slate-200 focus:border-orange-500 transition-colors outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>Order Window (Minutes)</span>
                    </label>
                    <div className="flex space-x-2">
                      {[5, 10, 15, 20].map((min) => (
                        <button
                          key={min}
                          onClick={() => setBlinkitWindow(min)}
                          className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black transition-all border",
                            blinkitWindow === min 
                              ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20" 
                              : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
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
                <span className="text-[10px] font-bold uppercase tracking-widest">NexusCampus</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={activeTab === 'query' ? !content.trim() : !blinkitItem.trim()}
                className={cn(
                  "flex items-center space-x-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
                  "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 shadow-orange-500/20"
                )}
              >
                <span>PUBLISH</span>
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
