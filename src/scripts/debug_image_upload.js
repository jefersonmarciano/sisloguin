// Script para diagnóstico de upload de imagens no Supabase Storage
// Cole este código no console do navegador para testar diretamente

(async function() {
  const BUCKET_NAME = 'profile_photos';
  const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJyQbBZywAAAABJRU5ErkJggg==';
  
  console.log("=== DIAGNÓSTICO DE UPLOAD DE IMAGENS ===");
  
  // 1. Verificar se o Supabase está disponível
  if (!window.supabase) {
    console.error("❌ Erro: Cliente Supabase não encontrado no escopo global");
    return;
  }
  console.log("✅ Cliente Supabase encontrado");
  
  // 2. Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("❌ Erro: Usuário não está autenticado");
    return;
  }
  console.log("✅ Usuário autenticado:", session.user.id);
  
  // 3. Verificar se o bucket existe
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("❌ Erro ao listar buckets:", listError);
    return;
  }
  
  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
  console.log(`${bucketExists ? "✅" : "❌"} Bucket '${BUCKET_NAME}' ${bucketExists ? "existe" : "não existe"}`);
  console.log("Buckets disponíveis:", buckets.map(b => b.name));
  
  if (!bucketExists) {
    console.log("Tentando criar bucket...");
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    if (createError) {
      console.error("❌ Erro ao criar bucket:", createError);
      return;
    }
    console.log("✅ Bucket criado com sucesso");
  }
  
  // 4. Testar permissões do bucket
  try {
    console.log("Verificando permissões...");
    const { data: permissions, error: permissionsError } = await supabase.rpc(
      'debug_storage_permissions',
      { user_id: session.user.id, file_path: `${session.user.id}/test.jpg` }
    );
    
    if (permissionsError) {
      console.log("❌ Erro ao verificar permissões:", permissionsError);
    } else {
      console.log("✅ Permissões:", permissions);
    }
  } catch (e) {
    console.log("⚠️ Função debug_storage_permissions não está disponível");
  }
  
  // 5. Testar upload
  try {
    console.log("Preparando para testar upload...");
    const filePath = `${session.user.id}/test_${Date.now()}.png`;
    
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
    console.log("Blob criado, tamanho:", blob.size);
    
    // Fazer upload
    console.log("Iniciando upload de teste para", filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (uploadError) {
      console.error("❌ Erro no upload de teste:", uploadError);
      return;
    }
    
    console.log("✅ Upload de teste bem-sucedido:", uploadData);
    
    // Obter URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
      
    console.log("✅ URL pública:", publicUrlData.publicUrl);
    console.log("Diagnóstico completo. A imagem abaixo deve aparecer se tudo estiver funcionando:");
    console.log(`%c⬇️ Imagem de teste ⬇️`, 'font-size: 14px; font-weight: bold;');
    console.log(`%c `, `background-image: url(${publicUrlData.publicUrl}); background-size: contain; background-repeat: no-repeat; background-position: center; padding: 20px; margin: 10px 0; display: block; height: 50px;`);
  } catch (e) {
    console.error("❌ Erro durante o teste de upload:", e);
  }
})(); 