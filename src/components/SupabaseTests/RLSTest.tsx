
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RLSTestProps {
  onTestComplete?: () => void;
}

const RLSTest = ({ onTestComplete }: RLSTestProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    canInsert?: boolean;
    canRead?: boolean;
    canUpdate?: boolean;
    error?: string;
  }>({});

  const testRLS = async () => {
    if (!user) {
      setTestResults({ error: 'User not authenticated' });
      return;
    }

    setIsTestRunning(true);
    setTestResults({});
    
    try {
      // Test INSERT with RLS
      const testData = {
        user_id: user.id,
        balance: 100.0,
        completed_activities: ['test'],
        created_at: new Date().toISOString()
      };
      
      // Insert test
      const { data: insertData, error: insertError } = await supabase
        .from('user_progress')
        .insert([testData])
        .select();
      
      console.log('Insert result:', insertData, insertError);
      
      if (insertError) {
        setTestResults({ error: `INSERT Error: ${insertError.message}` });
        return;
      }
      
      // Read test
      const { data: readData, error: readError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .limit(5);
      
      console.log('Read result:', readData, readError);
      
      if (readError) {
        setTestResults({ 
          canInsert: true,
          error: `READ Error: ${readError.message}` 
        });
        return;
      }
      
      // Update test
      const latestId = insertData && insertData[0] ? insertData[0].id : null;
      let updateResult = false;
      
      if (latestId) {
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({ balance: 110.0 })
          .eq('id', latestId)
          .eq('user_id', user.id);
        
        console.log('Update result:', updateError);
        updateResult = !updateError;
      }
      
      setTestResults({
        canInsert: true,
        canRead: true,
        canUpdate: updateResult
      });
      
      if (onTestComplete) {
        onTestComplete();
      }
      
    } catch (error) {
      console.error('RLS Test Error:', error);
      setTestResults({ error: `Testing error: ${(error as Error).message}` });
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-6 bg-white">
      <h3 className="font-medium mb-3">
        {language === 'en' ? 'RLS Policy Test' : 'Teste de Política RLS'}
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          {language === 'en' 
            ? 'Test if the RLS (Row-Level Security) policies are correctly setup to allow the current user to access their own data.'
            : 'Teste se as políticas de RLS (Segurança em Nível de Linha) estão configuradas corretamente para permitir que o usuário atual acesse seus próprios dados.'}
        </p>
        
        <Button 
          onClick={testRLS} 
          disabled={isTestRunning}
          variant="default"
          size="sm"
        >
          {isTestRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {language === 'en' ? 'Test RLS Policies' : 'Testar Políticas RLS'}
        </Button>
      </div>
      
      {(testResults.canInsert !== undefined || testResults.error !== undefined) && (
        <div className="text-sm p-3 bg-gray-50 rounded border">
          <h4 className="font-medium mb-2">
            {language === 'en' ? 'Test Results:' : 'Resultados do teste:'}
          </h4>
          
          {testResults.error ? (
            <p className="text-red-500">{testResults.error}</p>
          ) : (
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className={`w-4 h-4 mr-2 rounded-full ${testResults.canInsert ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {language === 'en' ? 'INSERT permission:' : 'Permissão INSERT:'} {testResults.canInsert ? '✅' : '❌'}
              </li>
              <li className="flex items-center">
                <span className={`w-4 h-4 mr-2 rounded-full ${testResults.canRead ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {language === 'en' ? 'SELECT permission:' : 'Permissão SELECT:'} {testResults.canRead ? '✅' : '❌'}
              </li>
              {testResults.canUpdate !== undefined && (
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 rounded-full ${testResults.canUpdate ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {language === 'en' ? 'UPDATE permission:' : 'Permissão UPDATE:'} {testResults.canUpdate ? '✅' : '❌'}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default RLSTest;
