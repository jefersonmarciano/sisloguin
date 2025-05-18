import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Sync a user profile with Supabase
export const syncUserProfile = async (user: SupabaseUser): Promise<User> => {
  // Create a basic user object
  const userProfile: User = {
    id: user.id,
    email: user.email || '',
    fullName: user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
    name: user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
    avatar: user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
    balance: 0,
    reviewsCompleted: 0,
    reviewsLimit: 20,
    likeReviewsCompleted: 0,
    inspectorReviewsCompleted: 0,
    wheelsRemaining: 3,
    lastReviewReset: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Additional fields we'll fetch from other tables
    preferences: {},
    earnings: [],
    transactions: [],
    notifications: [],
    cooldowns: {},
    withdrawalDetails: null,
    wallet: null,
    dailyProgress: null,
    activityHistory: []
  };

  try {
    // 1. Check/Create basic profile in profiles table
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking for user profile:', profileError);
    }

    if (!existingProfile) {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          full_name: userProfile.fullName,
          avatar_url: userProfile.avatarUrl,
          created_at: new Date().toISOString()
        }]);
      
      if (error) console.error("Failed to create profile:", error);
    } else {
      // Update profile with existing data
      userProfile.fullName = existingProfile.full_name || userProfile.fullName;
      userProfile.name = existingProfile.full_name || userProfile.name;
      userProfile.avatarUrl = existingProfile.avatar_url || userProfile.avatarUrl;
      userProfile.avatar = existingProfile.avatar_url || userProfile.avatar;
      userProfile.createdAt = existingProfile.created_at;
      userProfile.updatedAt = existingProfile.updated_at;
    }

    // 2. Fetch user progress data
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (userProgress) {
      userProfile.balance = userProgress.balance || 0;
      userProfile.reviewsCompleted = userProgress.reviews_completed || 0;
      userProfile.likeReviewsCompleted = userProgress.like_reviews_completed || 0;
      userProfile.inspectorReviewsCompleted = userProgress.inspector_reviews_completed || 0;
      userProfile.reviewsLimit = userProgress.reviews_limit || 20;
      userProfile.wheelsRemaining = userProgress.wheels_remaining || 3;
      userProfile.lastReviewReset = userProgress.last_review_reset ? new Date(userProgress.last_review_reset) : null;
    } else {
      // Create default progress record if none exists
      await supabase
        .from('user_progress')
        .insert([{
          user_id: user.id,
          balance: 0,
          reviews_completed: 0,
          like_reviews_completed: 0,
          inspector_reviews_completed: 0,
          reviews_limit: 20,
          wheels_remaining: 3,
          last_review_reset: null
        }]);
    }

    // 3. Fetch user preferences
    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (userPreferences) {
      userProfile.preferences = {
        notificationEnabled: userPreferences.notification_enabled,
        darkMode: userPreferences.dark_mode
      };
    }

    // 4. Fetch user earnings
    const { data: userEarnings } = await supabase
      .from('user_earnings')
      .select('*')
      .eq('user_id', user.id);

    if (userEarnings) {
      userProfile.earnings = userEarnings.map(earning => ({
        id: earning.id,
        amount: earning.amount,
        type: earning.type,
        date: earning.created_at
      }));
    }

    // 5. Fetch transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (transactions) {
      userProfile.transactions = transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        status: tx.status,
        date: tx.created_at
      }));
    }

    // 6. Fetch notifications
    const { data: notifications } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (notifications) {
      userProfile.notifications = notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        read: notif.read,
        date: notif.created_at
      }));
    }

    // 7. Fetch cooldowns
    const { data: cooldowns } = await supabase
      .from('user_cooldowns')
      .select('*')
      .eq('user_id', user.id);

    if (cooldowns) {
      userProfile.cooldowns = cooldowns.reduce((acc, cd) => {
        acc[cd.activity_type] = new Date(cd.cooldown_until);
        return acc;
      }, {} as Record<string, Date>);
    }

    // 8. Fetch withdrawal details
    const { data: withdrawalDetails } = await supabase
      .from('user_withdrawal_details')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (withdrawalDetails) {
      userProfile.withdrawalDetails = {
        method: withdrawalDetails.method,
        accountNumber: withdrawalDetails.account_number,
        accountName: withdrawalDetails.account_name,
        network: withdrawalDetails.network
      };
    }

    // 9. Fetch wallet info
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (wallet) {
      userProfile.wallet = {
        address: wallet.address,
        currency: wallet.currency,
        network: wallet.network
      };
    }

    // 10. Fetch daily progress
    const { data: dailyProgress } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (dailyProgress) {
      userProfile.dailyProgress = {
        tasksCompleted: dailyProgress.tasks_completed,
        dailyGoal: dailyProgress.daily_goal,
        lastUpdated: dailyProgress.updated_at
      };
    }

    // 11. Fetch recent activities
    const { data: recentActivities } = await supabase
      .from('recent_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (recentActivities) {
      userProfile.activityHistory = recentActivities.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        description: activity.description,
        pointsEarned: activity.points_earned,
        date: activity.created_at
      }));
    }

    // Update profile if any metadata changed
    if (existingProfile && (
      existingProfile.full_name !== userProfile.fullName ||
      existingProfile.avatar_url !== userProfile.avatarUrl
    )) {
      await supabase
        .from('profiles')
        .update({
          full_name: userProfile.fullName,
          avatar_url: userProfile.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
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