import { useState } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { syncUserProfileFromSession } from '@/utils/authUtils';

export const useUserActions = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Register new user
  const register = async (email: string, password: string, name?: string): Promise<User | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile in the profiles table if needed
        try {
          // Check if profile exists first
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error checking for existing profile:", profileError);
          }
            
          // If profile doesn't exist, create one
          if (!profileData) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              full_name: name || email.split('@')[0],
              avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`
            });
          }
        } catch (error) {
          console.error("Error setting up user profile:", error);
        }
        
        // Initialize user_progress record
        try {
          await supabase.from('user_progress').insert({
            user_id: data.user.id,
            balance: 0,
            reviews_completed: 0,
            like_reviews_completed: 0,
            inspector_reviews_completed: 0,
            reviews_limit: 10,
            wheels_remaining: 3,
            theme: 'light',
            last_updated: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error initializing user progress:", error);
        }
        
        // Return the user profile
        return syncUserProfileFromSession(data.user);
      }
      
      return null;
    } catch (e) {
      console.error("Registration error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      
      // Try login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // If the login with Supabase was successful
        console.log("Supabase login successful:", data.user);
        
        // Sync the user profile
        const userProfile = await syncUserProfileFromSession(data.user);
        return userProfile;
      }
      
      return null;
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Logout from Supabase
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    loading
  };
};
