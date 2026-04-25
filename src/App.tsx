import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  where,
  getDocs
} from './firebase';
import { 
  UserProfile, 
  StudentQuery, 
  BlinkitRequest, 
  BuddyPost, 
  Notification, 
  QueryReply,
  Message,
  ChatSession
} from './types';
import Layout from './components/Layout';
import Feed from './components/Feed';
import BuddyFinder from './components/BuddyFinder';
import MedicalSupport from './components/MedicalSupport';
import Laundry from './components/Laundry';
import FoodCourt from './components/FoodCourt';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import MyActivity from './components/MyActivity';
import Messaging from './components/Messaging';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Loading from './components/Loading';
import Welcome from './components/Welcome';
import PostModal from './components/PostModal';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationsProvider, useNotifications } from './components/NotificationsContext';
import NotificationsManager from './components/NotificationsManager';
import { GoogleGenAI } from "@google/genai";
import { ensureMillis } from './lib/utils';

// Firestore Error Handler
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', errInfo);
}

const MOCK_QUERIES: StudentQuery[] = [
  { id: 'mock_1', content: "Lost my black earbuds near the library entrance. If anyone finds them, please let me know!", imageUrl: "/mock/keys.png", authorName: "Arjun Sharma", authorUid: "mock_1", createdAt: Date.now() - 3600000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_2', content: "Anyone has the notes for Computer Networks (CS-302)? Need them for upcoming midterms.", imageUrl: "/mock/notes.png", authorName: "Sneha Kapur", authorUid: "mock_2", createdAt: Date.now() - 7200000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_3', content: "Upcoming Cricket Match: Final selection for the university team this Saturday at the main ground!", imageUrl: "/mock/cricket.png", authorName: "Coach Khanna", authorUid: "mock_3", createdAt: Date.now() - 10800000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_4', content: "The Tech Fest registrations are now open! Check out the portal for workshop details.", imageUrl: "/mock/tech.png", authorName: "Tech Council", authorUid: "mock_4", createdAt: Date.now() - 14400000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_5', content: "Special Lunch today: Paneer Butter Masala and Kulcha at Mess Canteen! Don't miss out.", imageUrl: "/mock/meal.png", authorName: "Mess Manager", authorUid: "mock_5", createdAt: Date.now() - 18000000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_6', content: "Found a wallet in the student plaza. Contains some cash and an ID card. Please contact me to claim.", imageUrl: "/mock/tuck.png", authorName: "Rahul Verma", authorUid: "mock_6", createdAt: Date.now() - 21600000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_7', content: "WiFi is extremely slow in Block C. Is anyone else facing the same issue?", imageUrl: "/mock/ccd.png", authorName: "Priya Das", authorUid: "mock_7", createdAt: Date.now() - 25200000, status: 'pending', upvotes: [], replies: [] },
  { id: 'mock_8', content: "Late Night Study Session: Library will be open till 4 AM tonight due to exams.", imageUrl: "/mock/chai.png", authorName: "Library Admin", authorUid: "mock_8", createdAt: Date.now() - 28800000, status: 'pending', upvotes: [], replies: [] }
];

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileSection, setProfileSection] = useState<'general' | 'notifications' | 'security' | 'blocked'>('general');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [blinkitRequests, setBlinkitRequests] = useState<BlinkitRequest[]>([]);
  const [buddyPosts, setBuddyPosts] = useState<BuddyPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [homeBlinkitRequests, setHomeBlinkitRequests] = useState<BlinkitRequest[]>([]);
  
  const { addNotification, notifications, markAsRead, clearAll } = useNotifications();

  const notifyAll = (notification: Omit<Notification, 'id' | 'recipientUid' | 'read' | 'createdAt'>, subscriptionKey?: keyof NonNullable<UserProfile['subscriptions']>) => {
    if (!user || allUsers.length === 0) return;
    allUsers.forEach(u => {
      if (u.uid !== user.uid) {
        const isSubscribed = !subscriptionKey || !u.subscriptions || (u.subscriptions && (u.subscriptions as any)[subscriptionKey] === true);
        if (isSubscribed) {
          addNotification({ ...notification, recipientUid: u.uid });
        }
      }
    });
  };

  const notifyUser = (recipientUid: string, notification: Omit<Notification, 'id' | 'recipientUid' | 'read' | 'createdAt'>, subscriptionKey?: keyof NonNullable<UserProfile['subscriptions']>) => {
    const recipient = allUsers.find(u => u.uid === recipientUid);
    if (recipient) {
      const isSubscribed = !subscriptionKey || !recipient.subscriptions || (recipient.subscriptions && (recipient.subscriptions as any)[subscriptionKey] === true);
      if (isSubscribed) {
        addNotification({ ...notification, recipientUid });
      }
    } else {
      addNotification({ ...notification, recipientUid });
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Student',
            photoURL: firebaseUser.photoURL || undefined,
            universitySuffix: email.split('@')[1] || '',
            createdAt: Date.now(),
            blockedUids: [],
            subscriptions: {
              gym: true,
              foodCourt: true,
              laundry: true,
              system: true,
              queries: true,
              replies: true,
              blinkit: true,
              buddy: true,
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

  // Data Listeners
  useEffect(() => {
    if (!user) return;

    const qQueries = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
    const unsubscribeQueries = onSnapshot(qQueries, (snapshot) => {
      const realQueries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentQuery));
      
      const deletedMocksString = localStorage.getItem('deleted_mocks') || '[]';
      let deletedMocks: string[] = [];
      try {
        deletedMocks = JSON.parse(deletedMocksString);
      } catch (e) {
        deletedMocks = [];
      }
      
      const availableMocks = MOCK_QUERIES.filter(m => !deletedMocks.includes(m.id));
      
      const numMocksNeeded = Math.max(0, 8 - realQueries.length);
      const mocksToShow = availableMocks.slice(0, numMocksNeeded).map(m => ({ ...m, type: 'query' as const }));
      
      setQueries([...realQueries, ...mocksToShow] as StudentQuery[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'queries'));

    const qBlinkit = query(collection(db, 'blinkit_requests'), orderBy('createdAt', 'desc'));
    const unsubscribeBlinkit = onSnapshot(qBlinkit, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      const blinkits = allDocs.filter(d => !d.itemDescription?.includes('BUDD_FLAG:')) as BlinkitRequest[];
      const buddies = allDocs.map(d => {
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
              closedAt: parts.length >= 8 ? (parseInt(parts[7]) || undefined) : undefined
            } as BuddyPost;
          }
          return null;
        }).filter(Boolean) as BuddyPost[];
      
      setBlinkitRequests(blinkits);
      setBuddyPosts(buddies);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blinkit_requests'));

    const qMessages = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    const qSessions = query(
      collection(db, 'chat_sessions'),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribeSessions = onSnapshot(qSessions, (snapshot) => {
      setChatSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'chat_sessions'));

    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    return () => {
      unsubscribeQueries();
      unsubscribeBlinkit();
      unsubscribeMessages();
      unsubscribeSessions();
      unsubscribeUsers();
    };
  }, [user]);

  // Maintain pre-filtered home feed state
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
    const interval = setInterval(filter, 500); // Check every 0.5s for zero lag
    return () => clearInterval(interval);
  }, [blinkitRequests]);

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoginLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      setLoginError(error.message || "An unknown error occurred during login.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

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
      notifyAll({
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Query Posted!',
        message: `${user.displayName} posted a new query: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        type: 'query'
      }, 'queries');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'queries');
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (id.startsWith('mock_')) {
      const deletedMocks = JSON.parse(localStorage.getItem('deleted_mocks') || '[]');
      localStorage.setItem('deleted_mocks', JSON.stringify([...deletedMocks, id]));
      setQueries(prev => prev.filter(q => q.id !== id));
    } else {
      try {
        await deleteDoc(doc(db, 'queries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `queries/${id}`);
      }
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
      notifyAll({
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Blinkit Request!',
        message: `${user.displayName} is ordering: ${item}`,
        type: 'blinkit'
      }, 'blinkit');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'blinkit_requests');
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

  const handleExtendBlinkit = async (id: string, extraMinutes: number) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        if (data.authorUid !== user.uid) return;
        
        const newExpiresAt = Date.now() + (extraMinutes * 60 * 1000);
        await updateDoc(bRef, {
          expiresAt: newExpiresAt,
          windowMinutes: extraMinutes,
          status: 'active'
        });

        notifyAll({
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'Blinkit Request Extended!',
          message: `${user.displayName} extended their order for ${data.itemDescription} by ${extraMinutes} minutes.`,
          type: 'blinkit'
        }, 'blinkit');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleExtendBuddy = async (id: string, extraMinutes: number) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as any;
        if (data.authorUid !== user.uid) return;
        
        const newExpiresAt = Date.now() + (extraMinutes * 60 * 1000);
        await updateDoc(bRef, {
          expiresAt: newExpiresAt,
          windowMinutes: extraMinutes,
          status: 'active'
        });

        notifyAll({
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'Buddy Request Restarted!',
          message: `${user.displayName} is looking for a partner again!`,
          type: 'buddy'
        }, 'buddy');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id} (buddy)`);
    }
  };

  const handleSendBlinkitMessage = async (id: string, content: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderUid: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      content,
      createdAt: Date.now(),
    };
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        await updateDoc(bRef, {
          messages: arrayUnion(newMessage)
        });

        // Notify all joined users except the sender
        const recipients = data.joinedUids.filter(uid => uid !== user.uid);
        if (data.authorUid !== user.uid && !recipients.includes(data.authorUid)) {
          recipients.push(data.authorUid);
        }

        recipients.forEach(recipientUid => {
          notifyUser(recipientUid, {
            senderUid: user.uid,
            senderName: user.displayName,
            senderPhoto: user.photoURL,
            title: 'New Order Message',
            message: `${user.displayName}: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
            type: 'blinkit'
          }, 'blinkit');
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleJoinBlinkit = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const bSnap = await getDoc(bRef);
    if (bSnap.exists()) {
      const data = bSnap.data() as BlinkitRequest;
      if (!data.joinedUids.includes(user.uid) && data.expiresAt > Date.now()) {
        const newParticipant = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        try {
          await updateDoc(bRef, {
            joinedUids: arrayUnion(user.uid),
            participants: arrayUnion(newParticipant)
          });
          
          // Notify author
          if (data.authorUid !== user.uid) {
            notifyUser(data.authorUid, {
              senderUid: user.uid,
              senderName: user.displayName,
              senderPhoto: user.photoURL,
              title: 'Someone Joined!',
              message: `${user.displayName} joined your order request.`,
              type: 'blinkit'
            }, 'blinkit');
          }
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
        const newJoinedUids = data.joinedUids.filter(uid => uid !== user.uid);
        const newParticipants = data.participants.filter(p => p.uid !== user.uid);
        
        await updateDoc(bRef, {
          joinedUids: newJoinedUids,
          participants: newParticipants
        });

        // Notify author
        addNotification({
          recipientUid: data.authorUid,
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'Participant Left',
          message: `${user.displayName} left your order request.`,
          type: 'blinkit'
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleRemoveBlinkitParticipant = async (requestId: string, participantUid: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', requestId);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BlinkitRequest;
        if (data.authorUid !== user.uid) return;

        const newJoinedUids = data.joinedUids.filter(uid => uid !== participantUid);
        const newParticipants = data.participants.filter(p => p.uid !== participantUid);
        
        await updateDoc(bRef, {
          joinedUids: newJoinedUids,
          participants: newParticipants
        });

        // Notify participant
        addNotification({
          recipientUid: participantUid,
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'Removed from Order',
          message: `${user.displayName} removed you from their order request.`,
          type: 'blinkit'
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${requestId}`);
    }
  };

  const handleBlockBlinkitParticipant = async (participantUid: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        blockedUids: arrayUnion(participantUid)
      });
      
      // Also remove them from current active blinkit requests if any
      const q = query(collection(db, 'blinkit_requests'), where('authorUid', '==', user.uid), where('status', '==', 'active'));
      const bSnaps = await getDocs(q);
      for (const bDoc of bSnaps.docs) {
        const data = bDoc.data() as BlinkitRequest;
        if (data.joinedUids.includes(participantUid)) {
          await handleRemoveBlinkitParticipant(bDoc.id, participantUid);
        }
      }

      addNotification({
        recipientUid: user.uid,
        title: 'User Blocked',
        message: 'You have blocked this user. They will no longer see your Blinkit requests.',
        type: 'system'
      });

      // Update local state
      const newBlockedUids = user.blockedUids ? [...user.blockedUids, participantUid] : [participantUid];
      setUser({ ...user, blockedUids: newBlockedUids });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleUnblockUser = async (blockedUid: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        blockedUids: arrayRemove(blockedUid)
      });
      
      addNotification({
        recipientUid: user.uid,
        title: 'User Unblocked',
        message: 'You have unblocked the user. They can now see your Blinkit requests again.',
        type: 'system'
      });

      // Update local state
      if (user.blockedUids) {
        const newBlockedUids = user.blockedUids.filter(uid => uid !== blockedUid);
        setUser({ ...user, blockedUids: newBlockedUids });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handlePostBuddy = async (category: BuddyPost['category'], title: string, description: string, window: number, allowDMs: boolean = true, location: string = '', date: string = '') => {
    if (!user) return;
    const expiresAt = Date.now() + (window * 60 * 1000);
    const encodedDesc = `BUDD_FLAG:|||${category}|||${title}|||${allowDMs}|||${location}|||${date}|||${description}|||`;
    const newPost: any = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      itemDescription: encodedDesc,
      windowMinutes: window,
      expiresAt: Date.now() + (window * 60000),
      createdAt: Date.now(),
      status: 'active',
      joinedUids: [user.uid],
      participants: [{
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }]
    };
    try {
      await addDoc(collection(db, 'blinkit_requests'), newPost);
      alert('Post successful! Should appear in the feed now.');
      notifyAll({
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Buddy Request!',
        message: `${user.displayName} is looking for a ${category} partner!`,
        type: 'buddy'
      }, 'buddy');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'blinkit_requests (buddy_cloak)');
    }
  };

  const handleDeleteBuddy = async (id: string) => {
    await deleteDoc(doc(db, 'blinkit_requests', id));
  };

  const handleCloseBuddy = async (id: string) => {
    console.log("Attempting to close buddy request:", id);
    try {
      const bRef = doc(db, 'blinkit_requests', id);
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data();
        const currentDesc = data.itemDescription || '';
        const now = Date.now();
        // Append closedAt to the cloak: ...|||description|||closedAt
        const parts = currentDesc.split('|||');
        // Ensure we have enough parts. If it was old system (6 parts), pad it.
        while (parts.length < 7) parts.push(''); 
        parts[7] = now.toString();
        const newDesc = parts.join('|||');

        await updateDoc(bRef, { 
          status: 'completed',
          itemDescription: newDesc
        });
        console.log("Firestore update successful for buddy request:", id);
      }
    } catch (err) {
      console.error("FAILED to close buddy request:", err);
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id} (buddy_close)`);
      alert("Failed to close request: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleJoinBuddy = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const bSnap = await getDoc(bRef);
    if (bSnap.exists()) {
      const data = bSnap.data() as BuddyPost;
      if (!data.joinedUids?.includes(user.uid) && data.status === 'active') {
        try {
          await updateDoc(bRef, {
            joinedUids: arrayUnion(user.uid)
          });
          
          // Notify author
          if (data.authorUid !== user.uid) {
            notifyUser(data.authorUid, {
              senderUid: user.uid,
              senderName: user.displayName,
              senderPhoto: user.photoURL,
              title: 'New Buddy Connection!',
              message: `${user.displayName} connected to your "${data.title}" request.`,
              type: 'buddy'
            }, 'buddy');
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
        }
      }
    }
  };

  const handleLeaveBuddy = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BuddyPost;
        const newJoinedUids = (data.joinedUids || []).filter(uid => uid !== user.uid);
        
        await updateDoc(bRef, {
          joinedUids: newJoinedUids
        });

        // Notify author
        addNotification({
          recipientUid: data.authorUid,
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'Buddy Disconnected',
          message: `${user.displayName} disconnected from your "${data.title}" request.`,
          type: 'buddy'
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };



  const handleSendBuddyMessage = async (id: string, content: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderUid: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      content,
      createdAt: Date.now(),
    };
    try {
      const bSnap = await getDoc(bRef);
      if (bSnap.exists()) {
        const data = bSnap.data() as BuddyPost;
        await updateDoc(bRef, {
          messages: arrayUnion(newMessage)
        });

        // Notify all joined users except the sender
        const recipients = data.joinedUids.filter(uid => uid !== user.uid);
        if (data.authorUid !== user.uid && !recipients.includes(data.authorUid)) {
          recipients.push(data.authorUid);
        }

        recipients.forEach(recipientUid => {
          notifyUser(recipientUid, {
            senderUid: user.uid,
            senderName: user.displayName,
            senderPhoto: user.photoURL,
            title: 'New Buddy Message',
            message: `${user.displayName}: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
            type: 'buddy'
          }, 'buddy');
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id}`);
    }
  };

  const handleUpdateBuddy = async (id: string, updates: Partial<BuddyPost>) => {
    await updateDoc(doc(db, 'blinkit_requests', id), updates);
  };

  const handleUpdateSubscription = async (key: keyof UserProfile['subscriptions'], value: boolean) => {
    if (!user) return;
    const uRef = doc(db, 'users', user.uid);
    const newSubscriptions = { ...user.subscriptions, [key]: value };
    await updateDoc(uRef, { subscriptions: newSubscriptions });
    setUser({ ...user, subscriptions: newSubscriptions as any });
  };

  const handleDeleteUser = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };


  const handleDeleteBlinkit = async (id: string) => {
    await deleteDoc(doc(db, 'blinkit_requests', id));
  };

  const handleCloseBlinkit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'blinkit_requests', id), { 
        status: 'expired',
        closedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blinkit_requests/${id} (blinkit_close)`);
      alert("Failed to close Blinkit request: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleResolveQuery = async (id: string) => {
    const qRef = doc(db, 'queries', id);
    const qSnap = await getDoc(qRef);
    if (qSnap.exists()) {
      const data = qSnap.data() as StudentQuery;
      await updateDoc(qRef, { status: 'resolved' });
      // Notify author
      addNotification({
        recipientUid: data.authorUid,
        title: 'Query Resolved!',
        message: 'Your query has been marked as resolved.',
        type: 'query'
      });
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const uRef = doc(db, 'users', user.uid);
    await updateDoc(uRef, updates);
    setUser({ ...user, ...updates });
  };

  const handleSendMessage = async (recipientUid: string, content: string) => {
    if (!user) return;
    const newMessage: Omit<Message, 'id'> = {
      senderUid: user.uid,
      recipientUid,
      content,
      createdAt: Date.now(),
      read: false,
    };
    await addDoc(collection(db, 'messages'), newMessage);

    // Update or create session
    const sessionId = [user.uid, recipientUid].sort().join('_');
    const sRef = doc(db, 'chat_sessions', sessionId);
    const sSnap = await getDoc(sRef);
    if (sSnap.exists()) {
      await updateDoc(sRef, {
        lastMessage: content,
        lastMessageAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      await setDoc(sRef, {
        participants: [user.uid, recipientUid],
        lastMessage: content,
        lastMessageAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    addNotification({
      recipientUid,
      senderUid: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      title: 'New Message',
      message: `${user.displayName} sent you a message.`,
      type: 'system'
    });
  };



  const handleAskAI = async (prompt: string) => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "You are a specialized medical assistant for university students. Provide clear, concise, and empathetic advice. Always include a disclaimer that you are an AI and not a doctor. If symptoms sound serious, advise them to contact the campus nurse or emergency services immediately." 
            },
            { role: "user", content: prompt }
          ],
          model: "llama3-70b-8192",
          temperature: 0.6,
          max_tokens: 1024,
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      return "I couldn't process that request right now.";
    } catch (error) {
      console.error("Groq AI Error:", error);
      return "I'm sorry, I'm having trouble connecting to my healthy brain right now. Please try again later.";
    }
  };

  if (loading) return <Loading />;
  if (!user) return <Login onLogin={handleLogin} isLoading={isLoginLoading} error={loginError} />;
  if (isNewUser) return <Welcome onGetStarted={() => setIsNewUser(false)} userName={user.displayName} />;

  const renderContent = () => {
    const filteredBlinkitRequests = blinkitRequests.filter(req => {
      const author = allUsers.find(u => u.uid === req.authorUid);
      if (author && author.blockedUids && author.blockedUids.includes(user.uid)) {
        return false;
      }
      return true;
    });

    switch (activeTab) {
      case 'home':
        return (
          <Feed 
            queries={queries} 
            blinkitRequests={filteredBlinkitRequests}
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
            currentUserId={user.uid}
          />
        );
      case 'my-activity':
        const myExpiredBlinkit = blinkitRequests.filter(r => 
          (r.authorUid === user.uid || r.joinedUids?.includes(user.uid)) && 
          ((r.expiresAt && ensureMillis(r.expiresAt) < currentTime) || r.status === 'completed' || r.status === 'expired')
        );
        const myExpiredBuddies = buddyPosts.filter(p => 
          (p.authorUid === user.uid || p.joinedUids?.includes(user.uid)) && 
          (p.status === 'expired' || p.status === 'completed' || (p.expiresAt && ensureMillis(p.expiresAt) < currentTime))
        );
        return (
          <MyActivity 
            userQueries={queries.filter(q => q.authorUid === user.uid)} 
            expiredBlinkitRequests={myExpiredBlinkit}
            expiredBuddyRequests={myExpiredBuddies}
            onReply={handleReply} 
            onResolve={handleResolveQuery}
            onExtendBlinkit={handleExtendBlinkit}
            onExtendBuddy={handleExtendBuddy}
            onDeleteBlinkit={handleDeleteBlinkit}
            currentUserId={user.uid}
            allUsers={allUsers}
          />
        );
      case 'messages':
        return (
          <Messaging 
            user={user}
            messages={messages}
            sessions={chatSessions}
            onSendMessage={handleSendMessage}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            queries={queries}
            blinkitRequests={blinkitRequests.filter(r => !r.itemDescription || !r.itemDescription.includes('BUDD_FLAG:'))}
            users={allUsers}
            buddyPosts={buddyPosts}
            onDeleteQuery={handleDeleteQuery}
            onDeleteBlinkit={handleDeleteBlinkit}
            onDeleteBuddy={handleDeleteBuddy}
            onResolveQuery={handleResolveQuery}
            onDeleteUser={handleDeleteUser}
          />
        );
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
        return <MedicalSupport onAskAI={handleAskAI} />;
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
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
            initialSection={profileSection}
          />
        );
      default:
        return (
          <Feed 
            queries={queries} 
            blinkitRequests={homeBlinkitRequests} 
            onUpvote={handleUpvote} 
            onReply={handleReply} 
            onJoinBlinkit={handleJoinBlinkit} 
            onOpenPostModal={() => setIsPostModalOpen(true)} 
            onDeleteQuery={handleDeleteQuery}
            currentUserId={user.uid} 
          />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'profile') setProfileSection('general');
      }} 
      user={user} 
      sessions={chatSessions} 
      onLogout={handleLogout}
    >
      {renderContent()}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPostQuery={handlePostQuery}
        onPostBlinkit={handlePostBlinkit}
      />
      <NotificationsManager onNavigateToAll={() => {
        setActiveTab('profile');
        setProfileSection('notifications');
      }} />

    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationsProvider>
        <AppContent />
      </NotificationsProvider>
    </ErrorBoundary>
  );
};

export default App;
