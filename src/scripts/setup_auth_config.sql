-- Criar as extensões necessárias
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
    UNIQUE(user_id)
);

-- Observação: A configuração de autenticação precisa ser feita manualmente no dashboard do Supabase:
-- 1. Vá para Authentication -> Providers -> Email
-- 2. Desative a opção "Enable Email Confirmations"
-- 3. Clique em Save

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles (apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
        ON profiles FOR SELECT
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
        ON profiles FOR UPDATE
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile"
        ON profiles FOR INSERT
        WITH CHECK (auth.uid() = id);
    END IF;
END
$$;

-- Criar políticas RLS para user_progress (apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_progress' AND policyname = 'Users can view their own progress'
    ) THEN
        CREATE POLICY "Users can view their own progress"
        ON user_progress FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_progress' AND policyname = 'Users can update their own progress'
    ) THEN
        CREATE POLICY "Users can update their own progress"
        ON user_progress FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_progress' AND policyname = 'Users can insert their own progress'
    ) THEN
        CREATE POLICY "Users can insert their own progress"
        ON user_progress FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$; 