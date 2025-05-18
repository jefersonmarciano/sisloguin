import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEarnings } from '../../contexts/EarningsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, DollarSign } from 'lucide-react';
import { useWheelSpin } from './hooks/useWheelSpin';
import Wheel from './components/Wheel';
import ResultDialog from './components/ResultDialog';
import WheelProgressBar from './components/WheelProgressBar';
import WheelCooldownTimer from './components/WheelCooldownTimer';
import WheelResults from './components/WheelResults';
import WelcomeScreen from './components/WelcomeScreen';
import SpinSessionSummary from './components/SpinSessionSummary';
import { supabase } from '@/integrations/supabase/client';

interface CooldownData {
  end_time: string;
}

const LuckyWheel: React.FC = () => {
  const { t } = useLanguage();
  const { user, checkAndResetReviews } = useAuth();
  const { transactions } = useEarnings();
  
  const [cooldownEndTime, setCooldownEndTime] = useState<string | null>(null);
  const [isCheckingCooldown, setIsCheckingCooldown] = useState(true);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  
  const {
    isSpinning,
    spinDegrees,
    showResult,
    setShowResult,
    currentPrize,
    wheelResults,
    setWheelResults,
    segments,
    handleSpin,
    closeResult
  } = useWheelSpin();

  const today = new Date().toISOString().split('T')[0];

  const dailyWheelEarnings = useMemo(() => {
    return transactions
      .filter(t => 
        t.type === 'wheel' && 
        t.status === 'completed' && 
        t.date === today
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, today]);
  
  const balance = user?.balance || 0;
  const wheelsRemaining = user?.wheelsRemaining || 0;

  // Check for existing cooldown on mount
  useEffect(() => {
    const checkCooldown = async () => {
      if (!user) {
        setIsCheckingCooldown(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_cooldowns')
        .select('end_time')
        .eq('user_id', user.id)
        .eq('feature', 'lucky_wheel')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cooldown:', error);
      }

      if (data) {
        const now = new Date();
        const endTime = new Date((data as CooldownData).end_time);

        if (now < endTime) {
          setCooldownEndTime(endTime.toISOString());
        } else {
          await clearCooldown();
        }
      }
      setIsCheckingCooldown(false);
    };

    checkCooldown();
  }, [user]);

  const clearCooldown = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_cooldowns')
      .delete()
      .eq('user_id', user.id)
      .eq('feature', 'lucky_wheel');

    if (error) {
      console.error('Error clearing cooldown:', error);
    } else {
      setCooldownEndTime(null);
    }
  };

  const addCooldown = async () => {
    if (!user || cooldownEndTime) return;

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);

    const { error } = await supabase
      .from('user_cooldowns')
      .upsert({
        user_id: user.id,
        feature: 'lucky_wheel',
        end_time: endTime.toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,feature'
      });

    if (error) {
      console.error('Error setting cooldown:', error);
    } else {
      setCooldownEndTime(endTime.toISOString());
    }
  };

  // Only show summary after 3 spins, do NOT add cooldown here
  useEffect(() => {
    if (wheelsRemaining <= 0 && !cooldownEndTime && wheelResults.length === 3) {
      setShowSessionSummary(true);
    }
  }, [wheelsRemaining, wheelResults.length, cooldownEndTime]);

  const onSpinClick = async () => {
    await handleSpin(wheelsRemaining);

    if (wheelsRemaining <= 1) {
      setTimeout(() => {
        if (!showSessionSummary && !cooldownEndTime) {
          setShowSessionSummary(true);
        }
      }, 10000);
    }
  };

  if (isCheckingCooldown) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse p-8 text-center">
          <p className="text-lg font-medium text-gray-700">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (cooldownEndTime) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-temu-orange mr-2" />
            <h1 className="text-2xl font-bold">{t('spinToWin')}</h1>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-temu-orange" />
            <span className="font-medium">${balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center h-full">
          <WheelCooldownTimer 
            endTime={new Date(cooldownEndTime)}
            onComplete={() => {
              clearCooldown();
              setWheelResults([]);
              checkAndResetReviews();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wallet className="h-6 w-6 text-temu-orange mr-2" />
          <h1 className="text-2xl font-bold">{t('spinToWin')}</h1>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-temu-orange" />
          <span className="font-medium">${balance.toFixed(2)}</span>
        </div>
      </div>

      <WheelProgressBar 
        spinsRemaining={wheelsRemaining} 
        totalSpins={3}
        className="mb-6"
      />

      {wheelResults.length > 0 && !showSessionSummary && (
        <WheelResults 
          results={wheelResults} 
          className="mb-6"
        />
      )}

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        {showSessionSummary ? (
          <SpinSessionSummary 
            results={wheelResults}
            onContinue={() => {
              setShowSessionSummary(false);
              addCooldown(); // ✅ Cooldown added only once here
            }}
          />
        ) : (
          <>
            <WelcomeScreen 
              handleSpin={onSpinClick}
              isSpinning={isSpinning}
              wheelsRemaining={wheelsRemaining}
              dailyWheelEarnings={dailyWheelEarnings}
            />

            <Wheel 
              segments={segments}
              spinDegrees={spinDegrees}
              isSpinning={isSpinning}
            />

            <ResultDialog 
              showResult={showResult}
              setShowResult={setShowResult}
              currentPrize={currentPrize}
              closeResult={closeResult}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LuckyWheel;
