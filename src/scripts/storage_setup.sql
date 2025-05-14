-- Configuração do Storage para o sistema de upload de fotos de perfil

-- 1. Garantir que o bucket de profile_photos exista e seja público
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('profile_photos', 'Profile Photos', true, 5242880)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 5242880;

-- 2. Configurar tipos de arquivo permitidos
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
WHERE id = 'profile_photos';

-- 3. Configurar políticas de acesso com verificações de segurança adequadas

-- Política para leitura pública de todas as fotos no bucket
BEGIN;
  DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
  
  CREATE POLICY "Public Read Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'profile_photos');
COMMIT;

-- Política para permitir que usuários façam upload apenas para suas próprias pastas
BEGIN;
  DROP POLICY IF EXISTS "User Upload Access" ON storage.objects;
  
  CREATE POLICY "User Upload Access" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
COMMIT;

-- Política para permitir que usuários atualizem apenas suas próprias fotos
BEGIN;
  DROP POLICY IF EXISTS "User Update Access" ON storage.objects;
  
  CREATE POLICY "User Update Access" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
COMMIT;

-- Política para permitir que usuários excluam apenas suas próprias fotos
BEGIN;
  DROP POLICY IF EXISTS "User Delete Access" ON storage.objects;
  
  CREATE POLICY "User Delete Access" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
COMMIT;

-- 4. Função helper para debug (pode ser usada para diagnosticar problemas)
CREATE OR REPLACE FUNCTION debug_storage_permissions(user_id text, file_path text) 
RETURNS TABLE(policy_name text, result boolean) 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    'Public Read Access' as policy_name,
    bucket_id = 'profile_photos'
  FROM storage.objects 
  WHERE name = file_path
  
  UNION ALL
  
  SELECT 
    'User Upload Access' as policy_name,
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = user_id
  FROM storage.objects 
  WHERE name = file_path
  
  UNION ALL
  
  SELECT 
    'User Update Access' as policy_name,
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = user_id
  FROM storage.objects 
  WHERE name = file_path
  
  UNION ALL
  
  SELECT 
    'User Delete Access' as policy_name,
    bucket_id = 'profile_photos' AND 
    (storage.foldername(name))[1] = user_id
  FROM storage.objects 
  WHERE name = file_path;
END $$; 