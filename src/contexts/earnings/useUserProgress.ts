import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Transaction } from './types';
import { User } from '@/types/auth';
import { calculateTotalEarnings } from './earningsUtils';

export type UserProgress = {
  balance: number;
  reviewsCompleted: number;
  likeReviewsCompleted: number;
  inspectorReviewsCompleted: number;
  wheelsRemaining: number;
  lastReviewReset: string | null;
};

export const useUserProgress = (userId: string) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega o progresso inicial do usuário
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProgress({
            balance: data.balance,
            reviewsCompleted: data.reviews_completed,
            likeReviewsCompleted: data.like_reviews_completed,
            inspectorReviewsCompleted: data.inspector_reviews_completed,
            wheelsRemaining: data.wheels_remaining,
            lastReviewReset: data.last_review_reset
          });
        }
      } catch (err) {
        console.error('Erro ao carregar progresso:', err);
        setError('Erro ao carregar progresso do usuário');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserProgress();
    }
  }, [userId]);

  // Função para atualizar o progresso
  const updateProgress = async (updates: Partial<UserProgress>) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          balance: updates.balance,
          reviews_completed: updates.reviewsCompleted,
          like_reviews_completed: updates.likeReviewsCompleted,
          inspector_reviews_completed: updates.inspectorReviewsCompleted,
          wheels_remaining: updates.wheelsRemaining,
          last_review_reset: updates.lastReviewReset,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualiza o estado local
      setProgress(prev => prev ? { ...prev, ...updates } : null);

      // Atualiza o localStorage
      const currentUser = localStorage.getItem('temuUser');
      if (currentUser) {
        const userObject: User = JSON.parse(currentUser);
        if (updates.balance !== undefined) {
          userObject.balance = updates.balance;
        }
        localStorage.setItem('temuUser', JSON.stringify(userObject));
      }

      return true;
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      setError('Erro ao atualizar progresso do usuário');
      return false;
    }
  };

  // Função para registrar uma nova transação
  const addTransaction = async (transaction: Transaction) => {
    try {
      // Salva a transação no Supabase
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          id: transaction.id,
          user_id: userId,
          amount: transaction.amount,
          activity: transaction.type,
          status: transaction.status,
          date: transaction.date,
          created_at: new Date().toISOString()
        });

      if (transactionError) throw transactionError;

      // Atualiza o saldo total
      const newBalance = (progress?.balance || 0) + transaction.amount;
      await updateProgress({ balance: newBalance });

      // Atualiza o contador de atividades baseado no tipo
      switch (transaction.type) {
        case 'like':
          await updateProgress({
            likeReviewsCompleted: (progress?.likeReviewsCompleted || 0) + 1,
            reviewsCompleted: (progress?.reviewsCompleted || 0) + 1
          });
          break;
        case 'inspector':
          await updateProgress({
            inspectorReviewsCompleted: (progress?.inspectorReviewsCompleted || 0) + 1,
            reviewsCompleted: (progress?.reviewsCompleted || 0) + 1
          });
          break;
        case 'wheel':
          await updateProgress({
            wheelsRemaining: (progress?.wheelsRemaining || 0) - 1
          });
          break;
      }

      // Atualiza o localStorage
      const currentTransactions = JSON.parse(localStorage.getItem('temuTransactions') || '[]');
      localStorage.setItem('temuTransactions', JSON.stringify([...currentTransactions, transaction]));

      return true;
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      setError('Erro ao registrar transação');
      return false;
    }
  };

  // Função para resetar os contadores diários
  const resetDailyCounters = async () => {
    try {
      const now = new Date();
      await updateProgress({
        reviewsCompleted: 0,
        likeReviewsCompleted: 0,
        inspectorReviewsCompleted: 0,
        wheelsRemaining: 3,
        lastReviewReset: now.toISOString()
      });
      return true;
    } catch (err) {
      console.error('Erro ao resetar contadores:', err);
      setError('Erro ao resetar contadores diários');
      return false;
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    addTransaction,
    resetDailyCounters
  };
}; 