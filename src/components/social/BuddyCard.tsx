import React, { useState } from 'react';
import { BuddyPost, UserProfile } from '../../types';
import { Users, MessageCircle, MapPin, Calendar, Clock, Trash2, Shield, AlertCircle, Plus, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ensureMillis } from '../../lib/utils';

interface BuddyCardProps {
  post: BuddyPost;
  onConnect: (id: string) => void;
  onLeave: (id: string) => void;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  onSendMessage: (id: string, content: string) => void;
  onExtend?: (id: string, mins: number) => void;
  currentUserId: string;
  allUsers: UserProfile[];
}

const BuddyCard: React.FC<BuddyCardProps> = ({
  post,
  onConnect,
  onLeave,
  onClose,
  onDelete,
  onSendMessage,
  onExtend,
  currentUserId,
  allUsers
}) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [extendMins, setExtendMins] = useState(15);
  const [isClosing, setIsClosing] = useState(false);
  
  const isJoined = post.joinedUids?.includes(currentUserId);
  const isCreator = currentUserId === post.authorUid;
  const isExpired = post.status !== 'active';
  const [graceTimeLeft, setGraceTimeLeft] = useState<number | null>(null);

  const canExtend = isCreator && isExpired && !!onExtend && graceTimeLeft !== null;

  React.useEffect(() => {
    if (isExpired && isCreator) {
      const updateGrace = () => {
        const now = Date.now();
        const baseTime = post.closedAt ? ensureMillis(post.closedAt) : ensureMillis(post.expiresAt);
        const elapsed = now - baseTime;
        
        // Only show if we are within 60s AFTER baseTime
        const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
        
        if (remaining <= 0 || elapsed < -1000) {
          setGraceTimeLeft(null);
        } else {
          setGraceTimeLeft(remaining);
        }
      };
      updateGrace();
      const interval = setInterval(updateGrace, 1000);
      return () => clearInterval(interval);
    } else {
      setGraceTimeLeft(null);
    }
  }, [isExpired, isCreator, post.expiresAt, post.closedAt]);

  return (
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden rounded-[56px] p-10 mb-10 border transition-all duration-1000 group",
        isExpired 
          ? "bg-ramos-gray/40 border-ramos-black/5 opacity-40 grayscale" 
          : "bg-white border-ramos-black/5 shadow-2xl shadow-ramos-black/5 hover:border-ramos-red/20"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center space-x-5">
            <div className={cn(
              "w-20 h-20 rounded-[32px] flex items-center justify-center border transition-all duration-500 overflow-hidden shadow-2xl shadow-ramos-black/5",
              isExpired ? "bg-white border-ramos-black/5" : "bg-ramos-gray border-ramos-black/5 group-hover:scale-105"
            )}>
              {post.authorPhoto ? (
                <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ramos-black text-white font-bold text-2xl">
                   {post.authorName?.[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h4 className={cn("text-xl font-bold tracking-tight", isExpired ? "text-ramos-black/40" : "text-ramos-black")}>{post.authorName}</h4>
                <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ramos-black/20">
                  {formatDistanceToNow(ensureMillis(post.createdAt))} ago
                </span>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">{post.category}</span>
                 {isExpired && <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ramos-black/20 bg-ramos-black/5 px-2 py-1 rounded-full border border-ramos-black/5">Archived</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             {(isJoined || isCreator) && !isExpired && post.allowDMs && (
               <button 
                 onClick={() => setIsMessaging(!isMessaging)}
                 className={cn(
                   "p-5 rounded-[24px] transition-all border group/msg",
                   isMessaging 
                    ? "bg-ramos-black text-white border-ramos-black shadow-2xl shadow-ramos-black/40" 
                    : "bg-ramos-gray text-ramos-black/20 border-transparent hover:text-ramos-black hover:bg-ramos-gray/80"
                 )}
               >
                 <MessageCircle className={cn("w-6 h-6 transition-transform group-hover/msg:scale-110", isMessaging ? "text-ramos-red" : "")} />
               </button>
             )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className={cn("text-3xl font-bold tracking-tight mb-5 leading-tight", isExpired ? "text-ramos-black/40" : "text-ramos-black group-hover:text-ramos-red transition-colors")}>{post.title}</h3>
          <div className={cn(
            "rounded-[40px] p-8 border transition-all duration-500",
            isExpired ? "bg-white/50 border-ramos-black/5" : "bg-ramos-gray/30 border-transparent group-hover:bg-ramos-gray/50"
          )}>
            <p className={cn("text-lg font-bold leading-relaxed tracking-tight", isExpired ? "text-ramos-black/30" : "text-ramos-black/60")}>
              {post.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className={cn(
            "flex items-center space-x-5 rounded-[32px] p-6 border transition-all",
            isExpired ? "bg-white border-ramos-black/5" : "bg-ramos-gray/50 border-transparent"
          )}>
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-ramos-black/5 text-ramos-red shadow-sm group-hover:scale-105 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-ramos-black/20 uppercase tracking-[0.3em] mb-1.5">Primary Venue</span>
              <span className={cn("text-sm font-bold truncate uppercase tracking-tight", isExpired ? "text-ramos-black/30" : "text-ramos-black/70")}>{post.location || post.category}</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center space-x-5 rounded-[32px] p-6 border transition-all",
            isExpired ? "bg-white border-ramos-black/5" : "bg-ramos-gray/50 border-transparent"
          )}>
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-ramos-black/5 text-ramos-red shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-ramos-black/20 uppercase tracking-[0.3em] mb-1.5">Engagement Schedule</span>
              <span className={cn("text-sm font-bold truncate tracking-tight", isExpired ? "text-ramos-black/30" : "text-ramos-black/70")}>{post.date || 'Flexible'}</span>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center space-x-3 ml-2">
            <div className="w-1 h-1 rounded-full bg-ramos-red" />
            <p className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em]">Network Entities</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Host */}
            <div className={cn(
              "flex items-center space-x-4 rounded-[28px] px-6 py-3 border transition-all shadow-xl shadow-ramos-black/5",
              isExpired ? "bg-white border-ramos-black/5" : "bg-ramos-red/5 border-ramos-red/10"
            )}>
              <div className="w-8 h-8 rounded-xl bg-ramos-red flex items-center justify-center text-[10px] font-black text-white overflow-hidden shadow-2xl shadow-ramos-red/40">
                {post.authorPhoto ? (
                  <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="leading-none">{post.authorName?.[0]}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={cn("text-sm font-bold tracking-tight leading-none", isExpired ? "text-ramos-black/40" : "text-ramos-black")}>{post.authorName}</span>
                <span className="text-[8px] font-black text-ramos-red uppercase tracking-widest mt-1">Host Entity</span>
              </div>
            </div>

            {/* Others */}
            {post.joinedUids?.filter(uid => uid !== post.authorUid).map((uid) => {
               const p = allUsers.find(u => u.uid === uid);
               if (!p) return null;
               return (
                 <div key={uid} className={cn(
                    "flex items-center space-x-4 rounded-[28px] px-6 py-3 border transition-all shadow-xl shadow-ramos-black/5",
                    isExpired ? "bg-white border-ramos-black/5" : "bg-ramos-gray/40 border-ramos-black/5"
                 )}>
                   <div className="w-8 h-8 rounded-xl bg-ramos-black flex items-center justify-center text-[10px] font-black text-white overflow-hidden shadow-2xl shadow-ramos-black/10">
                     {p.photoURL ? (
                       <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                     ) : (
                       <span className="leading-none">{p.displayName?.[0]}</span>
                     )}
                   </div>
                   <div className="flex flex-col">
                     <span className={cn("text-sm font-bold tracking-tight leading-none", isExpired ? "text-ramos-black/30" : "text-ramos-black/60")}>{p.displayName}</span>
                     <span className="text-[8px] font-black text-ramos-black/20 uppercase tracking-widest mt-1">Subscriber</span>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        <AnimatePresence>
          {isMessaging && (isJoined || isCreator) && !isExpired && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="mb-12 bg-ramos-gray/40 border border-ramos-black/5 rounded-[48px] p-10 shadow-inner"
            >
              <div className="max-h-80 overflow-y-auto mb-8 space-y-6 pr-4 no-scrollbar">
                {post.messages && post.messages.length > 0 ? (
                  post.messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col",
                      msg.senderUid === currentUserId ? "items-end" : "items-start"
                    )}>
                      <div className="flex items-center space-x-3 mb-2 px-2">
                        <span className="text-[9px] font-black text-ramos-black/30 uppercase tracking-[0.2em]">{msg.senderName}</span>
                        <div className="w-1 h-1 rounded-full bg-ramos-black/10" />
                        <span className="text-[8px] text-ramos-black/20 font-black uppercase tracking-widest">{formatDistanceToNow(ensureMillis(msg.createdAt))}</span>
                      </div>
                      <div className={cn(
                        "px-8 py-5 rounded-[32px] text-sm font-bold max-w-[85%] shadow-2xl tracking-tight leading-relaxed",
                        msg.senderUid === currentUserId 
                          ? "bg-ramos-black text-white rounded-tr-none shadow-ramos-black/20" 
                          : "bg-white text-ramos-black rounded-tl-none border border-ramos-black/5 shadow-ramos-black/5"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-[24px] bg-white border border-ramos-black/5 flex items-center justify-center text-ramos-black/10 mx-auto mb-4">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em]">Secure Channel Active</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <input 
                  type="text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Draft encrypted message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && messageContent.trim()) {
                      onSendMessage(post.id, messageContent);
                      setMessageContent('');
                    }
                  }}
                  className="flex-1 bg-white border border-ramos-black/5 rounded-[28px] py-6 px-10 text-sm font-bold text-ramos-black placeholder:text-ramos-black/20 transition-all outline-none focus:border-ramos-red/20 focus:shadow-2xl focus:shadow-ramos-red/5"
                />
                <button 
                  onClick={() => {
                    if (messageContent.trim()) {
                      onSendMessage(post.id, messageContent);
                      setMessageContent('');
                    }
                  }}
                  className="p-6 rounded-[28px] bg-ramos-black text-white shadow-2xl shadow-ramos-black/40 hover:bg-ramos-red hover:scale-105 active:scale-95 transition-all group"
                >
                  <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between pt-10 border-t border-ramos-black/5 gap-6">
          <div className={cn(
            "flex items-center space-x-4 px-6 py-3 rounded-full border transition-all w-fit",
            isExpired ? "bg-white border-ramos-black/5 text-ramos-black/20" : "bg-ramos-gray/60 border-ramos-black/5 text-ramos-black/40"
          )}>
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{post.joinedUids?.length || 1} Entities Connected</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {isCreator ? (
              <div className="flex items-center gap-4 w-full md:w-auto">
                {!isExpired && (
                  <button 
                    disabled={isClosing}
                    onClick={async () => {
                      setIsClosing(true);
                      try {
                        await onClose(post.id);
                      } finally {
                        setIsClosing(false);
                      }
                    }}
                    className={cn(
                      "px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                      isClosing 
                        ? "bg-white text-ramos-black/10 border-ramos-black/5 cursor-wait" 
                        : "bg-ramos-gray text-ramos-black/40 border-transparent hover:bg-ramos-black hover:text-white"
                    )}
                  >
                    {isClosing ? 'Closing Request...' : 'Close Request'}
                  </button>
                )}
                {canExtend && (
                  <div className="flex items-center space-x-3 bg-ramos-black p-2 rounded-[24px] shadow-2xl shadow-ramos-black/20">
                    <input 
                      type="number" 
                      value={extendMins}
                      onChange={(e) => setExtendMins(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 bg-transparent text-center text-xs font-black text-white outline-none"
                    />
                    <button 
                      onClick={() => onExtend(post.id, extendMins)}
                      className="px-6 py-3 rounded-[20px] bg-ramos-red text-white text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-ramos-red/20"
                    >
                      Extend {graceTimeLeft !== null && `(${graceTimeLeft}s)`}
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => onDelete(post.id)}
                  className="flex items-center space-x-3 px-8 py-4 rounded-[24px] bg-ramos-red/5 text-ramos-red text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ramos-red hover:text-white transition-all border border-ramos-red/10 active:scale-95 shadow-xl shadow-ramos-red/5"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            ) : (
              !isExpired && (
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {isJoined && (
                    <button 
                      onClick={() => onLeave(post.id)}
                      className="px-8 py-5 rounded-[28px] bg-ramos-red/10 text-ramos-red text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ramos-red hover:text-white transition-all border border-ramos-red/20 active:scale-95 shadow-xl shadow-ramos-red/5"
                    >
                      Leave Buddy Group
                    </button>
                  )}
                  <button 
                    onClick={() => !isJoined && onConnect(post.id)}
                    disabled={isJoined}
                    className={cn(
                      "flex items-center space-x-5 px-12 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700",
                      isJoined 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" 
                        : "bg-ramos-black text-white hover:bg-ramos-red hover:scale-105 active:scale-95 shadow-2xl shadow-ramos-black/40"
                    )}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-6 h-6" />
                        <span>Join Buddy Group</span>
                      </>
                    )}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BuddyCard;
