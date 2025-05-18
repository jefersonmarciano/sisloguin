
import { useState, useEffect } from 'react';
import { useDailyReset } from '../hooks/user-profile/useDailyReset';
import { User } from '../types/auth';

export function DailyResetTest() {
  const [user, setUser] = useState<User | null>(null);

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('temuUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Converte a string de data para objeto Date
      if (parsedUser.lastReviewReset) {
        parsedUser.lastReviewReset = new Date(parsedUser.lastReviewReset);
      }
      setUser(parsedUser);
    }
  }, []);

  // Usa o hook de reset diário
  useDailyReset();

  const forceReset = () => {
    if (user) {
      // Força um reset alterando a data do último reset para 25 horas atrás
      const updatedUser = {
        ...user,
        lastReviewReset: new Date(Date.now() - 25 * 60 * 60 * 1000)
      };
      setUser(updatedUser);
      // Salva no localStorage com a data como string ISO
      const userForStorage = {
        ...updatedUser,
        lastReviewReset: updatedUser.lastReviewReset.toISOString()
      };
      localStorage.setItem('temuUser', JSON.stringify(userForStorage));
    }
  };

  const simulateReview = () => {
    if (user) {
      const updatedUser = {
        ...user,
        reviewsCompleted: (user.reviewsCompleted || 0) + 1,
        likeReviewsCompleted: (user.likeReviewsCompleted || 0) + 1
      };
      setUser(updatedUser);
      // Salva no localStorage com a data como string ISO
      const userForStorage = {
        ...updatedUser,
        lastReviewReset: updatedUser.lastReviewReset.toISOString()
      };
      localStorage.setItem('temuUser', JSON.stringify(userForStorage));
    }
  };

  const simulateSpin = () => {
    if (user) {
      const updatedUser = {
        ...user,
        wheelsRemaining: Math.max(0, (user.wheelsRemaining || 3) - 1)
      };
      setUser(updatedUser);
      // Salva no localStorage com a data como string ISO
      const userForStorage = {
        ...updatedUser,
        lastReviewReset: updatedUser.lastReviewReset.toISOString()
      };
      localStorage.setItem('temuUser', JSON.stringify(userForStorage));
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  const hoursUntilReset = user.lastReviewReset
    ? Math.ceil((24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(user.lastReviewReset).getTime())) / (60 * 60 * 1000))
    : 0;

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Teste de Reset Diário</h2>
      
      <div className="space-y-2">
        <p>Último Reset: {user.lastReviewReset?.toLocaleString() || 'Nunca'}</p>
        <p>Próximo Reset em: {hoursUntilReset} horas</p>
        <p>Reviews Completadas: {user.reviewsCompleted || 0}/10</p>
        <p>Reviews de Likes: {user.likeReviewsCompleted || 0}/10</p>
        <p>Reviews de Inspector: {user.inspectorReviewsCompleted || 0}/10</p>
        <p>Spins Restantes: {user.wheelsRemaining || 3}/3</p>
        <p>Saldo: ${user.balance?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="space-x-2">
        <button
          onClick={forceReset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Forçar Reset
        </button>
        <button
          onClick={simulateReview}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={user.reviewsCompleted >= 10}
        >
          Simular Review
        </button>
        <button
          onClick={simulateSpin}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={user.wheelsRemaining <= 0}
        >
          Simular Spin
        </button>
      </div>
    </div>
  );
}
