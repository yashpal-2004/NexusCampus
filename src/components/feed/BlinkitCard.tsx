import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Timer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Trash2,
  User,
  MessageCircle,
  Send,
  Plus,
  RotateCcw
} from 'lucide-react';
import { BlinkitRequest, BlinkitMessage } from '../../types';
import { cn, ensureMillis } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface BlinkitCardProps {
  request: BlinkitRequest;
  onJoin: (id: string) => void;
  onLeave?: (id: string) => void;
  onClose?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExtend?: (id: string, mins: number) => void;
  onSendMessage?: (id: string, content: string) => void;
  onRemoveParticipant?: (requestId: string, participantUid: string) => void;
  onBlockParticipant?: (participantUid: string) => void;
  currentUserId?: string;
  showExtend?: boolean;
}

const BlinkitCard: React.FC<BlinkitCardProps> = ({ 
  request, 
  onJoin, 
  onLeave,
  onClose, 
  onDelete, 
  onExtend,
  onSendMessage,
  onRemoveParticipant,
  onBlockParticipant,
  currentUserId,
  showExtend = false
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [extendMins, setExtendMins] = useState<number>(10);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const isJoined = currentUserId && request.joinedUids.includes(currentUserId);
  const isExpired = timeLeft <= 0 || request.status !== 'active';
  const isCreator = currentUserId === request.authorUid;
  const canSeeParticipants = !isExpired || isCreator || isJoined;
  const canMessage = (isJoined || isCreator) && !isExpired;
  
  const [graceTimeLeft, setGraceTimeLeft] = useState<number | null>(null);

  // Only allow extension for 1 minute after expiration or closure
  const canExtend = isCreator && isExpired && showExtend && (
    (request.closedAt ? (Date.now() - ensureMillis(request.closedAt) < 60000) : (Date.now() - ensureMillis(request.expiresAt) < 60000))
  );

  useEffect(() => {
    if (isExpired && isCreator) {
      const updateGrace = () => {
        const now = Date.now();
        const baseTime = request.closedAt ? ensureMillis(request.closedAt) : ensureMillis(request.expiresAt);
        const elapsed = now - baseTime;
        
        // Only show if we are within 60s AFTER baseTime
        const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
        
        if (remaining <= 0 || elapsed < -1000) { // small buffer for minor sync issues
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
  }, [isExpired, isCreator, request.expiresAt]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, request.expiresAt - now);
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [request.expiresAt]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (timeLeft / (request.windowMinutes * 60 * 1000)) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-[40px] p-8 mb-8 border transition-all duration-700",
        isExpired 
          ? "bg-ramos-gray border-ramos-black/5 opacity-60" 
          : "bg-ramos-black border-white/5 shadow-2xl shadow-ramos-black/20"
      )}
    >
      <div className={cn("relative z-10 transition-all duration-500", isExpired && "grayscale")}>
        {/* Progress Bar Background */}
        {!isExpired && (
          <div className="absolute -top-8 -left-8 -right-8 h-1 bg-white/5">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-ramos-red shadow-[0_0_20px_rgba(254,74,73,0.5)]"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-16 h-16 rounded-[24px] flex items-center justify-center border transition-colors",
              isExpired ? "bg-white border-ramos-black/5 text-ramos-black/20" : "bg-white/5 border-white/10 text-white"
            )}>
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className={cn("text-2xl font-bold tracking-tight leading-tight", isExpired ? "text-ramos-black" : "text-white")}>
                Shared Order
              </h3>
              <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isExpired ? "text-ramos-black/20" : "text-white/40")}>
                {request.authorName} is ordering
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isCreator && (
              <div className="flex items-center space-x-2">
                {!isExpired && (
                  <button 
                    onClick={() => onClose?.(request.id)}
                    className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-ramos-red hover:bg-white/10 transition-all border border-white/10"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => onDelete?.(request.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-ramos-red/10 text-ramos-red text-[10px] font-black uppercase tracking-widest hover:bg-ramos-red hover:text-white transition-all border border-ramos-red/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
            <div className={cn(
              "flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase border",
              isExpired 
                ? "bg-white border-ramos-black/5 text-ramos-black/20" 
                : "bg-ramos-red border-ramos-red/20 text-white shadow-xl shadow-ramos-red/20 animate-pulse"
            )}>
              <Timer className="w-4 h-4" />
              <span>{isExpired ? "CLOSED" : formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "rounded-[32px] p-6 mb-8 border backdrop-blur-sm transition-colors",
          isExpired ? "bg-white border-ramos-black/5" : "bg-white/5 border-white/10"
        )}>
          <p className={cn("text-lg font-medium tracking-tight italic", isExpired ? "text-ramos-black/40" : "text-white/80")}>
            "{request.itemDescription}"
          </p>
        </div>

        {/* Participants List */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isExpired ? "text-ramos-black/20" : "text-white/30")}>Participants</p>
            {canMessage && (
              <button 
                onClick={() => setIsMessaging(!isMessaging)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  isMessaging 
                    ? "bg-white text-ramos-black border-white" 
                    : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isMessaging ? 'Close Chat' : 'Order Chat'}</span>
              </button>
            )}
          </div>
          
          {canSeeParticipants ? (
            <div className="flex flex-wrap gap-3">
              {request.participants?.map((p) => (
                <div key={p.uid} className={cn(
                  "flex items-center space-x-3 rounded-2xl px-4 py-2 border transition-all group",
                  isExpired ? "bg-white border-ramos-black/5" : "bg-white/5 border-white/10"
                )}>
                  <div className="w-6 h-6 rounded-lg bg-ramos-gray flex items-center justify-center text-[10px] font-black text-ramos-black overflow-hidden border border-ramos-black/5">
                    {p.photoURL ? (
                      <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                  </div>
                  <span className={cn("text-xs font-bold tracking-tight", isExpired ? "text-ramos-black/60" : "text-white/60 group-hover:text-white")}>{p.displayName}</span>
                  
                  {isCreator && p.uid !== currentUserId && (
                    <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onRemoveParticipant?.(request.id, p.uid)}
                        className="p-1.5 rounded-lg hover:bg-ramos-red text-white/20 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onBlockParticipant?.(p.uid)}
                        className="p-1.5 rounded-lg hover:bg-white text-white/20 hover:text-ramos-black transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-6 border border-dashed border-white/10 flex items-center justify-center space-x-3">
              <Users className="w-5 h-5 text-white/20" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Team intelligence encrypted</span>
            </div>
          )}
        </div>

        {/* Messaging Section */}
        <AnimatePresence>
          {isMessaging && canMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-10 bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md"
            >
              <div className="max-h-60 overflow-y-auto mb-6 space-y-4 pr-4 custom-scrollbar">
                {request.messages && request.messages.length > 0 ? (
                  request.messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col",
                      msg.senderUid === currentUserId ? "items-end" : "items-start"
                    )}>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-wider">{msg.senderName}</span>
                        <span className="text-[8px] text-white/10 font-bold">• {formatDistanceToNow(ensureMillis(msg.createdAt))} ago</span>
                      </div>
                      <div className={cn(
                        "px-5 py-3 rounded-[20px] text-sm max-w-[85%] font-medium tracking-tight",
                        msg.senderUid === currentUserId 
                          ? "bg-ramos-red text-white rounded-tr-none shadow-lg shadow-ramos-red/20" 
                          : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Secure Chat Initialized</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Transmit message..."
                  onKeyDown={(e) => e.key === 'Enter' && messageContent.trim() && (onSendMessage?.(request.id, messageContent), setMessageContent(''))}
                  className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 focus:bg-white/20 transition-all outline-none"
                />
                <button 
                  onClick={() => {
                    if (messageContent.trim()) {
                      onSendMessage?.(request.id, messageContent);
                      setMessageContent('');
                    }
                  }}
                  disabled={!messageContent.trim()}
                  className="p-4 rounded-2xl bg-white text-ramos-black disabled:opacity-30 hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full border transition-all",
              isExpired ? "bg-white border-ramos-black/5 text-ramos-black/30" : "bg-white/5 border-white/10 text-white/40"
            )}>
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {request.joinedUids.length} Joined
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {canExtend && (
              <div className="flex items-center space-x-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <input 
                  type="number" 
                  value={extendMins}
                  onChange={(e) => setExtendMins(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-transparent text-center text-xs font-black text-white outline-none"
                />
                <button
                  onClick={() => onExtend?.(request.id, extendMins)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-black text-[10px] bg-white text-ramos-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Extend {graceTimeLeft !== null && `(${graceTimeLeft}s)`}</span>
                </button>
              </div>
            )}
            
            {isJoined && !isCreator && !isExpired && (
              <button
                onClick={async () => {
                  setIsLeaving(true);
                  try {
                    await onLeave?.(request.id);
                  } finally {
                    setIsLeaving(false);
                  }
                }}
                className="flex items-center space-x-3 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] bg-ramos-red/10 text-ramos-red border border-ramos-red/20 hover:bg-ramos-red hover:text-white transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isLeaving ? "Revoking..." : "Revoke"}</span>
              </button>
            )}

            {(!isJoined || isCreator) && (
              <button
                disabled={isExpired || isJoined || isJoining || isCreator}
                onClick={async () => {
                  if (isCreator) return;
                  setIsJoining(true);
                  try {
                    await onJoin(request.id);
                  } finally {
                    setIsJoining(false);
                  }
                }}
                className={cn(
                  "flex items-center space-x-3 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500",
                  (isJoined || isCreator)
                    ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                    : isExpired
                      ? "bg-white/5 text-white/10 cursor-not-allowed border-transparent"
                      : "bg-ramos-red text-white hover:scale-105 active:scale-95 shadow-2xl shadow-ramos-red/40 border border-ramos-red/20"
                )}
              >
                {isJoining ? (
                  <span className="animate-pulse">Joining...</span>
                ) : (isJoined || isCreator) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCreator ? "Own Order" : "Joined"}</span>
                  </>
                ) : isExpired ? (
                  <span>Order Closed</span>
                ) : (
                  <>
                    <span>Join Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlinkitCard;
