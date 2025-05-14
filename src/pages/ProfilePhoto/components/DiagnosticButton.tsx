import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const DiagnosticButton: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      // 1. Verificar sessão
      addResult('Verificando sessão...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        addResult('❌ Usuário não autenticado');
        return;
      }
      addResult(`✅ Usuário autenticado (${session.user.id})`);
      
      // 2. Verificar buckets
      addResult('Listando buckets...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        addResult(`❌ Erro ao listar buckets: ${bucketsError.message}`);
        return;
      }

      addResult(`✅ ${buckets.length} bucket(s) encontrado(s): ${buckets.map(b => b.name).join(', ')}`);
      
      // 3. Verificar existência do bucket profile_photos
      const profileBucket = buckets.find(b => b.name === 'profile_photos');
      if (!profileBucket) {
        addResult('❌ Bucket profile_photos não encontrado');
        
        // Tentar criar o bucket
        addResult('Tentando criar o bucket profile_photos...');
        const { error: createError } = await supabase.storage.createBucket('profile_photos', {
          public: true
        });
        
        if (createError) {
          addResult(`❌ Erro ao criar bucket: ${createError.message}`);
        } else {
          addResult('✅ Bucket profile_photos criado com sucesso');
        }
      } else {
        addResult('✅ Bucket profile_photos existe');
      }
      
      // 4. Testar upload de um pequeno pixel
      addResult('Testando upload...');
      // Pixel base64 1x1
      const base64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        addResult('❌ Formato de teste inválido');
        return;
      }
      
      const contentType = matches[1];
      const base64Data = matches[2];
      const byteCharacters = atob(base64Data);
      
      // Converter para blob
      const bytes = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        bytes[i] = byteCharacters.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: contentType });
      addResult(`✅ Blob criado: ${blob.size} bytes`);
      
      // 5. Fazer upload para o storage
      const fileName = `test_${Date.now()}.gif`;
      const filePath = `test/${fileName}`;
      
      addResult(`Enviando para ${filePath}...`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, blob, {
          contentType: 'image/gif',
          upsert: true
        });
      
      if (uploadError) {
        addResult(`❌ Erro no upload: ${uploadError.message}`);
        return;
      }
      
      addResult('✅ Upload realizado com sucesso');
      
      // 6. Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);
      
      if (!urlData) {
        addResult('❌ Erro ao obter URL pública');
        return;
      }
      
      addResult(`✅ URL gerada: ${urlData.publicUrl}`);
      
      // 7. Remover arquivo de teste
      addResult('Removendo arquivo de teste...');
      const { error: removeError } = await supabase.storage
        .from('profile_photos')
        .remove([filePath]);
      
      if (removeError) {
        addResult(`❌ Erro ao remover arquivo: ${removeError.message}`);
      } else {
        addResult('✅ Arquivo removido com sucesso');
      }
      
      addResult('✅ DIAGNÓSTICO COMPLETO - Sistema parece funcional');
    } catch (error: any) {
      addResult(`❌ ERRO GERAL: ${error.message || 'Erro desconhecido'}`);
      console.error('Erro no diagnóstico:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };
  
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={runDiagnostic}
        disabled={isRunning}
      >
        {isRunning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Executando diagnóstico...
          </>
        ) : 'Diagnosticar sistema de fotos'}
      </Button>
      
      {results.length > 0 && (
        <div className="mt-4 border rounded bg-slate-50 p-3 text-sm font-mono whitespace-pre-wrap">
          {results.map((result, index) => (
            <div key={index} className="py-1">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosticButton; 