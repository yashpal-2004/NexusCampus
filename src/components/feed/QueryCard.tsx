import React, { useState } from 'react';
import { 
  ArrowBigUp, 
  MessageCircle, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Link2,
  Flag,
  Share2,
  EyeOff
} from 'lucide-react';
import { StudentQuery, QueryReply } from '../../types';
import { cn, ensureMillis } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface QueryCardProps {
  query: StudentQuery;
  onUpvote: (id: string) => void;
  onReply: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

const QueryCard: React.FC<QueryCardProps> = ({ query, onUpvote, onReply, onDelete, currentUserId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const hasUpvoted = currentUserId && query.upvotes.includes(currentUserId);
  const voteCount = query.upvotes.length;

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(query.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  if (isHidden) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-ramos-gray rounded-[32px] p-8 mb-6 hover:shadow-xl hover:shadow-ramos-black/5 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="flex items-start space-x-6">
        <div className="w-14 h-14 rounded-2xl bg-ramos-gray flex-shrink-0 flex items-center justify-center text-ramos-black font-bold text-xl overflow-hidden border border-ramos-black/5">
          {query.authorPhoto ? (
            <img src={query.authorPhoto} alt={query.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            query.authorName[0]
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-ramos-black text-base tracking-tight">{query.authorName}</span>
              <span className="text-ramos-black/20 text-xs">•</span>
              <span className="text-ramos-black/40 text-[10px] font-bold uppercase tracking-widest">{formatDistanceToNow(ensureMillis(query.createdAt))} ago</span>
              
              <AnimatePresence>
                {query.status === 'resolved' && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border border-green-100"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resolved</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center space-x-2">
              {onDelete && (
                <button 
                  onClick={() => onDelete(query.id)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-ramos-red/5 text-ramos-red text-[10px] font-black uppercase tracking-widest hover:bg-ramos-red hover:text-white transition-all border border-ramos-red/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isMenuOpen ? "bg-ramos-gray text-ramos-black" : "text-ramos-black/20 hover:text-ramos-black hover:bg-ramos-gray"
                  )}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-ramos-gray rounded-[24px] shadow-2xl z-50 overflow-hidden p-2"
                      >
                        <button 
                          onClick={() => { setIsHidden(true); setIsMenuOpen(false); }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-[10px] font-black text-ramos-black/40 hover:bg-ramos-gray hover:text-ramos-black transition-all uppercase tracking-[0.2em] rounded-xl"
                        >
                          <EyeOff className="w-4 h-4 text-ramos-red" />
                          <span>Hide Post</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <p className="text-ramos-black/70 text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap tracking-tight">
            {query.content}
          </p>
          
          {query.imageUrl && (
            <div className="rounded-[24px] overflow-hidden border border-ramos-gray mb-6 shadow-sm">
              <img 
                src={query.imageUrl} 
                alt="Query attachment" 
                className="w-full h-auto object-cover max-h-[500px]"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-ramos-gray">
            <div className="flex items-center space-x-2 bg-ramos-gray rounded-full p-1 border border-ramos-black/5">
              <button 
                onClick={() => onUpvote(query.id)}
                className={cn(
                  "p-2.5 rounded-full transition-all",
                  hasUpvoted ? "bg-ramos-red text-white shadow-lg shadow-ramos-red/20" : "text-ramos-black/20 hover:text-ramos-black hover:bg-white"
                )}
              >
                <ArrowBigUp className={cn("w-5 h-5", hasUpvoted ? "fill-current" : "")} />
              </button>
              <span className={cn(
                "text-xs font-black px-3 min-w-[3ch] text-center",
                voteCount > 0 ? "text-ramos-black" : "text-ramos-black/20"
              )}>
                {voteCount}
              </span>
            </div>
            
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-full transition-all text-[10px] font-black uppercase tracking-widest",
                isReplying ? "bg-ramos-black text-white" : "bg-ramos-gray text-ramos-black/40 hover:text-ramos-black hover:bg-ramos-gray"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{query.replies?.length || 0} Responses</span>
            </button>
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 space-y-6"
              >
                {/* Replies List */}
                {query.replies && query.replies.length > 0 && (
                  <div className="space-y-4">
                    {query.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-ramos-gray flex-shrink-0 flex items-center justify-center text-xs font-bold text-ramos-black overflow-hidden border border-ramos-black/5">
                          {reply.authorPhoto ? (
                            <img src={reply.authorPhoto} alt={reply.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            reply.authorName[0]
                          )}
                        </div>
                        <div className="flex-1 bg-ramos-gray/30 rounded-2xl p-4 border border-ramos-gray">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-ramos-black uppercase tracking-wider">{reply.authorName}</span>
                            <span className="text-[9px] font-bold text-ramos-black/20">{formatDistanceToNow(ensureMillis(reply.createdAt))} ago</span>
                          </div>
                          <p className="text-sm text-ramos-black/60 font-medium leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex items-center space-x-3 pt-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Contribute to the intelligence hub..."
                      className="w-full bg-ramos-gray border border-transparent rounded-2xl py-4 px-6 text-sm text-ramos-black placeholder:text-ramos-black/20 focus:bg-white focus:border-ramos-red/20 transition-all outline-none font-medium"
                    />
                  </div>
                  <button 
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim()}
                    className="p-4 rounded-2xl bg-ramos-red text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ramos-red/90 transition-all shadow-xl shadow-ramos-red/20 active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryCard;
