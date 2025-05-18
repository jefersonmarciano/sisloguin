
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { shouldResetReviews } from '@/utils/auth';
import { updateUserProfileData } from '@/utils/auth';

export const useAuthMethods = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Login successful:', data.user?.email);
    } catch (error: any) {
      console.error('Login error:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'Failed to login. Please try again.'
      });
      throw error;
    }
  };

  // Register function
  const register = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      console.log('Registration successful:', data.user?.email);
    } catch (error: any) {
      console.error('Registration error:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'Failed to register. Please try again.'
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('temuUser');
    } catch (error: any) {
      console.error('Logout error:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: error.message || 'Failed to logout. Please try again.'
      });
    }
  };

  // Update user balance
  const updateBalance = async (amount: number) => {
    if (!user) return;
    
    try {
      const newBalance = user.balance + amount;
      
      const { error } = await supabase
        .from('user_progress')
        .update({ balance: newBalance })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        balance: newBalance
      });
      
      localStorage.setItem('temuUser', JSON.stringify({
        ...user,
        balance: newBalance
      }));
      
      return newBalance;
    } catch (error: any) {
      console.error('Error updating balance:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Failed to update balance. Please try again.'
      });
    }
  };

  // Complete a review
  const completeReview = (type: 'like' | 'inspector') => {
    if (!user) return;

    let updatedUser = { ...user };

    if (type === 'like') {
      updatedUser.likeReviewsCompleted = (user.likeReviewsCompleted || 0) + 1;
      updatedUser.reviewsCompleted = (user.reviewsCompleted || 0) + 1;
    } else if (type === 'inspector') {
      updatedUser.inspectorReviewsCompleted = (user.inspectorReviewsCompleted || 0) + 1;
      updatedUser.reviewsCompleted = (user.reviewsCompleted || 0) + 1;
    }

    setUser(updatedUser);
    localStorage.setItem('temuUser', JSON.stringify(updatedUser));

    // Update in Supabase
    supabase
      .from('user_progress')
      .update({
        reviews_completed: updatedUser.reviewsCompleted,
        like_reviews_completed: updatedUser.likeReviewsCompleted,
        inspector_reviews_completed: updatedUser.inspectorReviewsCompleted
      })
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Failed to update review count:', error);
        }
      });
  };

  // Check and reset reviews if necessary
  const checkAndResetReviews = () => {
    if (!user) return;
    // Make sure user.lastReviewReset is a Date object or properly converted
    const lastReviewReset = user.lastReviewReset ? 
      (user.lastReviewReset instanceof Date ? 
        user.lastReviewReset : 
        new Date(user.lastReviewReset)) : 
      null;
    console.log('Checking and resetting reviews for user:');

    const shouldReset = shouldResetReviews({ ...user, lastReviewReset });

    if (shouldReset) {
      const now = new Date();
      const updatedUser = {
        ...user,
        reviewsCompleted: 0,
        likeReviewsCompleted: 0,
        inspectorReviewsCompleted: 0,
        wheelsRemaining: 3,
        lastReviewReset: now
      };

      setUser(updatedUser);
      localStorage.setItem('temuUser', JSON.stringify(updatedUser));

      // Update in Supabase
      supabase
        .from('user_progress')
        .update({
          reviews_completed: 0,
          like_reviews_completed: 0,
          inspector_reviews_completed: 0,
          wheels_remaining: 3,
          last_review_reset: now.toISOString()
        })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to reset reviews:', error);
          } else {
            console.log('Daily review limits reset successfully');
          }
        });

      // Clear cooldown timers
      localStorage.removeItem('lastReviewTime');
      localStorage.removeItem('lastProductInspectorTime');
      localStorage.removeItem('lastLuckyWheelTime');
    }
  };

  // Use a wheel
  const useWheel = async () => {
    if (!user) return 0;

    try {
      if (user.wheelsRemaining <= 0) {
        toast({
          variant: 'destructive',
          title: 'No wheels remaining',
          description: 'You have no wheels remaining for today.'
        });
        return 0;
      }

      const remainingWheels = user.wheelsRemaining - 1;
      
      const { error } = await supabase
        .from('user_progress')
        .update({ wheels_remaining: remainingWheels })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const updatedUser = {
        ...user,
        wheelsRemaining: remainingWheels
      };
      
      setUser(updatedUser);
      localStorage.setItem('temuUser', JSON.stringify(updatedUser));
      
      return remainingWheels;
    } catch (error: any) {
      console.error('Error using wheel:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Failed to use wheel',
        description: 'Something went wrong. Please try again.'
      });
      return user.wheelsRemaining;
    }
  };

  // Update user avatar
  const updateUserAvatar = async (avatarUrl: string) => {
    if (!user) return false;
    
    try {
      // Atualizar o avatar na tabela profiles
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Atualizar o estado local
      const updatedUser = {
        ...user,
        avatarUrl,
        avatar: avatarUrl // Add both fields for compatibility
      };
      
      setUser(updatedUser);
      localStorage.setItem('temuUser', JSON.stringify(updatedUser));
      
      return true;
    } catch (error: any) {
      console.error('Error updating avatar:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Failed to update avatar. Please try again.'
      });
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = async (fullName: string, email: string) => {
    if (!user) return false;
    
    try {
      // Atualizar o nome de usuário na tabela profiles
      console.log('Updating user profile:', { fullName, email });
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      // Se o email for alterado, atualize na auth.users
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email
        });
        
        if (emailError) throw emailError;
      }
      
      // Atualizar o estado local
      const updatedUser = {
        ...user,
        fullName,
        name: fullName, // Add both fields for compatibility
        email: email !== user.email ? email : user.email
      };
      
      setUser(updatedUser);
      localStorage.setItem('temuUser', JSON.stringify(updatedUser));
      
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'Failed to update profile. Please try again.'
      });
      return false;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;

    try {
      // Verifique a senha atual tentando fazer login
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (loginError) {
        toast({
          variant: 'destructive',
          title: 'Password Error',
          description: 'Current password is incorrect.'
        });
        return false;
      }
      
      // Atualize para a nova senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated.'
      });
      
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'Failed to update password. Please try again.'
      });
      return false;
    }
  };

  return {
    login,
    register,
    logout,
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserAvatar,
    updateUserProfile,
    changePassword
  };
};
