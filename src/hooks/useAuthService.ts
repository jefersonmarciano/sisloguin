import { useState } from 'react';
import { User, ExtendedUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { syncUserProfileFromSession } from '@/utils/auth';

/**
 * Hook that encapsulates all Supabase authentication service logic
 * without any UI-related code
 */
export const useAuthService = () => {
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Register a new user with Supabase
   */
  const register = async (email: string, password: string, name?: string): Promise<ExtendedUser | null> => {
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
            reviews_limit: 20,
            wheels_remaining: 3,
            theme: 'light',
            last_updated: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error initializing user progress:", error);
        }
      }
      
      return data.user || null;
    } catch (e) {
      console.error("Registration error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Try login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        console.log("Supabase login successful:", data.user);
      }
      
      return {
        user: data.user,
        session: data.session
      };
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user from Supabase
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Limpar dados locais antes de fazer logout
      localStorage.removeItem('temuUser');
      localStorage.removeItem('temu-auth-token');
      localStorage.removeItem('wheelCooldownEnd');
      localStorage.removeItem('inspectorCooldownEnd');
      localStorage.removeItem('likeCooldownEnd');
      
      // Primeiro faz logout local
      const { error: localError } = await supabase.auth.signOut({ scope: 'local' });
      if (localError) throw localError;
      
      // Depois tenta fazer logout global (sessões em todos dispositivos)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (globalError) {
        console.warn("Erro no logout global:", globalError);
        // Continua mesmo com erro no logout global, pois o local já foi feito
      }
    } catch (e) {
      console.error("Logout error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password for user
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Get the current URL origin to build the redirect URL
      const origin = window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/new-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Unexpected error in resetPassword:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user password
   */
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Password update error:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    loading
  };
};
