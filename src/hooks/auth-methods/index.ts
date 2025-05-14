
import { useAuthRegister } from "./useAuthRegister";
import { useAuthLogin } from "./useAuthLogin";
import { useAuthLogout } from "./useAuthLogout";
import { User, ExtendedUser } from "@/types/auth";
import { useUserProfile } from "../useUserProfile";
import { useForgotPassword } from "./useForgotPassword";
import { useAuthUI } from "../useAuthUI";

/**
 * Custom hook that provides authentication methods
 */
export const useAuthMethods = (
  user: User | null, 
  setUser: (user: User | null) => void, 
  setIsAuthenticated: (value: boolean) => void
) => {
  // Use our new useAuthUI hook for authentication methods with UI feedback
  const {
    register,
    login,
    logout,
    resetPassword,
    updatePassword
  } = useAuthUI(user, setUser, setIsAuthenticated);
  
  // Import hooks for user profile updates
  const {
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserProfile,
    updateUserAvatar,
    changePassword
  } = useUserProfile(user, setUser);

  return {
    register,
    login,
    logout,
    resetPassword,
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserAvatar,
    updateUserProfile,
    changePassword
  };
};
