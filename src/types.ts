export type QueryStatus = 'pending' | 'resolved' | 'archived';

export enum OperationType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  universitySuffix: string;
  createdAt: number;
  role?: 'admin' | 'student';
  bio?: string;
  phone?: string;
  privacySettings?: {
    showEmail: boolean;
    showPhone: boolean;
    allowDirectMessages: boolean;
  };
  subscriptions?: {
    gym: boolean;
    foodCourt: boolean;
    laundry: boolean;
    system: boolean;
    queries: boolean;
    replies: boolean;
    blinkit: boolean;
    buddy: boolean;
  };
  blockedUids?: string[];
}

export interface Message {
  id: string;
  senderUid: string;
  recipientUid: string;
  content: string;
  createdAt: number;
  read: boolean;
}

export interface ChatSession {
  id: string;
  participants: string[]; // [uid1, uid2]
  lastMessage?: string;
  lastMessageAt?: number;
  updatedAt: number;
}

export interface QueryReply {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: number;
}

export interface StudentQuery {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  imageUrl?: string;
  upvotes: string[]; // Array of UIDs
  downvotes: string[]; // Array of UIDs
  status: QueryStatus;
  createdAt: number;
  replies?: QueryReply[];
}

export interface BlinkitParticipant {
  uid: string;
  displayName: string;
  photoURL?: string;
}

export interface BlinkitMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  createdAt: number;
}

export interface BlinkitRequest {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  itemDescription: string;
  windowMinutes: number;
  expiresAt: number;
  joinedUids: string[];
  participants: BlinkitParticipant[];
  status: 'active' | 'expired' | 'completed';
  createdAt: number;
  messages?: BlinkitMessage[];
  type?: 'blinkit' | 'buddy';
  closedAt?: number;
}

export interface BuddyPost {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  category: 'gym' | 'swimming' | 'coffee' | 'cab' | 'vacation' | 'other';
  title: string;
  description: string;
  createdAt: number;
  universitySuffix: string;
  windowMinutes: number;
  expiresAt: number;
  status: 'active' | 'expired' | 'completed';
  allowDMs: boolean;
  location?: string;
  date?: string;
  joinedUids?: string[];
  participants?: BlinkitParticipant[];
  messages?: BlinkitMessage[];
  type?: 'buddy' | 'blinkit';
  closedAt?: number;
}

export interface Notification {
  id: string;
  recipientUid: string;
  senderUid?: string;
  senderName?: string;
  senderPhoto?: string;
  title: string;
  message: string;
  type: 'query' | 'blinkit' | 'buddy' | 'system' | 'upvote' | 'reply' | 'subscription';
  read: boolean;
  createdAt: number;
}
