
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

// Helper to update both Supabase and localStorage with improved error handling
export const updateUserProfileData = async (
  userId: string, 
  updates: Partial<User>
): Promise<boolean> => {
  try {
    console.log('Updating user profile data for:', userId);
    
    // Convert Date object to string for Supabase
    let lastReviewResetString: string | null = null;
    if (updates.lastReviewReset instanceof Date) {
      lastReviewResetString = updates.lastReviewReset.toISOString();
    } else if (updates.lastReviewReset === null) {
      lastReviewResetString = null;
    }
    
    // Update the profiles table if name or avatar is being updated
    if (updates.name || updates.avatar) {
      try {
        console.log('Updating profile with:', { name: updates.name, avatar: updates.avatar });
        
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updates.name,
            avatar_url: updates.avatar
          })
          .eq('id', userId);
          
        if (error) {
          console.error("Failed to update profile:", error.message, error.details);
        } else {
          console.log("Profile updated successfully");
        }
      } catch (error: any) {
        console.error("Failed to update profile:", error?.message || error);
      }
    }
    
    // Update the user_progress table if progress-related fields are being updated
    if (
      updates.balance !== undefined || 
      updates.reviewsCompleted !== undefined ||
      updates.likeReviewsCompleted !== undefined ||
      updates.inspectorReviewsCompleted !== undefined ||
      updates.reviewsLimit !== undefined ||
      updates.wheelsRemaining !== undefined ||
      updates.lastReviewReset !== undefined
    ) {
      try {
        console.log('Updating user progress with:', {
          balance: updates.balance,
          reviews_completed: updates.reviewsCompleted,
          like_reviews_completed: updates.likeReviewsCompleted,
          inspector_reviews_completed: updates.inspectorReviewsCompleted,
          reviews_limit: updates.reviewsLimit,
          wheels_remaining: updates.wheelsRemaining,
          last_review_reset: lastReviewResetString
        });
        
        const { error } = await supabase
          .from('user_progress')
          .update({
            balance: updates.balance,
            reviews_completed: updates.reviewsCompleted,
            like_reviews_completed: updates.likeReviewsCompleted,
            inspector_reviews_completed: updates.inspectorReviewsCompleted,
            reviews_limit: updates.reviewsLimit,
            wheels_remaining: updates.wheelsRemaining,
            last_review_reset: lastReviewResetString,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (error) {
          console.error("Failed to update user progress:", error.message, error.details);
        } else {
          console.log("User progress updated successfully");
        }
      } catch (error: any) {
        console.error("Failed to update user progress:", error?.message || error);
      }
    }
    
    // Update the localStorage
    const currentUser = localStorage.getItem('temuUser');
    if (currentUser) {
      const userObject = JSON.parse(currentUser);
      const updatedUser = {
        ...userObject,
        ...updates
      };
      localStorage.setItem('temuUser', JSON.stringify(updatedUser));
      console.log("User data updated in localStorage");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error updating user profile data:", error?.message || error);
    return false;
  }
};
