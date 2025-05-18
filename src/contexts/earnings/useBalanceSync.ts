import { useEffect } from 'react';
import { Transaction } from './types';
import { User } from '@/types/auth';
import { calculateTotalEarnings } from './earningsUtils';
import { supabase } from '../../lib/supabase';

export const useBalanceSync = (transactions: Transaction[]) => {
  // Create effect to check for auth user changes and update balance accordingly
  useEffect(() => {
    const syncUserBalanceWithEarnings = async () => {
      const currentUser = localStorage.getItem('temuUser');
      if (!currentUser) {
        console.log('[useBalanceSync] Nenhum usuário encontrado no localStorage');
        return;
      }

      const userObject: User = JSON.parse(currentUser);
      if (!userObject || !userObject.id) {
        console.log('[useBalanceSync] Usuário inválido no localStorage');
        return;
      }

      const totalEarned = calculateTotalEarnings(transactions);
      
      // Se o saldo não corresponder aos ganhos, atualiza o localStorage e o Supabase
      if (userObject.balance !== totalEarned) {
        console.log('[useBalanceSync] Sincronizando saldo:', { 
          oldBalance: userObject.balance, 
          newBalance: totalEarned 
        });

        try {
          // Atualiza user_progress com o saldo
          const { error: progressError } = await supabase
            .from('user_progress')
            .update({ 
              balance: totalEarned,
              last_updated: new Date().toISOString()
            })
            .eq('user_id', userObject.id);

          if (progressError) {
            console.error('[useBalanceSync] Erro ao atualizar user_progress:', progressError);
            return;
          }

          // Atualiza o localStorage
          userObject.balance = totalEarned;
          localStorage.setItem('temuUser', JSON.stringify(userObject));

          // Busca as transações mais recentes do Supabase para garantir sincronização
          const { data: recentTransactions, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userObject.id)
            .order('created_at', { ascending: false })
            .limit(50);

          if (fetchError) {
            console.error('[useBalanceSync] Erro ao buscar transações recentes:', fetchError);
            return;
          }

          // Atualiza o localStorage com as transações mais recentes
          if (recentTransactions) {
            localStorage.setItem('temuTransactions', JSON.stringify(recentTransactions));
          }

          console.log('[useBalanceSync] Saldo e transações sincronizados com sucesso:', totalEarned);
        } catch (error) {
          console.error('[useBalanceSync] Erro ao sincronizar saldo com Supabase:', error);
        }
      }
    };
    
    // Executa imediatamente
    syncUserBalanceWithEarnings();
    
    // Configura listener para mudanças no localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'temuUser' || event.key === 'temuTransactions') {
        console.log('[useBalanceSync] Mudança detectada no localStorage:', event.key);
        syncUserBalanceWithEarnings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [transactions]);
};
