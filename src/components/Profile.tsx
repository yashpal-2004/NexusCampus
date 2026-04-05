import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Mail,
  Phone,
  Camera,
  LogOut,
  ChevronRight,
  Check,
  UserX,
  ShieldOff
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  allUsers: UserProfile[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUnblockUser: (uid: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, allUsers, onUpdateProfile, onUnblockUser, onLogout }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'preferences' | 'security' | 'blocked'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    phone: profile.phone || '',
  });

  const blockedUsers = allUsers.filter(u => profile.blockedUids?.includes(u.uid));

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const updatePrivacy = (key: keyof NonNullable<UserProfile['privacySettings']>) => {
    const currentSettings = profile.privacySettings || {
      showEmail: true,
      showPhone: false,
      allowDirectMessages: true
    };
    const newSettings = {
      ...currentSettings,
      [key]: !currentSettings[key]
    };
    onUpdateProfile({ privacySettings: newSettings });
  };

  const updateSubscription = (key: keyof NonNullable<UserProfile['subscriptions']>) => {
    const currentSubs = profile.subscriptions || {
      gym: true,
      foodCourt: true,
      laundry: true,
      system: true,
      queries: true,
      replies: true,
      blinkit: true,
      buddy: true,
    };
    const newSubs = {
      ...currentSubs,
      [key]: !currentSubs[key]
    };
    onUpdateProfile({ subscriptions: newSubs });
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4 overflow-hidden">
      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-48 w-full rounded-[40px] bg-gradient-to-br from-orange-600/10 via-orange-500/10 to-orange-400/10 border border-slate-200" />
        
        <div className="absolute -bottom-8 left-4 right-4 sm:left-10 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-600 to-orange-500 border-4 border-white p-1 shadow-2xl overflow-hidden">
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-full h-full object-cover rounded-[36px]" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-white text-orange-600 shadow-lg hover:scale-110 transition-all border border-slate-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="pb-4 text-center sm:text-left min-w-0 flex-1 w-full">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 truncate italic">{profile.displayName}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-slate-500 text-sm font-medium break-all max-w-full">{profile.email}</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                Student
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24 sm:mt-16">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeSection === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic">About Me</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio</label>
                      <textarea 
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-sm focus:ring-2 focus:ring-orange-600 outline-none min-h-[120px] resize-none"
                        placeholder="Tell the campus about yourself..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-slate-900 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleSave}
                        className="flex-1 py-4 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed break-words">
                      {profile.bio || "No bio added yet. Click edit to tell us about yourself!"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden w-full">
                        <Mail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <span className="text-sm text-slate-600 break-all">{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden w-full">
                          <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-sm text-slate-600 break-all">{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
              >
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Choose which campus updates you want to receive notifications for.</p>
                
                <div className="space-y-4">
                  {[
                    { key: 'gym', label: 'Gym Updates', desc: 'Crowd alerts and slot availability' },
                    { key: 'foodCourt', label: 'Food Court', desc: 'New menus and special offers' },
                    { key: 'laundry', label: 'Laundry', desc: 'Machine availability and status' },
                    { key: 'system', label: 'System Alerts', desc: 'Important campus announcements' },
                    { key: 'queries', label: 'New Queries', desc: 'Get notified when someone asks a new query' },
                    { key: 'replies', label: 'Query Replies', desc: 'Get notified when someone replies to your query' },
                    { key: 'blinkit', label: 'Blinkit Requests', desc: 'New shared order opportunities' },
                    { key: 'buddy', label: 'Buddy Finder', desc: 'New buddy requests and matches' },
                  ].map((sub) => (
                    <div key={sub.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-sm font-black text-slate-900 truncate">{sub.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{sub.desc}</p>
                      </div>
                      <button 
                        onClick={() => updateSubscription(sub.key as keyof NonNullable<UserProfile['subscriptions']>)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative flex-shrink-0",
                          profile.subscriptions?.[sub.key as keyof NonNullable<UserProfile['subscriptions']>] ? "bg-orange-600" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: profile.subscriptions?.[sub.key as keyof NonNullable<UserProfile['subscriptions']>] ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
              >
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Privacy & Security</h3>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Show Email', 
                      desc: 'Allow others to see your email address',
                      key: 'showEmail'
                    },
                    { 
                      label: 'Show Phone', 
                      desc: 'Allow others to see your phone number',
                      key: 'showPhone'
                    },
                    { 
                      label: 'Allow DMs', 
                      desc: 'Allow others to send you direct messages',
                      key: 'allowDirectMessages'
                    }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-sm font-black text-slate-900 truncate">{setting.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{setting.desc}</p>
                      </div>
                      <button 
                        onClick={() => updatePrivacy(setting.key as keyof NonNullable<UserProfile['privacySettings']>)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative flex-shrink-0",
                          profile.privacySettings?.[setting.key as keyof NonNullable<UserProfile['privacySettings']>] ? "bg-orange-600" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: profile.privacySettings?.[setting.key as keyof NonNullable<UserProfile['privacySettings']>] ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Danger Zone</h4>
                  <button className="w-full p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all text-left">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'blocked' && (
              <motion.div
                key="blocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
              >
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Blocked Users</h3>
                <p className="text-sm text-slate-500">Users you have blocked will not be able to see your Blinkit requests.</p>
                
                <div className="space-y-4">
                  {blockedUsers.length > 0 ? (
                    blockedUsers.map((u) => (
                      <div key={u.uid} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                            {u.photoURL ? (
                              <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                {u.displayName[0]}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{u.displayName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{u.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => onUnblockUser(u.uid)}
                          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex-shrink-0"
                        >
                          Unblock
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <UserX className="w-8 h-8" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">No blocked users yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Navigation */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Settings</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveSection('general')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                  activeSection === 'general' 
                    ? "bg-orange-600 border-orange-600 text-white" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <User className={cn("w-4 h-4", activeSection === 'general' ? "text-white" : "text-slate-400")} />
                  <span className="text-sm font-black truncate">General</span>
                </div>
                <ChevronRight className={cn("w-4 h-4", activeSection === 'general' ? "text-white/50" : "text-slate-300")} />
              </button>

              <button 
                onClick={() => setActiveSection('preferences')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                  activeSection === 'preferences' 
                    ? "bg-orange-600 border-orange-600 text-white" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Settings className={cn("w-4 h-4", activeSection === 'preferences' ? "text-white" : "text-slate-400")} />
                  <span className="text-sm font-black truncate">Preferences</span>
                </div>
                <ChevronRight className={cn("w-4 h-4", activeSection === 'preferences' ? "text-white/50" : "text-slate-300")} />
              </button>

              <button 
                onClick={() => setActiveSection('security')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                  activeSection === 'security' 
                    ? "bg-orange-600 border-orange-600 text-white" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Shield className={cn("w-4 h-4", activeSection === 'security' ? "text-white" : "text-slate-400")} />
                  <span className="text-sm font-black truncate">Security</span>
                </div>
                <ChevronRight className={cn("w-4 h-4", activeSection === 'security' ? "text-white/50" : "text-slate-300")} />
              </button>

              <button 
                onClick={() => setActiveSection('blocked')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                  activeSection === 'blocked' 
                    ? "bg-orange-600 border-orange-600 text-white" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <ShieldOff className={cn("w-4 h-4", activeSection === 'blocked' ? "text-white" : "text-slate-400")} />
                  <span className="text-sm font-black truncate">Blocked</span>
                </div>
                <ChevronRight className={cn("w-4 h-4", activeSection === 'blocked' ? "text-white/50" : "text-slate-300")} />
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-all mt-4"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
