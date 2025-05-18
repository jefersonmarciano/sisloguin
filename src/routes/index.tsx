import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import HowToUse from "@/pages/HowToUse";
import LikeForMoney from "@/pages/LikeForMoney";
import ProductInspector from "@/pages/ProductInspector";
import LuckyWheel from "@/pages/LuckyWheel";
import Earnings from "@/pages/Earnings";
import RewardsRedemption from "@/pages/RewardsRedemption";
import CommunityChat from "@/pages/CommunityChat";
import Top100 from "@/pages/Top100";
import NotFound from "@/pages/NotFound";
import ProfileEdit from "@/pages/ProfileEdit";
import ProfilePhoto from "@/pages/ProfilePhoto";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import ProgressPage from "@/pages/ProgressPage";
import Support from "@/pages/Support";
import SupportChat from "@/pages/SupportChat";
import NewPassword from '@/pages/NewPassword';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/new-password" element={<NewPassword />} />
      
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
          <Route path="/profile/photo" element={<ProfilePhoto />} />
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
  );
} 