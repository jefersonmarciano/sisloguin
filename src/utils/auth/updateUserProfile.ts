import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export const updateUserProfileData = async (
  userId: string,
  updates: Partial<User>
): Promise<boolean> => {
  try {
    console.log('Updating user profile data for:', userId);

    // Convert Date object to string for Supabase
    const lastReviewResetString = updates.lastReviewReset instanceof Date
      ? updates.lastReviewReset.toISOString()
      : updates.lastReviewReset === null
        ? null
        : undefined;

    // Track update success status
    let profileUpdateSuccess = true;
    let progressUpdateSuccess = true;

    // Update profiles table if relevant fields are being updated
    if (updates.fullName || updates.name || updates.avatarUrl || updates.avatar) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName || updates.name,
          avatar_url: updates.avatarUrl || updates.avatar
        })
        .eq('id', userId);

      if (error) {
        console.error("Failed to update profile:", error.message);
        profileUpdateSuccess = false;
      } else {
        console.log("Profile updated successfully");
      }
    }

    // Update user_progress table if relevant fields are being updated
    const shouldUpdateProgress = (
      updates.balance !== undefined ||
      updates.reviewsCompleted !== undefined ||
      updates.likeReviewsCompleted !== undefined ||
      updates.inspectorReviewsCompleted !== undefined ||
      updates.reviewsLimit !== undefined ||
      updates.wheelsRemaining !== undefined ||
      updates.lastReviewReset !== undefined
    );

    if (shouldUpdateProgress) {
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
        console.error("Failed to update user progress:", error.message);
        progressUpdateSuccess = false;
      } else {
        console.log("User progress updated successfully");
      }
    }

    // Return true only if all attempted updates succeeded
    return (
      (!shouldUpdateProgress || progressUpdateSuccess) &&
      (!(updates.fullName || updates.name || updates.avatarUrl || updates.avatar) || profileUpdateSuccess)
    );

  } catch (error: any) {
    console.error("Error updating user profile data:", error?.message || error);
    return false;
  }
};