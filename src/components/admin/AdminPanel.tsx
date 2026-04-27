import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Search,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { StudentQuery, BlinkitRequest, UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  queries: StudentQuery[];
  blinkitRequests: BlinkitRequest[];
  users: UserProfile[];
  buddyPosts: any[];
  onDeleteQuery: (id: string) => void;
  onDeleteBlinkit: (id: string) => void;
  onDeleteBuddy: (id: string) => void;
  onResolveQuery: (id: string) => void;
  onDeleteUser: (uid: string) => void;
  onRestoreMocks: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  queries, 
  blinkitRequests, 
  users,
  buddyPosts,
  onDeleteQuery, 
  onDeleteBlinkit,
  onDeleteBuddy,
  onResolveQuery,
  onDeleteUser,
  onRestoreMocks
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'queries' | 'blinkit' | 'users' | 'buddy'>('queries');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure check. 
    // For this demo, we'll use a simple password.
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-[40px] p-10 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-[32px] bg-orange-50 flex items-center justify-center text-orange-500 mx-auto mb-8">
            <Shield className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tighter italic">Admin Access</h2>
          <p className="text-slate-400 text-center text-sm mb-10 font-medium">Restricted area. Please enter credentials.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-14 text-slate-900 placeholder:text-slate-300 focus:border-orange-500/50 transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold ml-4 uppercase tracking-wider">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
            >
              AUTHENTICATE
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Control Center</h2>
          <p className="text-slate-400 text-sm font-medium">Manage campus activity and maintain community standards.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={onRestoreMocks}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restore All Mocks</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'queries', icon: MessageSquare, label: 'Queries' },
              { id: 'blinkit', icon: ShoppingBag, label: 'Blinkit' },
              { id: 'buddy', icon: Users, label: 'Buddies' },
              { id: 'users', icon: Users, label: 'Users' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {activeTab === 'queries' && (
            <motion.div
              key="queries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {queries.map((query) => (
                <div key={query.id} className="bg-white border border-slate-200 rounded-[32px] p-6 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden flex-shrink-0">
                      {query.authorPhoto ? <img src={query.authorPhoto} alt="" className="w-full h-full object-cover" /> : query.authorName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{query.authorName}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          query.status === 'resolved' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                        )}>
                          {query.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{query.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {query.status !== 'resolved' && (
                      <button 
                        onClick={() => onResolveQuery(query.id)}
                        className="p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteQuery(query.id)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'blinkit' && (
            <motion.div
              key="blinkit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {blinkitRequests.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-[32px] p-6 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{req.authorName}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          req.status === 'active' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                        )}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{req.itemDescription}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteBlinkit(req.id)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'buddy' && (
            <motion.div
              key="buddy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {buddyPosts.map((post) => (
                <div key={post.id} className="bg-white border border-slate-200 rounded-[32px] p-6 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[8px] font-black uppercase tracking-widest">
                          {post.category || 'Buddy'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{post.title}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteBuddy(post.id)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
              {buddyPosts.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No buddy requests found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {users.map((u) => (
                <div key={u.uid} className="bg-white border border-slate-200 rounded-[32px] p-6 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden flex-shrink-0">
                      {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : u.displayName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{u.displayName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                          Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{u.email}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteUser(u.uid)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
