import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Transaction } from './types';
import { User } from '@/types/auth';
import { calculateTotalEarnings } from './earningsUtils';

export const useEarningsPersistence = (transactions: Transaction[]) => {
  useEffect(() => {
    const syncTransactions = async () => {
      const currentUser = localStorage.getItem('temuUser');
      if (!currentUser) {
        console.log('[useEarningsPersistence] Nenhum usuário encontrado no localStorage');
        return;
      }

      const userObject: User = JSON.parse(currentUser);
      if (!userObject || !userObject.id) {
        console.log('[useEarningsPersistence] Usuário inválido no localStorage');
        return;
      }

      try {
        // Calcula o total ganho
        const totalEarned = calculateTotalEarnings(transactions);
        console.log('[useEarningsPersistence] Sincronizando saldo com Supabase:', totalEarned);

        // Atualiza user_progress com o saldo
        const { error: progressError } = await supabase
          .from('user_progress')
          .update({ 
            balance: totalEarned,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', userObject.id);

        if (progressError) {
          console.error('[useEarningsPersistence] Erro ao atualizar user_progress:', progressError);
          return;
        }

        // Salva as transações no Supabase
        const { error: transactionsError } = await supabase
          .from('transactions')
          .upsert(
            transactions.map(t => ({
              id: t.id,
              user_id: userObject.id,
              amount: t.amount,
              activity: t.type,
              status: t.status,
              date: t.date,
              created_at: new Date().toISOString()
            }))
          );

        if (transactionsError) {
          console.error('[useEarningsPersistence] Erro ao salvar transações:', transactionsError);
          return;
        }

        // Atualiza o saldo no localStorage
        userObject.balance = totalEarned;
        localStorage.setItem('temuUser', JSON.stringify(userObject));
        
        console.log('[useEarningsPersistence] Saldo e transações sincronizados com sucesso:', totalEarned);
      } catch (error) {
        console.error('[useEarningsPersistence] Erro ao sincronizar transações:', error);
      }
    };

    // Salva no localStorage primeiro
    localStorage.setItem('temuTransactions', JSON.stringify(transactions));
    console.log('[useEarningsPersistence] Salvando transações no localStorage:', transactions);
    
    // Depois sincroniza com o Supabase
    syncTransactions();
  }, [transactions]);

  return {
    // This hook primarily handles side effects, but could be expanded
    // to return persistence-related functions if needed
  };
};
