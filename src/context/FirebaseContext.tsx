import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  saveGameResult, 
  getLeaderboard, 
  saveUserStats, 
  currentUser, 
  UserType,
  LeaderboardEntry,
  UserStats
} from '../config/firebase';

// Define proper types
interface GameData {
  playerName: string;
  score: number;
  moves: number;
  time: number;
  difficulty: string;
  theme: string;
  mode: string;
}

interface FirebaseContextType {
  saveGame: (gameData: GameData) => Promise<{ success: boolean; id?: string; error?: any }>;
  getTopScores: () => Promise<{ success: boolean; data: LeaderboardEntry[]; error?: any }>;
  saveStats: (stats: UserStats) => Promise<{ success: boolean; error?: any }>;
  isConnected: boolean;
  user: UserType | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Set user from currentUser
        if (currentUser) {
          setUser(currentUser);
        }
        
        // Listen for auth state changes
        const { auth } = await import('../config/firebase');
        const unsubscribe = auth.onAuthStateChanged((authUser: UserType | null) => {
          setUser(authUser);
          setIsConnected(true);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setIsConnected(false);
        setLoading(false);
      }
    };
    
    initializeFirebase();
  }, []);

  const saveGame = async (gameData: GameData): Promise<{ success: boolean; id?: string; error?: any }> => {
    try {
      const result = await saveGameResult(gameData);
      return result;
    } catch (error) {
      console.error('Error saving game:', error);
      return { success: false, error };
    }
  };

  const getTopScores = async (): Promise<{ success: boolean; data: LeaderboardEntry[]; error?: any }> => {
    try {
      const result = await getLeaderboard(10);
      return result;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error, data: [] };
    }
  };

  const saveStats = async (stats: UserStats): Promise<{ success: boolean; error?: any }> => {
    if (user && user.uid) {
      try {
        const result = await saveUserStats(user.uid, stats);
        return result;
      } catch (error) {
        console.error('Error saving stats:', error);
        return { success: false, error };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  return (
    <FirebaseContext.Provider value={{
      saveGame,
      getTopScores,
      saveStats,
      isConnected,
      user,
      loading
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};