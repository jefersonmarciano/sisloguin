-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabelas necessárias
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR,
    avatar_url VARCHAR,
    avatar_color VARCHAR,
    country_code VARCHAR,
    phone_number VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL DEFAULT 0,
    reviews_completed INTEGER DEFAULT 0,
    like_reviews_completed INTEGER DEFAULT 0,
    inspector_reviews_completed INTEGER DEFAULT 0,
    reviews_limit INTEGER DEFAULT 20,
    wheels_remaining INTEGER DEFAULT 1,
    theme VARCHAR DEFAULT 'light',
    last_review_reset TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_like_review TIMESTAMP WITH TIME ZONE,
    last_inspector_review TIMESTAMP WITH TIME ZONE,
    last_wheel_spin TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Criar tabela para controle de limites e temporizadores
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR PRIMARY KEY,
    like_reviews_limit INTEGER DEFAULT 10,
    inspector_reviews_limit INTEGER DEFAULT 10,
    review_reset_hours INTEGER DEFAULT 6,
    wheel_reset_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO system_settings (id, like_reviews_limit, inspector_reviews_limit, review_reset_hours, wheel_reset_hours)
VALUES ('default', 10, 10, 6, 24)
ON CONFLICT (id) DO UPDATE
SET like_reviews_limit = 10, 
    inspector_reviews_limit = 10, 
    review_reset_hours = 6, 
    wheel_reset_hours = 24;

-- Adicionar tabela de histórico de transações
CREATE TABLE IF NOT EXISTS transaction_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    transaction_type VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar tabela para atividades de ganhos
CREATE TABLE IF NOT EXISTS earnings_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    source VARCHAR NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    image VARCHAR,
    price DECIMAL NOT NULL,
    question VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    evaluation_type VARCHAR NOT NULL,
    review TEXT,
    is_liked BOOLEAN,
    is_approved BOOLEAN,
    earned_amount DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings_activity ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Criar políticas RLS para user_progress
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para transaction_history
CREATE POLICY "Users can view their own transactions"
ON transaction_history FOR SELECT
USING (auth.uid() = user_id);

-- Criar políticas RLS para earnings_activity
CREATE POLICY "Users can view their own earnings"
ON earnings_activity FOR SELECT
USING (auth.uid() = user_id);

-- Criar políticas RLS para produtos (visíveis para todos usuários autenticados)
CREATE POLICY "Products are viewable by all authenticated users"
ON products FOR SELECT 
USING (auth.role() = 'authenticated');

-- Criar políticas RLS para avaliações de produtos
CREATE POLICY "Users can view their own evaluations"
ON product_evaluations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
ON product_evaluations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Criar função para verificar e resetar os timers de cooldown
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
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile_photos')
ON CONFLICT DO NOTHING;

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