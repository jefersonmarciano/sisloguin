import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EarningsProvider } from "./contexts/earnings";
import { CommunityProvider } from "./contexts/CommunityContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import HowToUse from "./pages/HowToUse";
import LikeForMoney from "./pages/LikeForMoney";
import ProductInspector from "./pages/ProductInspector";
import LuckyWheel from "./pages/LuckyWheel";
import Earnings from "./pages/Earnings";
import RewardsRedemption from "./pages/RewardsRedemption";
import CommunityChat from "./pages/CommunityChat";
import Top100 from "./pages/Top100";
import NotFound from "./pages/NotFound";
import ProfileEdit from "./pages/ProfileEdit";
import ProfilePhoto from "./pages/ProfilePhoto";
import SimpleProfilePhoto from "./pages/ProfilePhoto/SimpleProfilePhoto";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import ProgressPage from "./pages/ProgressPage";
import Support from "./pages/Support";
import SupportChat from "./pages/SupportChat";
import NewPassword from './pages/NewPassword';
import LogoutPage from './pages/Auth/Logout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    // QueryClientProvider needs to wrap everything since it may be used by any other provider
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter needs to be available to all components that need routing */}
      <BrowserRouter>
        {/* TooltipProvider provides UI features used across the app */}
        <TooltipProvider>
          {/* LanguageProvider is fundamental and independent of other providers */}
          <LanguageProvider>
            {/* AuthProvider needs to come before providers that depend on authentication state */}
            <AuthProvider>
              {/* EarningsProvider depends on AuthProvider for user data */}
              <EarningsProvider>
                {/* CommunityProvider depends on both Auth and other providers above */}
                <CommunityProvider>
                  {/* Toast notifications used throughout the app */}
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Auth routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/new-password" element={<NewPassword />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/login" element={<Navigate to="/auth" replace />} />
                    
                    {/* Protected routes with layout */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/how-to-use" element={<HowToUse />} />
                        <Route path="/like-for-money" element={<LikeForMoney />} />
                        <Route path="/product-inspector" element={<ProductInspector />} />
                        <Route path="/lucky-wheel" element={<LuckyWheel />} />
                        <Route path="/earnings" element={<Earnings />} />
                        <Route path="/rewards" element={<RewardsRedemption />} />
                        <Route path="/community-chat" element={<CommunityChat />} />
                        <Route path="/top100" element={<Top100 />} />
                        <Route path="/profile/edit" element={<ProfileEdit />} />
                        <Route path="/profile/photo" element={<SimpleProfilePhoto />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/progress" element={<ProgressPage />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/support-chat" element={<SupportChat />} />
                      </Route>
                    </Route>
                    
                    {/* Not found page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CommunityProvider>
              </EarningsProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
