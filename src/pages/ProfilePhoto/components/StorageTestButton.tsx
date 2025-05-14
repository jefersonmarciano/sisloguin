import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const StorageTestButton: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: string[];
  } | null>(null);
  
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const runTest = async () => {
    // Reset state
    setIsTesting(true);
    setTestResults(null);

    try {
      const testDetails: string[] = [];
      
      // 1. Verificar se o usuário está autenticado
      if (!user || !user.id) {
        setTestResults({
          success: false,
          message: "Você precisa estar logado para testar o upload",
          details: ["Usuário não autenticado ou ID inválido"]
        });
        return;
      }
      
      testDetails.push("✅ Usuário autenticado: " + user.id);
      
      // 2. Testar se conseguimos listar os buckets
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          setTestResults({
            success: false,
            message: "Erro ao listar buckets do Storage",
            details: [
              "⛔ " + bucketsError.message,
              "Isso pode indicar um problema com as permissões da sua conta ou com a configuração do Storage."
            ]
          });
          return;
        }
        
        testDetails.push(`✅ Buckets listados com sucesso: ${buckets.length} bucket(s)`);
        testDetails.push(`📋 Buckets disponíveis: ${buckets.map(b => b.name).join(', ')}`);
        
        // 3. Verificar se o bucket profile_photos existe
        const bucketExists = buckets.some(b => b.name === 'profile_photos');
        
        if (!bucketExists) {
          testDetails.push("⚠️ Bucket 'profile_photos' não encontrado. Tentando criar...");
          
          // Tentar criar o bucket
          const { error: createError } = await supabase.storage.createBucket('profile_photos', {
            public: true
          });
          
          if (createError) {
            setTestResults({
              success: false,
              message: "Erro ao criar bucket 'profile_photos'",
              details: [
                ...testDetails,
                "⛔ " + createError.message,
                "Verifique se você tem permissões para criar buckets ou peça ao administrador para executar o script SQL."
              ]
            });
            return;
          }
          
          testDetails.push("✅ Bucket 'profile_photos' criado com sucesso");
        } else {
          testDetails.push("✅ Bucket 'profile_photos' encontrado");
        }
        
        // 4. Testar upload de um pequeno arquivo de teste
        const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJyQbBZywAAAABJRU5ErkJggg==';
        const filePath = `${user.id}/test_${Date.now()}.png`;
        
        // Converter base64 para blob
        const base64Data = testImage.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let i = 0; i < byteCharacters.length; i += 512) {
          const slice = byteCharacters.slice(i, i + 512);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: 'image/png' });
        testDetails.push(`✅ Blob criado com sucesso, tamanho: ${blob.size} bytes`);
        
        // Fazer upload
        testDetails.push(`📤 Tentando upload para: ${filePath}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile_photos')
          .upload(filePath, blob, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          setTestResults({
            success: false,
            message: "Erro ao fazer upload de arquivo de teste",
            details: [
              ...testDetails,
              "⛔ " + uploadError.message,
              "Verifique as políticas RLS do seu banco ou execute o script storage_setup.sql"
            ]
          });
          return;
        }
        
        testDetails.push("✅ Upload de arquivo de teste realizado com sucesso");
        
        // 5. Obter URL pública
        const { data: publicUrlData } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(filePath);
        
        if (!publicUrlData || !publicUrlData.publicUrl) {
          setTestResults({
            success: false,
            message: "Erro ao obter URL pública do arquivo",
            details: [
              ...testDetails,
              "⛔ Não foi possível obter URL pública",
              "Verifique se o bucket está configurado como público"
            ]
          });
          return;
        }
        
        testDetails.push(`✅ URL pública gerada: ${publicUrlData.publicUrl}`);
        
        // Todos os testes passaram
        setTestResults({
          success: true,
          message: "Todos os testes passaram! O upload deve funcionar.",
          details: testDetails
        });
        
      } catch (error: any) {
        setTestResults({
          success: false,
          message: "Erro inesperado ao testar o Storage",
          details: [
            ...testDetails,
            "⛔ " + (error.message || String(error))
          ]
        });
      }
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="mt-6">
      <Button 
        onClick={runTest} 
        variant="outline" 
        disabled={isTesting}
        className="w-full"
      >
        {isTesting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testando Storage...
          </>
        ) : (
          <>Diagnosticar Problemas de Upload</>
        )}
      </Button>
      
      {testResults && (
        <div className={`mt-4 p-4 rounded-md text-sm ${testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-semibold ${testResults.success ? 'text-green-600' : 'text-red-600'}`}>
            {testResults.message}
          </p>
          
          {testResults.details && testResults.details.length > 0 && (
            <div className="mt-2 space-y-1 text-gray-700">
              {testResults.details.map((detail, idx) => (
                <p key={idx}>{detail}</p>
              ))}
            </div>
          )}
          
          {testResults.success && (
            <p className="mt-2 text-green-600">
              Se o upload de fotos ainda não funciona, pode haver um problema no componente de upload.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StorageTestButton; 