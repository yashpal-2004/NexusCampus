import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  arrayUnion,
  arrayRemove,
  limit,
  getDocs,
  where
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { 
  UserProfile, 
  StudentQuery, 
  BlinkitRequest, 
  Message, 
  ChatSession, 
  OperationType,
  QueryReply,
  BuddyPost
} from './types';
import { ensureMillis } from './lib/utils';

// Layout & Navigation
import Layout from './components/layout/Layout';
import Sidebar from './components/layout/Sidebar';
import Feed from './components/feed/Feed';
import FoodCourt from './components/features/FoodCourt';
import BuddyFinder from './components/social/BuddyFinder';
import Wellness from './components/features/Wellness';
import Support from './components/features/Support';
import Laundry from './components/features/Laundry';
import Profile from './components/profile/Profile';
import Messaging from './components/social/Messaging';
import MyActivity from './components/profile/MyActivity';
import AdminPanel from './components/admin/AdminPanel';

// Components
import LandingPage from './components/landing/LandingPage';
import Loading from './components/layout/Loading';
import Welcome from './components/auth/Welcome';
import ErrorBoundary from './components/layout/ErrorBoundary';
import PostModal from './components/feed/PostModal';

const MOCK_QUERIES = [
  { 
    id: 'mock_1', 
    authorName: 'Rahul S.', 
    authorPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    content: 'Anyone knows the mess menu for tonight? Heard it was Special Thali!', 
    imageUrl: '/mock/meal.png',
    createdAt: Date.now() - 3600000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
  { 
    id: 'mock_2', 
    authorName: 'Priya K.', 
    authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Is the central library open 24/7 this week for exams? Need a spot for night puller!', 
    imageUrl: '/mock/notes.png',
    createdAt: Date.now() - 7200000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
  { 
    id: 'mock_3', 
    authorName: 'Ishaan M.', 
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'Found a set of keys near the library fountain. DM if yours!', 
    imageUrl: '/mock/keys.png',
    createdAt: Date.now() - 10800000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
  { 
    id: 'mock_4', 
    authorName: 'Sneha P.', 
    authorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Registration for the Tech Fest starts tomorrow! Don\'t miss out.', 
    imageUrl: '/mock/tech.png',
    createdAt: Date.now() - 14400000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
  { 
    id: 'mock_5', 
    authorName: 'Aryan V.', 
    authorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    content: 'Cricket match tonight at the main ground! Be there to support our team.', 
    imageUrl: '/mock/cricket.png',
    createdAt: Date.now() - 18000000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
  { 
    id: 'mock_6', 
    authorName: 'Ananya G.', 
    authorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    content: 'Trying out the new Chai Adda outlet. Best ginger tea on campus!', 
    imageUrl: '/mock/chai.png',
    createdAt: Date.now() - 21600000, 
    upvotes: [], 
    replies: [], 
    status: 'pending' as const 
  },
];

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [globalDeletedMocks, setGlobalDeletedMocks] = useState<string[]>([]);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileSection, setProfileSection] = useState<'general' | 'security' | 'blocked'>('general');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [allBlinkitRequests, setAllBlinkitRequests] = useState<BlinkitRequest[]>([]);
  const [blinkitRequests, setBlinkitRequests] = useState<BlinkitRequest[]>([]);
  const [buddyPosts, setBuddyPosts] = useState<BuddyPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [homeBlinkitRequests, setHomeBlinkitRequests] = useState<BlinkitRequest[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Anonymous Student',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: Date.now(),
            blockedUids: [],
            universitySuffix: firebaseUser.email?.split('@')[1] || '',
            subscriptions: {
              queries: true,
              blinkit: true,
              laundry: true,
              gym: true,
              foodCourt: true,
              buddy: true,
              system: true,
              replies: true
            }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
          setIsNewUser(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFirestoreError = (error: any, operation: OperationType, collection: string) => {
    console.error(`Firestore ${operation} error in ${collection}:`, error);
    if (error?.code !== 'permission-denied') {
       alert(`Action failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Data Listeners
  useEffect(() => {
    if (!user) return;
    
    const qBlinkit = query(collection(db, 'blinkit_requests'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribeBlinkit = onSnapshot(qBlinkit, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlinkitRequest));
      setAllBlinkitRequests(list);
      
      const blinkits = list.filter(d => !d.itemDescription?.includes('BUDD_FLAG:')) as BlinkitRequest[];
      const buddies = list.map(d => {
        if (d.itemDescription?.includes('BUDD_FLAG:')) {
          const parts = d.itemDescription.split('|||');
          if (parts.length < 5) return null;
          return {
            ...d,
            category: parts[1] || 'other',
            title: parts[2] || '',
            allowDMs: parts[3] === 'true',
            location: parts[4] || '',
            date: parts[5] || '',
            description: parts[6] || parts[4] || '',
            closedAt: parts.length >= 8 ? (parseInt(parts[7]) || undefined) : undefined,
            universitySuffix: (d as any).universitySuffix || ''
          } as BuddyPost;
        }
        return null;
      }).filter(Boolean) as BuddyPost[];
      
      setBlinkitRequests(blinkits);
      setBuddyPosts(buddies);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blinkit_requests'));

    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    const qSessions = query(collection(db, 'chat_sessions'), orderBy('updatedAt', 'desc'));
    const unsubscribeSessions = onSnapshot(qSessions, (snapshot) => {
      setChatSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'chat_sessions'));

    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    // Global Config Listener (for mocks etc)
    const unsubscribeConfig = onSnapshot(doc(db, 'system', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        setGlobalDeletedMocks(snapshot.data().deleted_mocks || []);
      } else {
        setGlobalDeletedMocks([]);
      }
    });

    return () => {
      unsubscribeBlinkit();
      unsubscribeMessages();
      unsubscribeSessions();
      unsubscribeUsers();
      unsubscribeConfig();
    };
  }, [user]);

  // Update setQueries logic to use globalDeletedMocks
  useEffect(() => {
    if (!user) return;
    
    const qQueries = query(collection(db, 'queries'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(qQueries, (snapshot) => {
      const realQueries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentQuery));
      const availableMocks = MOCK_QUERIES.filter(m => !globalDeletedMocks.includes(m.id));
      const numMocksNeeded = Math.max(0, 8 - realQueries.length);
      const mocksToShow = availableMocks.slice(0, numMocksNeeded).map(m => ({ ...m, type: 'query' as const, status: 'pending' as const }));
      setQueries([...realQueries, ...mocksToShow] as StudentQuery[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'queries'));

    return unsubscribe;
  }, [user, globalDeletedMocks]);

  useEffect(() => {
    const filter = () => {
      const now = Date.now();
      const filtered = blinkitRequests.filter(r => {
        const isBuddy = r.itemDescription?.includes('BUDD_FLAG:');
        const expireTime = Number(r.expiresAt) || 0;
        const isExpired = r.status !== 'active' || (expireTime <= now);
        return !isBuddy && !isExpired;
      });
      setHomeBlinkitRequests(filtered);
    };

    filter();
    const interval = setInterval(filter, 30000); 
    return () => clearInterval(interval);
  }, [blinkitRequests]);

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoginLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      setLoginError(error.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handlePostQuery = async (content: string, imageUrl?: string) => {
    if (!user) return;
    const newQuery: Omit<StudentQuery, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      content,
      imageUrl,
      upvotes: [],
      downvotes: [],
      status: 'pending',
      createdAt: Date.now(),
      replies: [],
    };
    try {
      await addDoc(collection(db, 'queries'), newQuery);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'queries');
    }
  };

  const handlePostBlinkit = async (item: string, window: number) => {
    if (!user) return;
    const expiresAt = Date.now() + (window * 60 * 1000);
    const newRequest: Omit<BlinkitRequest, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      itemDescription: item,
      windowMinutes: window,
      expiresAt,
      joinedUids: [user.uid],
      participants: [{
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }],
      status: 'active',
      createdAt: Date.now(),
    };
    try {
      await addDoc(collection(db, 'blinkit_requests'), newRequest);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'blinkit_requests');
    }
  };

  const handlePostBuddy = async (category: string, title: string, description: string, window: number, allowDMs: boolean, location: string, date: string) => {
    if (!user) return;
    const expiresAt = Date.now() + (window * 60 * 1000);
    const itemDescription = `BUDD_FLAG:|||${category}|||${title}|||${allowDMs}|||${location}|||${date}|||${description}|||0`;
    
    const newBuddyPost: Omit<BlinkitRequest, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      itemDescription,
      windowMinutes: window,
      expiresAt,
      joinedUids: [user.uid],
      participants: [{ uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }],
      status: 'active',
      createdAt: Date.now(),
      messages: [],
    };

    try {
      await addDoc(collection(db, 'blinkit_requests'), newBuddyPost);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'blinkit_requests (buddy)');
    }
  };

  const handleUpvote = async (id: string) => {
    if (!user) return;
    const qRef = doc(db, 'queries', id);
    try {
      const qSnap = await getDoc(qRef);
      if (qSnap.exists()) {
        const data = qSnap.data() as StudentQuery;
        const hasUpvoted = data.upvotes.includes(user.uid);
        await updateDoc(qRef, {
          upvotes: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `queries/${id}`);
    }
  };

  const handleReply = async (id: string, content: string) => {
    if (!user) return;
    const qRef = doc(db, 'queries', id);
    const newReply: QueryReply = {
      id: Math.random().toString(36).substr(2, 9),
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      content,
      createdAt: Date.now(),
    };
    try {
      await updateDoc(qRef, {
        replies: arrayUnion(newReply)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `queries/${id}`);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (id.startsWith('mock_')) {
      // Do nothing for regular users
      return;
    } else {
      try {
        await deleteDoc(doc(db, 'queries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `queries/${id}`);
      }
    }
  };

  const handleResolveQuery = async (id: string) => {
    try {
      await updateDoc(doc(db, 'queries', id), { status: 'resolved' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `queries/${id}`);
    }
  };

  const handleJoinBlinkit = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const bSnap = await getDoc(bRef);
    if (bSnap.exists()) {
      const data = bSnap.data() as BlinkitRequest;
      if (!data.joinedUids.includes(user.uid) && data.expiresAt > Date.now()) {
        try {
          await updateDoc(bRef, {
            joinedUids: arrayUnion(user.uid),
            participants: arrayUnion({
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
        }
      }
    }
  };

  const handleLeaveBlinkit = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        const newParticipants = data.participants.filter(p => p.uid !== user.uid);
        await updateDoc(bRef, {
          joinedUids: arrayRemove(user.uid),
          participants: newParticipants
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleCloseBlinkit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'blinkit_requests', id), { 
        status: 'completed', 
        closedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleDeleteBlinkit = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blinkit_requests', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blinkit_requests/${id}`);
    }
  };

  const handleExtendBlinkit = async (id: string, extraMinutes: number) => {
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        const newExpiresAt = Date.now() + (extraMinutes * 60 * 1000);
        await updateDoc(bRef, { expiresAt: newExpiresAt, status: 'active' });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleSendBlinkitMessage = async (id: string, content: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      await updateDoc(bRef, {
        messages: arrayUnion({
          id: Math.random().toString(36).substr(2, 9),
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          content,
          createdAt: Date.now(),
        })
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleRemoveBlinkitParticipant = async (requestId: string, participantUid: string) => {
    const bRef = doc(db, 'blinkit_requests', requestId);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        const newParticipants = data.participants.filter(p => p.uid !== participantUid);
        await updateDoc(bRef, {
          joinedUids: arrayRemove(participantUid),
          participants: newParticipants
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${requestId}`);
    }
  };

  const handleBlockBlinkitParticipant = async (participantUid: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        blockedUids: arrayUnion(participantUid)
      });
      setUser({ ...user, blockedUids: [...(user.blockedUids || []), participantUid] });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleSendMessage = async (recipientUid: string, content: string) => {
    if (!user) return;
    const sessionId = [user.uid, recipientUid].sort().join('_');
    const sRef = doc(db, 'chat_sessions', sessionId);
    try {
      await addDoc(collection(db, 'messages'), {
        sessionId,
        senderUid: user.uid,
        recipientUid,
        content,
        createdAt: Date.now()
      });
      await setDoc(sRef, {
        participants: [user.uid, recipientUid],
        lastMessage: content,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'messages');
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setUser({ ...user, ...updates });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleUnblockUser = async (uid: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        blockedUids: arrayRemove(uid)
      });
      setUser({ ...user, blockedUids: (user.blockedUids || []).filter(id => id !== uid) });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleResolveBuddy = async (id: string) => {
    try {
      await updateDoc(doc(db, 'blinkit_requests', id), { status: 'completed' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleDeleteBuddy = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blinkit_requests', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blinkit_requests/${id}`);
    }
  };

  const handleJoinBuddy = async (id: string) => handleJoinBlinkit(id);
  const handleLeaveBuddy = async (id: string) => handleLeaveBlinkit(id);
  const handleSendBuddyMessage = async (id: string, content: string) => handleSendBlinkitMessage(id, content);
  const handleCloseBuddy = async (id: string) => {
    try {
      await updateDoc(doc(db, 'blinkit_requests', id), { 
        status: 'completed', 
        closedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };
  const handleExtendBuddy = async (id: string, mins: number) => handleExtendBlinkit(id, mins);
  const handleUpdateBuddy = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, 'blinkit_requests', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleAskAI = async (prompt: string) => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!groqKey) return "AI services are currently unavailable. Please ensure VITE_GROQ_API_KEY is set in your environment.";
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "You are a specialized campus medical and wellness assistant for NexusCampus students. Empathize, advise, and always prioritize suggesting campus emergency services for urgent situations." 
            },
            { role: "user", content: prompt }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error("Groq API Error:", data.error);
        return `AI service error: ${data.error.message || 'Unknown error'}`;
      }

      return data.choices?.[0]?.message?.content || "I couldn't process that response. Please try rephrasing.";
    } catch (error: any) {
      console.error("AI Request Failed:", error);
      return "I encountered a connection error. Please try again later.";
    }
  };

  const handleDeleteUser = async (uid: string) => {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
    }
  };

  const handleUpdateSubscription = async (key: string, value: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { [`subscriptions.${key}`]: value });
      setUser({ ...user, subscriptions: { ...user.subscriptions, [key]: value } as any });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  if (loading) return <Loading />;

  if (!user) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        isLoading={isLoginLoading} 
        error={loginError} 
      />
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => { setActiveTab(tab); if (tab === 'profile') setProfileSection('general'); }} 
      user={user} 
      sessions={chatSessions} 
      onLogout={handleLogout}
    >
      {(() => {
        switch (activeTab) {
          case 'home':
            return (
              <Feed 
                queries={queries} 
                blinkitRequests={homeBlinkitRequests}
                onUpvote={handleUpvote}
                onReply={handleReply}
                onJoinBlinkit={handleJoinBlinkit}
                onLeaveBlinkit={handleLeaveBlinkit}
                onCloseBlinkit={handleCloseBlinkit}
                onDeleteBlinkit={handleDeleteBlinkit}
                onExtendBlinkit={handleExtendBlinkit}
                onSendBlinkitMessage={handleSendBlinkitMessage}
                onRemoveBlinkitParticipant={handleRemoveBlinkitParticipant}
                onBlockBlinkitParticipant={handleBlockBlinkitParticipant}
                onOpenPostModal={() => setIsPostModalOpen(true)}
                onDeleteQuery={handleDeleteQuery}
                currentUserId={user.uid}
              />
            );
          case 'my-activity':
            return (
              <MyActivity 
                userQueries={queries.filter(q => q.authorUid === user.uid)} 
                expiredBlinkitRequests={allBlinkitRequests.filter(r => (r.authorUid === user.uid || r.joinedUids?.includes(user.uid)) && r.status !== 'active')}
                expiredBuddyRequests={buddyPosts.filter(p => (p.authorUid === user.uid || p.joinedUids?.includes(user.uid)) && p.status !== 'active')}
                onReply={handleReply} 
                onResolve={handleResolveQuery}
                onExtendBlinkit={handleExtendBlinkit}
                onExtendBuddy={handleExtendBuddy}
                onDeleteBlinkit={handleDeleteBlinkit}
                onLeaveBlinkit={handleLeaveBlinkit}
                onCloseBlinkit={handleCloseBlinkit}
                currentUserId={user.uid}
                allUsers={allUsers}
              />
            );
          case 'messages':
            return <Messaging user={user} messages={messages} sessions={chatSessions} onSendMessage={handleSendMessage} />;
          case 'find-buddy':
            return (
              <BuddyFinder 
                posts={buddyPosts}
                onPostBuddy={handlePostBuddy}
                onConnect={handleJoinBuddy}
                onLeaveBuddy={handleLeaveBuddy}
                onSendMessage={handleSendBuddyMessage}
                onDeleteBuddy={handleDeleteBuddy}
                onCloseBuddy={handleCloseBuddy}
                onExtendBuddy={handleExtendBuddy}
                onUpdateBuddy={handleUpdateBuddy}
                currentUserId={user.uid}
                allUsers={allUsers}
              />
            );
          case 'wellness':
            return <Wellness onAskAI={handleAskAI} />;
          case 'support':
            return <Support />;
          case 'laundry':
            return <Laundry />;
          case 'food-court':
            return <FoodCourt />;
          case 'profile':
            return (
              <Profile 
                profile={user} 
                allUsers={allUsers}
                onUpdateProfile={handleUpdateProfile}
                onUnblockUser={handleUnblockUser}
                onLogout={handleLogout} 
                initialSection={profileSection}
              />
            );
          case 'admin':
            return (
              <AdminPanel 
                queries={queries}
                blinkitRequests={blinkitRequests}
                users={allUsers}
                buddyPosts={buddyPosts}
                onDeleteQuery={async (id) => {
                  if (id.startsWith('mock_')) {
                    const configRef = doc(db, 'system', 'config');
                    await setDoc(configRef, { 
                      deleted_mocks: arrayUnion(id) 
                    }, { merge: true });
                  } else {
                    handleDeleteQuery(id);
                  }
                }}
                onRestoreMocks={async () => {
                  const configRef = doc(db, 'system', 'config');
                  await setDoc(configRef, { deleted_mocks: [] }, { merge: true });
                }}
                onDeleteBlinkit={handleDeleteBlinkit}
                onDeleteBuddy={handleDeleteBuddy}
                onResolveQuery={handleResolveQuery}
                onDeleteUser={handleDeleteUser}
              />
            );
          default:
            return null;
        }
      })()}
      
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPostQuery={handlePostQuery}
        onPostBlinkit={handlePostBlinkit}
      />
    </Layout>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;
