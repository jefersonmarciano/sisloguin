-- Habilitar RLS (Row Level Security) na tabela user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura apenas dos próprios dados do usuário
CREATE POLICY "Users can read their own progress" 
ON user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política para permitir atualização apenas dos próprios dados do usuário
CREATE POLICY "Users can update their own progress" 
ON user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Política para permitir inserção apenas dos próprios dados do usuário
CREATE POLICY "Users can insert their own progress" 
ON user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Comentário: Se precisar criar a tabela user_progress, use o código abaixo:
/*
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
    last_updated TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);
*/
