import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface CooldownTimerProps {
  hoursToWait: number;
  onComplete: () => void;
  storageKey: string;
  title?: string;
  message?: string;
  color?: string;
  dbField?: string; // Campo no banco de dados para verificar o timestamp inicial
  dbCooldownEndField?: string; // Campo que contém diretamente o timestamp de fim do cooldown
  debug?: boolean; // Prop para mostrar informações de debug
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ 
  hoursToWait, 
  onComplete, 
  storageKey,
  title,
  message,
  color = 'temu-orange', 
  dbField,
  dbCooldownEndField,
  debug = false
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ hours: hoursToWait, minutes: 0, seconds: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    dbTimestamp: string | null;
    localTimestamp: string | null;
    endTime: string | null;
    error: string | null;
    source: string | null;
  }>({
    dbTimestamp: null,
    localTimestamp: null,
    endTime: null,
    error: null,
    source: null
  });
  
  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;
    
    // Força exibição do timer após 5 segundos mesmo se houver problemas de busca
    const forceInitTimeout = setTimeout(() => {
      if (!isInitialized && isMounted) {
        console.log("Forçando inicialização do timer após timeout");
        const defaultEndTime = Date.now() + hoursToWait * 60 * 60 * 1000;
        localStorage.setItem(storageKey, defaultEndTime.toString());
        setIsInitialized(true);
        
        if (debug) {
          setDebugInfo(prev => ({
            ...prev,
            endTime: new Date(defaultEndTime).toISOString(),
            error: "Forced initialization after timeout",
            source: "timeout"
          }));
        }
        
        // Configurar o intervalo normal
        intervalId = setInterval(() => {
          const now = Date.now();
          const diff = defaultEndTime - now;
          
          if (diff <= 0) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            localStorage.removeItem(storageKey);
            clearInterval(intervalId);
            onComplete();
            return;
          }
          
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft({ hours, minutes, seconds });
        }, 1000);
      }
    }, 5000); // 5 segundos são suficientes para timeout
    
    const initializeTimer = async () => {
      try {
        console.log(`Inicializando timer para ${storageKey}, dbField: ${dbField || 'nenhum'}, dbCooldownEndField: ${dbCooldownEndField || 'nenhum'}`);
        
        // Tentar obter dados do banco de dados primeiro
        let dbTimestamp = null;
        let dbTimestampObject = null;
        let cooldownEndTime = null;
        let cooldownEndTimeFromDB = null;
        
        if (user) {
          try {
            // Preparar os campos para buscar no banco
            const fieldsToSelect = [];
            if (dbField) fieldsToSelect.push(dbField);
            if (dbCooldownEndField) fieldsToSelect.push(dbCooldownEndField);
            
            if (fieldsToSelect.length > 0) {
              console.log(`Buscando dados no banco para user ${user.id}, campos: ${fieldsToSelect.join(', ')}`);
              
              const { data, error } = await supabase
                .from('user_progress')
                .select(fieldsToSelect.join(','))
                .eq('user_id', user.id)
                .single();
              
              console.log("Resultado da busca:", data, error);
                
              // Se temos um campo direto para o fim do cooldown, priorizar ele
              if (data && dbCooldownEndField && data[dbCooldownEndField]) {
                cooldownEndTimeFromDB = new Date(data[dbCooldownEndField]);
                console.log(`Encontrado fim de cooldown direto (${dbCooldownEndField}):`, cooldownEndTimeFromDB.toISOString());
                
                if (debug) {
                  setDebugInfo(prev => ({
                    ...prev,
                    endTime: cooldownEndTimeFromDB.toISOString(),
                    source: 'db_cooldown_end'
                  }));
                }
              }
              
              // Se não temos o fim direto mas temos o timestamp inicial, calcular
              if (data && dbField && data[dbField] && !cooldownEndTimeFromDB) {
                dbTimestampObject = new Date(data[dbField]);
                dbTimestamp = dbTimestampObject.getTime();
                
                // Calcular quando o cooldown termina (timestamp original + hoursToWait)
                cooldownEndTime = new Date(dbTimestampObject);
                cooldownEndTime.setHours(cooldownEndTime.getHours() + hoursToWait);
                
                console.log(`Timestamp do banco para ${dbField}:`, dbTimestampObject.toISOString());
                console.log(`Fim do cooldown calculado:`, cooldownEndTime.toISOString());
                
                if (debug) {
                  setDebugInfo(prev => ({
                    ...prev,
                    dbTimestamp: dbTimestampObject.toISOString()
                  }));
                }
              }
              
              if (error) {
                console.error('Erro ao buscar dados do banco:', error);
                if (debug) {
                  setDebugInfo(prev => ({
                    ...prev,
                    error: `DB error: ${error.message}`
                  }));
                }
              }
            }
          } catch (error) {
            console.error('Erro ao buscar dados do banco:', error);
            if (debug) {
              setDebugInfo(prev => ({
                ...prev,
                error: `DB fetch error: ${(error as Error).message}`
              }));
            }
          }
        }
        
        // Tentar obter o timestamp do localStorage como backup
        const savedEndTime = localStorage.getItem(storageKey);
        let localEndTime = savedEndTime ? parseInt(savedEndTime) : null;
        let localEndTimeObject = localEndTime ? new Date(localEndTime) : null;
        
        if (localEndTime) {
          console.log(`Timestamp local para ${storageKey}:`, localEndTimeObject?.toISOString());
          if (debug) {
            setDebugInfo(prev => ({
              ...prev,
              localTimestamp: localEndTimeObject?.toISOString() || null
            }));
          }
        }
        
        // Decidir qual timestamp usar para o fim do cooldown
        let endTime: number;
        let endTimeObject: Date;
        let source: string = 'default';
        
        // Prioridade 1: Timestamp direto de fim de cooldown do banco
        if (cooldownEndTimeFromDB) {
          endTimeObject = cooldownEndTimeFromDB;
          endTime = endTimeObject.getTime();
          source = 'db_cooldown_end_direct';
          
          // Atualizar localStorage com esse valor
          localStorage.setItem(storageKey, endTime.toString());
          console.log(`Timer atualizado do campo de fim de cooldown: ${endTimeObject.toISOString()}`);
        }
        // Prioridade 2: Timestamp calculado a partir do início do cooldown
        else if (cooldownEndTime) {
          endTimeObject = cooldownEndTime;
          endTime = endTimeObject.getTime();
          source = 'db_cooldown_calculated';
          
          // Atualizar localStorage com o tempo calculado do banco
          localStorage.setItem(storageKey, endTime.toString());
          console.log(`Timer atualizado do banco de dados (calculado): ${endTimeObject.toISOString()}`);
        } 
        // Prioridade 3: Timestamp do localStorage
        else if (localEndTime) {
          endTime = localEndTime;
          endTimeObject = new Date(endTime);
          source = 'localStorage';
          console.log(`Timer continuando do localStorage: ${endTimeObject.toISOString()}`);
        } 
        // Último caso: Criar novo timer
        else {
          endTime = Date.now() + hoursToWait * 60 * 60 * 1000;
          endTimeObject = new Date(endTime);
          source = 'new';
          console.log(`Criando novo timer: ${endTimeObject.toISOString()}`);
        }
        
        if (debug) {
          setDebugInfo(prev => ({
            ...prev,
            endTime: endTimeObject.toISOString(),
            source: source
          }));
        }
        
        // Verificar se o timer já expirou
        const now = Date.now();
        if (endTime <= now) {
          console.log("Timer já expirou, completando");
          if (isMounted) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            localStorage.removeItem(storageKey);
            setIsInitialized(true);
            clearTimeout(forceInitTimeout);
            onComplete();
            return;
          }
        }
        
        // Sempre salvar o endTime no localStorage
        localStorage.setItem(storageKey, endTime.toString());
        
        // Iniciar o intervalo para atualizar o countdown
        if (isMounted) {
          clearTimeout(forceInitTimeout); // Limpar o timeout de força
          
          // Já calcular o tempo inicial
          const diff = endTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft({ hours, minutes, seconds });
          setIsInitialized(true);
          
          intervalId = setInterval(() => {
            const currentTime = Date.now();
            const diff = endTime - currentTime;
            
            if (diff <= 0) {
              if (isMounted) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                localStorage.removeItem(storageKey);
                clearInterval(intervalId);
                onComplete();
              }
              return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            if (isMounted) {
              setTimeLeft({ hours, minutes, seconds });
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Erro grave na inicialização do timer:", error);
        // Mesmo com erro, tentar mostrar um timer básico
        if (isMounted && !isInitialized) {
          const endTime = Date.now() + hoursToWait * 60 * 60 * 1000;
          localStorage.setItem(storageKey, endTime.toString());
          setTimeLeft({ hours: hoursToWait, minutes: 0, seconds: 0 });
          setIsInitialized(true);
          
          if (debug) {
            setDebugInfo(prev => ({
              ...prev,
              error: `Critical error: ${(error as Error).message}`,
              endTime: new Date(endTime).toISOString(),
              source: 'error'
            }));
          }
        }
      }
    };
    
    initializeTimer();
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      clearTimeout(forceInitTimeout);
    };
  }, [hoursToWait, onComplete, storageKey, user, dbField, dbCooldownEndField, debug]);
  
  const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const maxSeconds = hoursToWait * 3600;
  const progressPercentage = Math.max(0, 100 - (totalSeconds / maxSeconds) * 100);
  
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-500',
          progress: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-500',
          progress: 'bg-green-500'
        };
      case 'temu-orange':
      default:
        return {
          bg: 'bg-orange-100',
          text: 'text-temu-orange',
          progress: 'bg-temu-orange'
        };
    }
  };
  
  const colorClasses = getColorClasses();
  
  if (!isInitialized) {
    return (
      <div className="p-8 flex flex-col items-center">
        <div className={`${colorClasses.bg} h-24 w-24 rounded-full flex items-center justify-center mb-6`}>
          <Clock className={`h-12 w-12 ${colorClasses.text} animate-pulse`} />
        </div>
        <h2 className="text-xl font-bold mb-2">{title || t('dailyLimitReached')}</h2>
        <p className="text-gray-600 mb-8 text-center">
          {t('calculatingTimeRemaining')}...
        </p>
        
        {/* Mostrar placeholders para o timer enquanto calculando */}
        <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs opacity-50">
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold">{"--"}</span>
            <span className="text-xs text-gray-500">{t('hours')}</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold">{"--"}</span>
            <span className="text-xs text-gray-500">{t('minutes')}</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold">{"--"}</span>
            <span className="text-xs text-gray-500">{t('seconds')}</span>
          </div>
        </div>
        
        {/* Informações de debug ao inicializar */}
        {debug && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs w-full max-w-md">
            <h3 className="font-bold mb-1">Debug Info:</h3>
            <p>Status: Initializing...</p>
            {debugInfo.error && <p className="text-red-500">Error: {debugInfo.error}</p>}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="p-8 flex flex-col items-center">
      <div className={`${colorClasses.bg} h-24 w-24 rounded-full flex items-center justify-center mb-6`}>
        <Clock className={`h-12 w-12 ${colorClasses.text}`} />
      </div>
      
      <h2 className="text-xl font-bold mb-2">{title || t('dailyLimitReached')}</h2>
      <p className="text-gray-600 mb-8 text-center">
        {message || t('youveCompletedAllReviews')}<br/>
        {t('newReviewsAvailable')}:
      </p>
      
      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs">
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <span className="block text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">{t('hours')}</span>
        </div>
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <span className="block text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">{t('minutes')}</span>
        </div>
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <span className="block text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">{t('seconds')}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses.progress} transition-all duration-1000`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Informações de debug quando inicializado */}
      {debug && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs w-full max-w-md">
          <h3 className="font-bold mb-1">Debug Info:</h3>
          <p>Status: <span className="text-green-500">Initialized</span></p>
          <p>Storage Key: {storageKey}</p>
          <p>DB Field: {dbField || 'None'}</p>
          {debugInfo.source && <p>Source: <strong>{debugInfo.source}</strong></p>}
          {debugInfo.dbTimestamp && <p>DB Timestamp: {debugInfo.dbTimestamp}</p>}
          {debugInfo.localTimestamp && <p>Local Timestamp: {debugInfo.localTimestamp}</p>}
          {debugInfo.endTime && <p>End Time: {debugInfo.endTime}</p>}
          {debugInfo.error && <p className="text-red-500">Error: {debugInfo.error}</p>}
        </div>
      )}
    </div>
  );
};

export default CooldownTimer;