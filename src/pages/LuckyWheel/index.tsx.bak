import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEarnings } from '../../contexts/EarningsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, DollarSign } from 'lucide-react';
import { useWheelSpin } from './hooks/useWheelSpin';
import { supabase } from '@/lib/supabase';
import Wheel from './components/Wheel';
import ResultDialog from './components/ResultDialog';
import WheelProgressBar from './components/WheelProgressBar';
import WheelCooldownTimer from './components/WheelCooldownTimer';
import WheelResults from './components/WheelResults';
import WelcomeScreen from './components/WelcomeScreen';
import SpinSessionSummary from './components/SpinSessionSummary';

const LuckyWheel: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { transactions } = useEarnings();
  
  const [showCooldown, setShowCooldown] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate daily spins
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate daily wheel earnings
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
  
  // Verifica se o cooldown está ativo ao carregar o componente
  useEffect(() => {
    if (!user) return;
    
    const checkCooldownStatus = async () => {
      setIsLoading(true);
      try {
        // 1. Verificar diretamente no localStorage primeiro (rápido)
        const savedEndTime = localStorage.getItem('wheelCooldownEnd');
        if (savedEndTime) {
          const endTime = parseInt(savedEndTime);
          const now = Date.now();
          
          if (endTime > now) {
            console.log('Cooldown do localStorage ativo até:', new Date(endTime));
            setShowCooldown(true);
            setIsLoading(false);
            return;
          } else {
            // Limpar localStorage se o cooldown expirou
            localStorage.removeItem('wheelCooldownEnd');
          }
        }
        
        // 2. Verificar no banco de dados 
        try {
          const { data } = await supabase
            .from('user_progress')
            .select('*')  // Selecionar todos os campos para evitar erro de coluna não existente
            .eq('user_id', user.id)
            .single();
            
          // Verificar de forma segura se o campo existe nos dados
          const lastWheelSpin = data && typeof data === 'object' && 'last_wheel_spin' in data 
            ? (data as any).last_wheel_spin 
            : null;
            
          if (lastWheelSpin) {
            const lastSpinTime = new Date(lastWheelSpin);
            const now = new Date();
            
            // Verificar se o último giro foi menos de 24h atrás
            const cooldownEndTime = new Date(lastSpinTime);
            cooldownEndTime.setHours(cooldownEndTime.getHours() + 24);
            
            if (cooldownEndTime > now) {
              console.log('Cooldown calculado ativo até:', cooldownEndTime);
              
              // Armazenar o tempo no localStorage para persistência local
              localStorage.setItem('wheelCooldownEnd', cooldownEndTime.getTime().toString());
              
              setShowCooldown(true);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.log('Erro ao verificar último giro - as colunas podem não existir ainda', err);
        }
        
        // 3. Verificar se wheelsRemaining é zero como fallback
        if (wheelsRemaining <= 0) {
          console.log('Sem giros restantes, mostrando cooldown');
          setShowCooldown(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao verificar status de cooldown:', error);
        setIsLoading(false);
        
        // Evitar ficar preso na tela de carregamento
        setIsLoading(false);
      }
    };
    
    checkCooldownStatus();
  }, [user, wheelsRemaining]);
  
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

  const onSpinClick = () => {
    if (wheelsRemaining <= 0) {
      setShowCooldown(true);
      return;
    }
    
    handleSpin(wheelsRemaining);
    
    // Garantir que o cooldown seja ativado após girar
    if (wheelsRemaining <= 1) {
      setTimeout(() => {
        setShowCooldown(true);
      }, 10000); // Tempo para a animação e mostrar o resultado
    }
  };

  // Timeout para evitar que a tela fique carregando indefinidamente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Tempo de carregamento excedido, forçando renderização');
        setIsLoading(false);
      }
    }, 5000); // 5 segundos de timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-temu-orange border-t-transparent rounded-full"></div>
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
        totalSpins={1}
        className="mb-6"
      />
      
      {wheelResults.length > 0 && !showCooldown && !showSessionSummary && (
        <WheelResults 
          results={wheelResults} 
          className="mb-6"
        />
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {showCooldown ? (
          <WheelCooldownTimer 
            hoursToWait={24} 
            onComplete={() => {
              setShowCooldown(false);
              setWheelResults([]);
            }}
            debug={false} // Desativar debug em produção
          />
        ) : showSessionSummary ? (
          <SpinSessionSummary 
            results={wheelResults}
            onContinue={() => {
              setShowSessionSummary(false);
              setShowCooldown(true);
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
