import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  setDoc,
  getDoc,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User as FirebaseUser
} from 'firebase/auth';

// Export UserType as FirebaseUser for compatibility
export type UserType = FirebaseUser;

// Game Data Interface
export interface GameData {
  playerName: string;
  score: number;
  moves: number;
  time: number;
  difficulty: string;
  theme: string;
  mode: string;
  userId?: string;
  date?: string;
  createdAt?: number;
}

// Leaderboard Entry Interface
export interface LeaderboardEntry extends GameData {
  id: string;
}

// User Stats Interface
export interface UserStats {
  totalGames: number;
  totalWins: number;
  averageMoves: number;
  averageTime: number;
  bestScore: number;
  gamesPlayed: number[];
}

// Game Session Interface
export interface GameSession {
  id: string;
  playerName?: string;
  score?: number;
  moves?: number;
  time?: number;
  difficulty?: string;
  theme?: string;
  mode?: string;
  userId?: string;
  timestamp?: number;
  [key: string]: any; // For additional properties
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your_api_key_here',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your_auth_domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your_project_id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your_storage_bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your_messaging_sender_id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your_app_id'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Collections
const LEADERBOARD_COLLECTION = 'leaderboard';
const USERS_COLLECTION = 'users';
const GAMES_COLLECTION = 'games';

// Current user
let currentUser: UserType | null = null;

// Auth state listener
onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  if (user) {
    currentUser = user as UserType;
    console.log('User signed in:', currentUser.uid);
  } else {
    signInAnonymously(auth).catch((error) => {
      console.error('Anonymous sign in failed:', error);
    });
  }
});

// Save game result to Firebase
export const saveGameResult = async (gameData: GameData): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), {
      ...gameData,
      userId: currentUser?.uid || 'anonymous',
      date: new Date().toISOString(),
      createdAt: Date.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving game result:', error);
    return { success: false, error };
  }
};

// Get leaderboard from Firebase
export const getLeaderboard = async (limitCount: number = 10): Promise<{ success: boolean; data: LeaderboardEntry[]; error?: any }> => {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderboardEntry[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      playerName: doc.data().playerName || 'Anonymous',
      score: doc.data().score || 0,
      moves: doc.data().moves || 0,
      time: doc.data().time || 0,
      difficulty: doc.data().difficulty || 'medium',
      theme: doc.data().theme || 'animals',
      mode: doc.data().mode || 'single',
      date: doc.data().date || new Date().toISOString(),
      userId: doc.data().userId || 'anonymous',
      createdAt: doc.data().createdAt || Date.now()
    }));
    return { success: true, data: leaderboard };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, error, data: [] };
  }
};

// Save user statistics
export const saveUserStats = async (userId: string, stats: UserStats): Promise<{ success: boolean; error?: any }> => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...stats,
      lastUpdated: Date.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving user stats:', error);
    return { success: false, error };
  }
};

// Get user statistics
export const getUserStats = async (userId: string): Promise<{ success: boolean; data: UserStats | null; error?: any }> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as UserStats;
      return { success: true, data };
    }
    return { success: true, data: null };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, error, data: null };
  }
};

// Save game session
export const saveGameSession = async (sessionData: Partial<GameData>): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    const docRef = await addDoc(collection(db, GAMES_COLLECTION), {
      ...sessionData,
      userId: currentUser?.uid || 'anonymous',
      timestamp: Date.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving game session:', error);
    return { success: false, error };
  }
};

// Get user's game history - FIXED with proper typing
export const getUserGameHistory = async (_userId: string, limitCount: number = 10): Promise<{ success: boolean; data: GameSession[]; error?: any }> => {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const games: GameSession[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      playerName: doc.data().playerName || 'Anonymous',
      score: doc.data().score || 0,
      moves: doc.data().moves || 0,
      time: doc.data().time || 0,
      difficulty: doc.data().difficulty || 'medium',
      theme: doc.data().theme || 'animals',
      mode: doc.data().mode || 'single',
      userId: doc.data().userId || 'anonymous',
      timestamp: doc.data().timestamp || Date.now()
    }));
    return { success: true, data: games };
  } catch (error) {
    console.error('Error getting game history:', error);
    return { success: false, error, data: [] };
  }
};

// Alternative: Get user's game history filtered by userId (for future use)
export const getUserGameHistoryByUserId = async (userId: string, limitCount: number = 10): Promise<{ success: boolean; data: GameSession[]; error?: any }> => {
  try {
    const result = await getUserGameHistory(userId, limitCount);
    if (result.success) {
      const filteredGames = result.data.filter(game => game.userId === userId);
      return { success: true, data: filteredGames };
    }
    return result;
  } catch (error) {
    console.error('Error getting user game history:', error);
    return { success: false, error, data: [] };
  }
};

export { db, auth, currentUser };