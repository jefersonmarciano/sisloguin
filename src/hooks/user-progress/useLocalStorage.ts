import { UserProgress } from '@/lib/supabase';

// Local storage key for caching progress data
const LOCAL_STORAGE_KEY = 'user_progress';

// Get progress from localStorage
export function getLocalUserProgress(userId: string): UserProgress | null {
  const data = localStorage.getItem(`user_progress_${userId}`);
  return data ? JSON.parse(data) : null;
}

// Save progress to localStorage
export function saveLocalUserProgress(userId: string, data: UserProgress): void {
  try {
    const key = `${LOCAL_STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function setLocalUserProgress(userId: string, data: Partial<UserProgress>): void {
  localStorage.setItem(`user_progress_${userId}`, JSON.stringify(data));
}

export function removeLocalUserProgress(userId: string): void {
  localStorage.removeItem(`user_progress_${userId}`);
}
