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
  ShieldOff,
  MessageSquare,
  UserX
} from 'lucide-react';
import { UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  allUsers: UserProfile[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUnblockUser: (uid: string) => void;
  onLogout: () => void;
  initialSection?: 'general' | 'security' | 'blocked';
  onUpdateSubscription?: (key: any, val: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  profile, 
  allUsers, 
  onUpdateProfile, 
  onUnblockUser, 
  onLogout,
  initialSection = 'general'
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'blocked'>(initialSection as any);
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

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic text-orange-700">Personal Space</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-black text-orange-700 uppercase tracking-widest hover:text-orange-700 transition-colors"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-sm focus:ring-2 focus:ring-orange-700 outline-none min-h-[120px] resize-none"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-slate-900 text-sm focus:ring-2 focus:ring-orange-700 outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-2xl bg-orange-700 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-700/20 flex items-center justify-center space-x-2"
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
                <p className="text-slate-600 leading-relaxed font-medium">
                  {profile.bio || "Student at NST - Join the conversation!"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="w-4 h-4 text-orange-700" />
                    <span className="text-sm text-slate-600 truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Phone className="w-4 h-4 text-orange-700" />
                    <span className="text-sm text-slate-600 truncate">{profile.phone || "No phone added"}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-black text-slate-900 uppercase italic">On-Campus</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</p>
                <p className="text-sm font-black text-slate-900 uppercase italic">Student</p>
              </div>
            </div>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic mb-2">Privacy Settings</h3>
              <p className="text-slate-500 text-sm font-medium">Control your visibility in the campus directory</p>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'showEmail', label: 'Display Email', icon: Mail },
                { key: 'showPhone', label: 'Display Phone', icon: Phone },
                { key: 'allowDirectMessages', label: 'Allow Direct Messages', icon: MessageSquare }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-600 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors shadow-sm">
                      <setting.icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{setting.label}</span>
                  </div>
                  <button 
                    onClick={() => updatePrivacy(setting.key as any)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      (profile.privacySettings as any)?.[setting.key] ? "bg-orange-700" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      (profile.privacySettings as any)?.[setting.key] ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'blocked':
        return (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-[40px] p-8 space-y-6 shadow-sm"
          >
            <div className="mb-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
                <UserX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic mb-2">Campus Shield</h3>
              <p className="text-slate-500 text-sm font-medium">Manage blocked students and restricted connections</p>
            </div>

            {blockedUsers.length > 0 ? (
              <div className="space-y-4">
                {blockedUsers.map((u) => (
                  <div key={u.uid} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 overflow-hidden">
                        {u.photoURL ? <img src={u.photoURL} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-orange-700">{(u.displayName || 'U')[0]}</div>}
                      </div>
                      <span className="font-bold text-slate-900">{u.displayName}</span>
                    </div>
                    <button 
                      onClick={() => onUnblockUser(u.uid)}
                      className="px-4 py-2 bg-white text-orange-700 border border-orange-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-all"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">Shield Empty - All Clear</p>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4 overflow-hidden">
      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-48 w-full rounded-[40px] bg-gradient-to-br from-orange-700/10 via-orange-600/10 to-orange-400/10 border border-slate-200" />
        
        <div className="absolute -bottom-8 left-4 right-4 sm:left-10 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-700 to-orange-600 border-4 border-white p-1 shadow-2xl overflow-hidden">
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-full h-full object-cover rounded-[36px]" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-white text-orange-700 shadow-lg hover:scale-110 transition-all border border-slate-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="pb-4 text-center sm:text-left min-w-0 flex-1 w-full">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 truncate italic">{profile.displayName}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-slate-500 text-sm font-medium break-all max-w-full">{profile.email}</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-widest">
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
            {renderSection()}
          </AnimatePresence>
        </div>

        {/* Sidebar Nav */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-[40px] p-4 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Navigation</p>
              
              <button 
                onClick={() => setActiveSection('general')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-3xl transition-all mb-2",
                  activeSection === 'general' ? "bg-orange-700 text-white shadow-lg shadow-orange-700/20" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-black">Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button 
                onClick={() => setActiveSection('security')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-3xl transition-all mb-2",
                  activeSection === 'security' ? "bg-orange-700 text-white shadow-lg shadow-orange-700/20" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-black">Security</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button 
                onClick={() => setActiveSection('blocked')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-3xl transition-all",
                  activeSection === 'blocked' ? "bg-orange-700 text-white shadow-lg shadow-orange-700/20" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <UserX className="w-4 h-4" />
                  <span className="text-sm font-black">Blocked</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-5 rounded-[40px] bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;