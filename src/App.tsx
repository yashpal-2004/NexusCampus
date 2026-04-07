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
import Medical from './components/Medical';
import Support from './components/Support';
import Laundry from './components/Laundry';
import FoodCourt from './components/FoodCourt';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import MyQueries from './components/MyQueries';
import Messaging from './components/Messaging';
import AdminPanel from './components/AdminPanel';
import NotificationsPage from './components/NotificationsPage';
import Login from './components/Login';
import Loading from './components/Loading';
import Welcome from './components/Welcome';
import PostModal from './components/PostModal';
import ComingSoon from './components/ComingSoon';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationsProvider, useNotifications } from './components/NotificationsContext';
import NotificationsManager from './components/NotificationsManager';
import { GoogleGenAI } from "@google/genai";

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
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [blinkitRequests, setBlinkitRequests] = useState<BlinkitRequest[]>([]);
  const [buddyPosts, setBuddyPosts] = useState<BuddyPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  
  const { addNotification, notifications, markAsRead, clearAll } = useNotifications();

  const notifyAll = (notification: Omit<Notification, 'id' | 'recipientUid' | 'read' | 'createdAt'>, subscriptionKey?: keyof NonNullable<UserProfile['subscriptions']>) => {
    if (!user) return;
    allUsers.forEach(u => {
      if (u.uid !== user.uid) {
        if (!subscriptionKey || u.subscriptions?.[subscriptionKey]) {
          addNotification({
            ...notification,
            recipientUid: u.uid,
          });
        }
      }
    });
  };

  const notifyUser = (recipientUid: string, notification: Omit<Notification, 'id' | 'recipientUid' | 'read' | 'createdAt'>, subscriptionKey?: keyof NonNullable<UserProfile['subscriptions']>) => {
    const recipient = allUsers.find(u => u.uid === recipientUid);
    if (recipient) {
      if (!subscriptionKey || recipient.subscriptions?.[subscriptionKey]) {
        addNotification({
          ...notification,
          recipientUid,
        });
      }
    } else {
      addNotification({
        ...notification,
        recipientUid,
      });
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check university suffix (e.g., .edu)
        const email = firebaseUser.email || '';
        // For this demo, we'll accept any email but log the requirement
        // In a real app: if (!email.endsWith('.edu')) { signOut(auth); return; }
        
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
      setQueries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentQuery)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'queries'));

    const qBlinkit = query(collection(db, 'blinkit_requests'), orderBy('createdAt', 'desc'));
    const unsubscribeBlinkit = onSnapshot(qBlinkit, (snapshot) => {
      setBlinkitRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlinkitRequest)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blinkit_requests'));

    const qBuddy = query(collection(db, 'buddy_posts'), orderBy('createdAt', 'desc'));
    const unsubscribeBuddy = onSnapshot(qBuddy, (snapshot) => {
      setBuddyPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BuddyPost)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'buddy_posts'));

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
      unsubscribeBuddy();
      unsubscribeMessages();
      unsubscribeSessions();
      unsubscribeUsers();
    };
  }, [user]);

  // Auto-expire Blinkit requests
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const now = Date.now();
      blinkitRequests.forEach(async (req) => {
        if (req.status === 'active' && req.expiresAt < now) {
          try {
            await updateDoc(doc(db, 'blinkit_requests', req.id), { status: 'expired' });
          } catch (err) {
            // Silently fail for background expiration
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [user, blinkitRequests]);

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
      
      // Notify author
      const qSnap = await getDoc(qRef);
      if (qSnap.exists()) {
        const data = qSnap.data() as StudentQuery;
        if (data.authorUid !== user.uid) {
          notifyUser(data.authorUid, {
            senderUid: user.uid,
            senderName: user.displayName,
            senderPhoto: user.photoURL,
            title: 'New Reply!',
            message: `${user.displayName} replied to your query.`,
            type: 'reply'
          }, 'replies');
        }
      }
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

  const handlePostBuddy = async (category: BuddyPost['category'], title: string, description: string, allowDMs: boolean = true) => {
    if (!user) return;
    const newPost: Omit<BuddyPost, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      category,
      title,
      description,
      createdAt: Date.now(),
      status: 'open',
      allowDMs,
    };
    try {
      await addDoc(collection(db, 'buddy_posts'), newPost);
      notifyAll({
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Buddy Request!',
        message: `${user.displayName} is looking for a ${category} buddy: ${title}`,
        type: 'buddy'
      }, 'buddy');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'buddy_posts');
    }
  };

  const handleDeleteBuddy = async (id: string) => {
    await deleteDoc(doc(db, 'buddy_posts', id));
  };

  const handleCloseBuddy = async (id: string) => {
    await updateDoc(doc(db, 'buddy_posts', id), { status: 'closed' });
  };

  const handleUpdateBuddy = async (id: string, updates: Partial<BuddyPost>) => {
    await updateDoc(doc(db, 'buddy_posts', id), updates);
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

  const handleDeleteQuery = async (id: string) => {
    await deleteDoc(doc(db, 'queries', id));
  };

  const handleDeleteBlinkit = async (id: string) => {
    await deleteDoc(doc(db, 'blinkit_requests', id));
  };

  const handleCloseBlinkit = async (id: string) => {
    await updateDoc(doc(db, 'blinkit_requests', id), { status: 'expired' });
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

  const handleConnectBuddy = async (post: BuddyPost) => {
    if (!user) return;
    // Notify author
    if (post.authorUid !== user.uid) {
      addNotification({
        recipientUid: post.authorUid,
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Connection Request!',
        message: `${user.displayName} wants to connect for your ${post.category} request.`,
        type: 'buddy'
      });
      // Automatically start a chat session
      setActiveTab('messages');
    }
  };

  const handleAskAI = async (prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful medical assistant for university students. Provide clear, concise, and empathetic advice. Always include a disclaimer that you are an AI and not a doctor. If symptoms sound serious, advise them to contact the campus nurse or emergency services immediately."
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
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
      case 'my-queries':
        return (
          <MyQueries 
            userQueries={queries.filter(q => q.authorUid === user.uid)} 
            onReply={handleReply}
            onResolve={handleResolveQuery}
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
      case 'notifications':
        return (
          <NotificationsPage 
            notifications={notifications}
            user={user}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
            onUpdateSubscription={handleUpdateSubscription}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            queries={queries}
            blinkitRequests={blinkitRequests}
            users={allUsers}
            onDeleteQuery={handleDeleteQuery}
            onDeleteBlinkit={handleDeleteBlinkit}
            onResolveQuery={handleResolveQuery}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'find-buddy':
        return (
          <ComingSoon 
            title="Find a Buddy" 
            description="We're building a smarter way for you to find partners for gym, sports, coffee, and more. Stay tuned for the launch!" 
          />
        );
      case 'medical':
        return (
          <ComingSoon 
            title="Medical Services" 
            description="Access campus medical support, book appointments, and consult with our AI health assistant. Coming soon!" 
          />
        );
      case 'support':
        return <Support />;
      case 'laundry':
        return (
          <ComingSoon 
            title="Laundry Management" 
            description="Track your laundry status, book machine slots, and get notified when your clothes are ready. Coming soon!" 
          />
        );
      case 'food-court':
        return (
          <ComingSoon 
            title="Food Court" 
            description="Browse menus, pre-order meals, and skip the queue at your favorite campus eateries. Coming soon!" 
          />
        );
      case 'profile':
        return (
          <Profile 
            profile={user} 
            allUsers={allUsers}
            onUpdateProfile={handleUpdateProfile}
            onUnblockUser={handleUnblockUser}
            onLogout={handleLogout} 
          />
        );
      default:
        return <Feed queries={queries} blinkitRequests={blinkitRequests} onUpvote={handleUpvote} onReply={handleReply} onJoinBlinkit={handleJoinBlinkit} onOpenPostModal={() => setIsPostModalOpen(true)} currentUserId={user.uid} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} sessions={chatSessions} onLogout={handleLogout}>
      {renderContent()}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPostQuery={handlePostQuery}
        onPostBlinkit={handlePostBlinkit}
      />
      <NotificationsManager onNavigateToAll={() => setActiveTab('notifications')} />
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
