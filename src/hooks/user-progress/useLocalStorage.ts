
import { UserProgress } from './types';

// Local storage key for caching progress data
const LOCAL_STORAGE_KEY = 'user_progress';

// Get progress from localStorage
export const getLocalUserProgress = (userId: string): UserProgress | null => {
  try {
    const key = `${LOCAL_STORAGE_KEY}_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return null;
  }
};

// Save progress to localStorage
export const saveLocalUserProgress = (userId: string, data: UserProgress): void => {
  try {
    const key = `${LOCAL_STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};
