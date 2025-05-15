-- Adicionar campos para tracking de cooldown na tabela user_progress
ALTER TABLE IF EXISTS user_progress
ADD COLUMN IF NOT EXISTS last_like_review TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_inspector_review TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_wheel_spin TIMESTAMP WITH TIME ZONE;

-- Atualizar a função check_and_reset_timers para usar os novos campos
CREATE OR REPLACE FUNCTION check_and_reset_timers()
RETURNS TRIGGER AS $$
DECLARE
    settings record;
    review_reset_hours INTEGER := 6; -- 6 horas por padrão
    wheel_reset_hours INTEGER := 24; -- 24 horas por padrão
    expected_reset_time TIMESTAMP;
BEGIN
    -- Tentar obter configurações do sistema
    BEGIN
        SELECT * INTO settings FROM system_settings WHERE id = 'default';
        IF FOUND THEN
            review_reset_hours := settings.review_reset_hours;
            wheel_reset_hours := settings.wheel_reset_hours;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Usar valores default
            review_reset_hours := 6;
            wheel_reset_hours := 24;
    END;
    
    -- Verificar e resetar contador de avaliações do Like for Money
    IF NEW.last_like_review IS NULL THEN
        NEW.like_reviews_completed := 0;
    ELSE
        -- Calcular o momento exato em que o período de cooldown deve terminar
        expected_reset_time := NEW.last_like_review + (review_reset_hours * INTERVAL '1 hour');
        -- Verificar se já passamos desse momento
        IF NOW() >= expected_reset_time THEN
            NEW.like_reviews_completed := 0;
        END IF;
    END IF;
    
    -- Verificar e resetar contador de avaliações do Inspector
    IF NEW.last_inspector_review IS NULL THEN
        NEW.inspector_reviews_completed := 0;
    ELSE
        -- Calcular o momento exato em que o período de cooldown deve terminar
        expected_reset_time := NEW.last_inspector_review + (review_reset_hours * INTERVAL '1 hour');
        -- Verificar se já passamos desse momento
        IF NOW() >= expected_reset_time THEN
            NEW.inspector_reviews_completed := 0;
        END IF;
    END IF;
    
    -- Verificar e resetar contador de rodas
    IF NEW.last_wheel_spin IS NULL THEN
        NEW.wheels_remaining := 1;
    ELSE
        -- Calcular o momento exato em que o período de cooldown deve terminar
        expected_reset_time := NEW.last_wheel_spin + (wheel_reset_hours * INTERVAL '1 hour');
        -- Verificar se já passamos desse momento
        IF NOW() >= expected_reset_time THEN
            NEW.wheels_remaining := 1; -- Resetar para 1 roda por dia
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar se o trigger já existe e criar se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'before_update_user_progress'
    ) THEN
        CREATE TRIGGER before_update_user_progress
        BEFORE UPDATE ON user_progress
        FOR EACH ROW
        EXECUTE FUNCTION check_and_reset_timers();
    END IF;
END $$;

-- Configurar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile_photos', 'Profile Photos', true)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- Permitir leitura pública das fotos de perfil
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Public Access'
        AND tablename = 'objects'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'profile_photos');
    END IF;
END $$;

-- Permitir que usuários façam upload de suas próprias fotos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'User Upload Access'
        AND tablename = 'objects'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "User Upload Access" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'profile_photos' AND auth.uid() = owner);
    END IF;
END $$;

-- Permitir que usuários atualizem suas próprias fotos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'User Update Access'
        AND tablename = 'objects'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "User Update Access" 
        ON storage.objects FOR UPDATE 
        USING (bucket_id = 'profile_photos' AND auth.uid() = owner);
    END IF;
END $$;

-- Permitir que usuários excluam suas próprias fotos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'User Delete Access'
        AND tablename = 'objects'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "User Delete Access" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'profile_photos' AND auth.uid() = owner);
    END IF;
END $$; 