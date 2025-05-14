
import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface UserRankIconProps {
  rank: number;
}

const UserRankIcon: React.FC<UserRankIconProps> = ({ rank }) => {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" fill="gold" />;
  } else if (rank === 2) {
    return <Medal className="h-5 w-5 text-gray-400" fill="silver" />;
  } else if (rank === 3) {
    return <Medal className="h-5 w-5 text-orange-800" fill="#cd7f32" />;
  } else {
    return <div className="text-gray-500 text-xs font-medium">{rank}</div>;
  }
};

export default UserRankIcon;
