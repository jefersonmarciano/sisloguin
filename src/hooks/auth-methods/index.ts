
import { useAuthRegister } from "./useAuthRegister";
import { useAuthLogin } from "./useAuthLogin";
import { useAuthLogout } from "./useAuthLogout";
import { User } from "@/types/auth";
import { useUserProfile } from "../useUserProfile";

/**
 * Custom hook that provides authentication methods
 */
export const useAuthMethods = (
  user: User | null, 
  setUser: (user: User | null) => void, 
  setIsAuthenticated: (value: boolean) => void
) => {
  // Get auth methods from sub-hooks
  const { register } = useAuthRegister(user, setUser, setIsAuthenticated);
  const { login } = useAuthLogin(user, setUser, setIsAuthenticated);
  const { logout } = useAuthLogout(user, setUser, setIsAuthenticated);
  
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
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserAvatar,
    updateUserProfile,
    changePassword
  };
};
