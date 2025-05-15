
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCommunity } from '../contexts/CommunityContext';
import { 
  BookText, 
  DollarSign, 
  Wallet, 
  Headphones, 
  Star, 
  AlertTriangle,
  Users,
  ChevronRight,
  User,
  HelpCircle
} from 'lucide-react';
import { useUserProfileViewer } from '@/hooks/useUserProfileViewer';
import UserProfileModal from '@/components/shared/UserProfileModal';
import { UserProfileInfo } from '@/pages/CommunityChat/types';

const activities = [
  {
    id: 1,
    title: 'likeForMoney',
    icon: <Star className="h-5 w-5 text-white" />,
    color: 'bg-temu-orange',
    route: '/like-for-money',
  },
  {
    id: 2,
    title: 'productInspector',
    icon: <AlertTriangle className="h-5 w-5 text-white" />,
    color: 'bg-blue-500',
    route: '/product-inspector',
  },
  {
    id: 3,
    title: 'luckyWheel',
    icon: <Wallet className="h-5 w-5 text-white" />,
    color: 'bg-purple-500',
    route: '/lucky-wheel',
  },
  {
    id: 4,
    title: 'community',
    icon: <Users className="h-5 w-5 text-white" />,
    color: 'bg-green-500',
    route: '/community-chat',
  },
  {
    id: 5,
    title: 'supportCenter',
    icon: <HelpCircle className="h-5 w-5 text-white" />,
    color: 'bg-teal-500',
    route: '/support',
  }
];

// Helper function to format timestamp to relative time
const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, checkAndResetReviews } = useAuth();
  const { recentMessages } = useCommunity();
  const { selectedUser, openUserDetails, closeUserDetails } = useUserProfileViewer();
  
  // Check if reviews need to be reset when dashboard loads
  useEffect(() => {
    checkAndResetReviews();
  }, [checkAndResetReviews]);

  // Handle user click from community messages
  const handleUserClick = (chatUser: any) => {
    // Mock profile data based on chat user
    const userProfile: UserProfileInfo = {
      id: chatUser.user.id,
      name: chatUser.user.name,
      avatar: chatUser.user.avatar,
      earnings: Math.floor(Math.random() * 20000) + 5000, // Random earnings
      country: 'US', // Default country
      level: Math.floor(Math.random() * 10) + 1, // Random level 1-10
      registrationDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)), // Random date within last year
      withdrawals: [
        {
          id: `w-${chatUser.user.id}-1`,
          userId: chatUser.user.id,
          amount: Math.floor(Math.random() * 300) + 50,
          status: 'completed',
          createdAt: new Date(Date.now() - 1000000)
        },
        {
          id: `w-${chatUser.user.id}-2`,
          userId: chatUser.user.id,
          amount: Math.floor(Math.random() * 200) + 20,
          status: 'pending',
          createdAt: new Date(Date.now() - 5000000)
        }
      ]
    };
    
    openUserDetails(userProfile);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Section */}
      <div className="temu-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{t('welcome')}</h1>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('reviewsCompleted')}</span>
              <span>{user.reviewsCompleted} / {user.reviewsLimit}</span>
            </div>
            <div className="temu-progress-bar">
              <div 
                className="temu-progress-fill" 
                style={{ width: `${(user.reviewsCompleted / user.reviewsLimit) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>{t('likeForMoney')}:</span>
              <span>{user.likeReviewsCompleted} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>{t('productInspector')}:</span>
              <span>{user.inspectorReviewsCompleted} / 10</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Tasks Section */}
      <div className="temu-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{t('dailyTasks')}</h2>
          <div className="text-sm text-gray-500">
            {t('dailyLimit')}: 20
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity) => (
            <Link 
              key={activity.id}
              to={activity.route}
              className={`${activity.color} rounded-lg p-3 text-white hover:shadow-md hover:opacity-90 transition-all duration-300`}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-white/20 mr-3">
                  {activity.icon}
                </div>
                <div className="font-medium">{t(activity.title)}</div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  {activity.title === 'supportCenter' && (
                    <span className="text-xs">{t('needHelp')}</span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Community Section */}
      <div className="temu-card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-temu-orange mr-2" />
            <h2 className="font-bold text-lg">{t('community')}</h2>
          </div>
          <Link to="/top100" className="text-temu-orange flex items-center text-sm">
            {t('top100')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentMessages.map((msg) => (
            <div key={msg.id} className="p-3 bg-gray-50 rounded-lg">
              <div 
                className="flex items-center mb-2 cursor-pointer"
                onClick={() => handleUserClick(msg)}
              >
                <img src={msg.user.avatar} alt="User" className="h-8 w-8 rounded-full mr-2" />
                <div>
                  <div className="font-medium text-sm">{msg.user.name}</div>
                  <div className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</div>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {msg.text}
              </p>
            </div>
          ))}
          
          <div className="text-center mt-2">
            <Link to="/community-chat" className="text-sm text-temu-orange flex justify-center items-center">
              {t('seeMoreConversations')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* User Profile Modal */}
      <UserProfileModal 
        user={selectedUser}
        open={!!selectedUser}
        onClose={closeUserDetails}
      />
    </div>
  );
};

export default Dashboard;
