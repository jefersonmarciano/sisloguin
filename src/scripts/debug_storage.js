// Script de diagnóstico para Supabase Storage
// Cole este código no console do navegador para executar testes de diagnóstico

(async function() {
  console.log("🔍 Iniciando diagnóstico do Supabase Storage...");
  
  // Verificar se supabase está disponível
  if (!window.supabase) {
    console.error("❌ Cliente Supabase não encontrado. Certifique-se de estar em uma página da aplicação.");
    return;
  }
  
  // Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("❌ Usuário não autenticado. Faça login primeiro.");
    return;
  }
  
  console.log("✅ Usuário autenticado:", session.user.id);
  
  // Testar listagem de buckets
  try {
    console.log("📋 Listando buckets...");
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("❌ Erro ao listar buckets:", error);
      return;
    }
    
    console.log("✅ Buckets disponíveis:", buckets);
    
    // Verificar se o bucket profile_photos existe
    const profileBucket = buckets.find(b => b.name === 'profile_photos');
    
    if (profileBucket) {
      console.log("✅ Bucket profile_photos encontrado:", profileBucket);
    } else {
      console.log("⚠️ Bucket profile_photos não encontrado. Tentando criar...");
      
      try {
        const { data, error } = await supabase.storage.createBucket('profile_photos', {
          public: true
        });
        
        if (error) {
          console.error("❌ Erro ao criar bucket:", error);
        } else {
          console.log("✅ Bucket criado com sucesso:", data);
        }
      } catch (err) {
        console.error("❌ Exceção ao criar bucket:", err);
      }
    }
    
    // Testar upload de imagem pequena
    console.log("📤 Testando upload de imagem...");
    
    // Imagem de 1x1 pixel base64
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJyQbBZywAAAABJRU5ErkJggg==';
    
    // Converter base64 para blob
    const base64Data = base64Image.split(',')[1];
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: 'image/png' });
    console.log("✅ Blob criado:", blob);
    
    // Fazer upload da imagem
    const filePath = `test/test_${Date.now()}.png`;
    
    try {
      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (error) {
        console.error("❌ Erro no upload:", error);
      } else {
        console.log("✅ Upload bem-sucedido:", data);
        
        // Testar obtenção da URL pública
        const { data: urlData } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(filePath);
        
        console.log("✅ URL pública:", urlData.publicUrl);
        
        // Mostrar a imagem
        console.log("👀 Visualize a imagem:", urlData.publicUrl);
        
        // Testar remoção do arquivo
        try {
          const { error: removeError } = await supabase.storage
            .from('profile_photos')
            .remove([filePath]);
          
          if (removeError) {
            console.error("❌ Erro ao remover arquivo:", removeError);
          } else {
            console.log("✅ Arquivo removido com sucesso");
          }
        } catch (err) {
          console.error("❌ Exceção ao remover arquivo:", err);
        }
      }
    } catch (err) {
      console.error("❌ Exceção no upload:", err);
    }
  } catch (err) {
    console.error("❌ Exceção geral:", err);
  }
  
  console.log("🏁 Diagnóstico finalizado!");
})(); 