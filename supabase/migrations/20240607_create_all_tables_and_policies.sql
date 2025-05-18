-- MIGRAÇÃO COMPLETA PARA O SUPABASE
-- Criação das principais tabelas e políticas de segurança (RLS)

-- 1. Tabela user_progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL DEFAULT 0,
    reviews_completed INTEGER DEFAULT 0,
    like_reviews_completed INTEGER DEFAULT 0,
    inspector_reviews_completed INTEGER DEFAULT 0,
    reviews_limit INTEGER DEFAULT 10,
    wheels_remaining INTEGER DEFAULT 3,
    theme VARCHAR DEFAULT 'light',
    last_review_reset TIMESTAMP,
    last_updated TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own progress" 
  ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  avatar_color TEXT,
  country_code TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Tabela transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE USING (auth.uid() = user_id);

-- 4. Tabela user_cooldowns
CREATE TABLE IF NOT EXISTS user_cooldowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE user_cooldowns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cooldowns"
  ON user_cooldowns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cooldowns"
  ON user_cooldowns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cooldowns"
  ON user_cooldowns FOR UPDATE USING (auth.uid() = user_id);

-- Adicione aqui outras tabelas do seu projeto conforme necessário! 