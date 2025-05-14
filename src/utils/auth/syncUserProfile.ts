import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Sync a user profile with Supabase
export const syncUserProfile = async (user: SupabaseUser): Promise<User> => {
  // Create a basic user object
  const userProfile: User = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
    balance: 0,
    reviewsCompleted: 0,
    reviewsLimit: 20,
    likeReviewsCompleted: 0,
    inspectorReviewsCompleted: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    lastReviewDate: null,
    wheelsRemaining: 1,
    lastReviewReset: null
  };

  try {
    // Check if user profile exists in profiles table
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking for user profile:', profileError);
    }

    // If profile does not exist, create one
    if (!existingProfile) {
      try {
        const profileData = {
          id: user.id,
          full_name: userProfile.name,
          avatar_url: userProfile.avatar
        };

        const { error } = await supabase
          .from('profiles')
          .insert([profileData]);
          
        if (error) {
          console.error("Failed to create profile:", error);
        } else {
          console.log("Created profile for new user");
        }
      } catch (err) {
        console.error("Failed to create profile:", err);
      }
    }

    // Check if user progress exists
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error checking for user progress:', progressError);
    }

    // If progress does not exist, create it
    if (!existingProgress) {
      try {
        // Convert Date object to string for Supabase
        let lastReviewResetString: string | null = null;
        if (userProfile.lastReviewReset instanceof Date) {
          lastReviewResetString = userProfile.lastReviewReset.toISOString();
        }

        const { error } = await supabase
          .from('user_progress')
          .insert([{
            user_id: user.id,
            balance: userProfile.balance,
            reviews_completed: userProfile.reviewsCompleted,
            like_reviews_completed: userProfile.likeReviewsCompleted,
            inspector_reviews_completed: userProfile.inspectorReviewsCompleted,
            reviews_limit: userProfile.reviewsLimit,
            wheels_remaining: userProfile.wheelsRemaining,
            last_review_reset: lastReviewResetString
          }]);
          
        if (error) {
          console.error("Failed to create user progress:", error);
        } else {
          console.log("Created user progress for new user");
        }
      } catch (err) {
        console.error("Failed to create user progress:", err);
      }
    } else {
      // Update user profile with progress data
      userProfile.balance = existingProgress.balance;
      userProfile.reviewsCompleted = existingProgress.reviews_completed;
      userProfile.likeReviewsCompleted = existingProgress.like_reviews_completed;
      userProfile.inspectorReviewsCompleted = existingProgress.inspector_reviews_completed;
      userProfile.reviewsLimit = existingProgress.reviews_limit;
      userProfile.wheelsRemaining = existingProgress.wheels_remaining;
      userProfile.lastReviewReset = existingProgress.last_review_reset ? new Date(existingProgress.last_review_reset) : null;
    }

    // If profile exists but we have newer metadata, update it
    if (existingProfile && (
      existingProfile.full_name !== userProfile.name ||
      existingProfile.avatar_url !== userProfile.avatar
    )) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userProfile.name,
          avatar_url: userProfile.avatar
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
      }
    }

    return userProfile;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return userProfile; // Return basic profile even if sync fails
  }
};

// Helper function to sync profile from session
export const syncUserProfileFromSession = async (user: SupabaseUser): Promise<User | null> => {
  if (!user) return null;
  return syncUserProfile(user);
};
