
// Re-export authentication utilities from the new structure
// This file is kept for backward compatibility
export {
  syncUserProfileFromSession,
  updateUserProfileData,
  shouldResetReviews
} from './auth';
