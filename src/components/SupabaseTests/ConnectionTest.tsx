
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const ConnectionTest: React.FC = () => {
  const { language } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  // Função para testar a conexão com o Supabase
  async function testConnection() {
    console.log('Testando conexão com o Supabase...');
    try {
      const { data, error } = await supabase.from('user_progress').select('*').limit(1);
      if (error) {
        console.error('Erro na conexão com o Supabase:', error.message);
        setConnectionStatus('Erro: ' + error.message);
      } else {
        console.log('Conexão bem-sucedida:', data);
        setConnectionStatus('Conectado! Encontrado ' + data.length + ' registro(s)');
      }
    } catch (err) {
      console.error('Erro inesperado ao testar conexão:', err);
      setConnectionStatus('Erro inesperado ao conectar');
    }
  }

  // Testar conexão ao montar o componente
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="mb-4 p-2 rounded-lg bg-muted/20 border">
      <p className="font-medium">
        {language === 'en' ? 'Supabase connection status' : 'Status da conexão com o Supabase'}: 
        <span className={`ml-2 ${connectionStatus.startsWith('Erro') ? 'text-red-500' : 'text-green-500'}`}>
          {connectionStatus || (language === 'en' ? 'Checking...' : 'Verificando...')}
        </span>
      </p>
      <Button 
        onClick={testConnection}
        size="sm"
        variant="secondary"
        className="mt-2"
      >
        {language === 'en' ? 'Test Connection Again' : 'Testar Conexão Novamente'}
      </Button>
    </div>
  );
};

export default ConnectionTest;
