import { supabase } from '@/lib/supabase';
import { UserProfileInfo, UserWithdrawal } from '../types';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export const fetchUserProfile = async (
  userId: string,
  userName: string,
  userAvatar: string
): Promise<UserProfileInfo | null> => {
  try {
    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('country_code, created_at, level')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Fetch user's transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (transactionsError) throw transactionsError;

    // Calculate total earnings
    const totalEarnings = transactions.reduce((sum, transaction) => {
      if (transaction.activity === 'earnings') {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);

    // Get withdrawals
    const withdrawals: UserWithdrawal[] = transactions
      .filter((t: Transaction) => t.activity === 'withdrawal')
      .map((t: Transaction) => ({
        id: t.id,
        userId: t.user_id,
        amount: Math.abs(t.amount),
        status: t.status,
        createdAt: new Date(t.created_at),
      }));

    return {
      id: userId,
      name: userName,
      avatar: userAvatar,
      earnings: totalEarnings,
      country: profile?.country_code || 'Unknown',
      registrationDate: new Date(profile?.created_at || Date.now()),
      location: profile?.country_code || 'Unknown',
      level: profile?.level || 1,
      withdrawals,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const useUserProfile = () => {
  return {
    fetchUserProfile
  };
}; 