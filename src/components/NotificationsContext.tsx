import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { db, auth, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, writeBatch, getDocs, onAuthStateChanged } from '../firebase';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNotifications([]);
        return;
      }

      const q = query(
        collection(db, 'notifications'),
        where('recipientUid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = async (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif = {
      ...notif,
      createdAt: Date.now(),
      read: false,
    };
    await addDoc(collection(db, 'notifications'), newNotif);
  };

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const clearAll = async () => {
    if (!auth.currentUser) return;
    const batch = writeBatch(db);
    const snapshot = await getDocs(query(collection(db, 'notifications'), where('recipientUid', '==', auth.currentUser.uid)));
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
