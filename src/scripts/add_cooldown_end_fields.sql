-- Adicionar campos para armazenar o momento exato em que o período de cooldown deve terminar
-- Isso facilita o cálculo do tempo restante ao atualizar a página

-- Verificar se as colunas já existem
DO $$
DECLARE
    last_like_col_exists BOOLEAN;
    last_inspector_col_exists BOOLEAN;
    last_wheel_col_exists BOOLEAN;
BEGIN
    -- Adicionar coluna para fim de cooldown de like
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'like_cooldown_end') 
    THEN
        ALTER TABLE user_progress 
        ADD COLUMN like_cooldown_end TIMESTAMPTZ;
        
        RAISE NOTICE 'Coluna like_cooldown_end adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna like_cooldown_end já existe';
    END IF;
    
    -- Adicionar coluna para fim de cooldown de inspector
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'inspector_cooldown_end') 
    THEN
        ALTER TABLE user_progress 
        ADD COLUMN inspector_cooldown_end TIMESTAMPTZ;
        
        RAISE NOTICE 'Coluna inspector_cooldown_end adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna inspector_cooldown_end já existe';
    END IF;
    
    -- Adicionar coluna para fim de cooldown da roleta
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'wheel_cooldown_end') 
    THEN
        ALTER TABLE user_progress 
        ADD COLUMN wheel_cooldown_end TIMESTAMPTZ;
        
        RAISE NOTICE 'Coluna wheel_cooldown_end adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna wheel_cooldown_end já existe';
    END IF;
    
    -- Verificar quais colunas existem antes de tentar atualizar
    -- Primeiro verificamos se as colunas de timestamp existem
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'last_like_review'
    ) INTO last_like_col_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'last_inspector_review'
    ) INTO last_inspector_col_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'last_wheel_spin'
    ) INTO last_wheel_col_exists;
    
    -- Atualizar apenas se as colunas existirem
    IF last_like_col_exists THEN
        UPDATE user_progress 
        SET like_cooldown_end = (last_like_review + INTERVAL '6 hours')
        WHERE last_like_review IS NOT NULL AND like_cooldown_end IS NULL;
        RAISE NOTICE 'Atualizado like_cooldown_end';
    ELSE
        -- Tentar alternativa - verificar outras colunas possíveis
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_progress' AND column_name = 'last_review_time'
        ) INTO last_like_col_exists;
        
        IF last_like_col_exists THEN
            UPDATE user_progress 
            SET like_cooldown_end = (last_review_time + INTERVAL '6 hours')
            WHERE last_review_time IS NOT NULL AND like_cooldown_end IS NULL;
            RAISE NOTICE 'Atualizado like_cooldown_end usando last_review_time';
        ELSE
            RAISE NOTICE 'Não foi possível atualizar like_cooldown_end (coluna de timestamp não encontrada)';
        END IF;
    END IF;
    
    IF last_inspector_col_exists THEN
        UPDATE user_progress 
        SET inspector_cooldown_end = (last_inspector_review + INTERVAL '6 hours')
        WHERE last_inspector_review IS NOT NULL AND inspector_cooldown_end IS NULL;
        RAISE NOTICE 'Atualizado inspector_cooldown_end';
    ELSE
        -- Tentar alternativa
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_progress' AND column_name = 'last_inspector_time'
        ) INTO last_inspector_col_exists;
        
        IF last_inspector_col_exists THEN
            UPDATE user_progress 
            SET inspector_cooldown_end = (last_inspector_time + INTERVAL '6 hours')
            WHERE last_inspector_time IS NOT NULL AND inspector_cooldown_end IS NULL;
            RAISE NOTICE 'Atualizado inspector_cooldown_end usando last_inspector_time';
        ELSE
            RAISE NOTICE 'Não foi possível atualizar inspector_cooldown_end (coluna de timestamp não encontrada)';
        END IF;
    END IF;
    
    IF last_wheel_col_exists THEN
        UPDATE user_progress 
        SET wheel_cooldown_end = (last_wheel_spin + INTERVAL '24 hours')
        WHERE last_wheel_spin IS NOT NULL AND wheel_cooldown_end IS NULL;
        RAISE NOTICE 'Atualizado wheel_cooldown_end';
    ELSE
        -- Tentar alternativa
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_progress' AND column_name = 'last_wheel_time'
        ) INTO last_wheel_col_exists;
        
        IF last_wheel_col_exists THEN
            UPDATE user_progress 
            SET wheel_cooldown_end = (last_wheel_time + INTERVAL '24 hours')
            WHERE last_wheel_time IS NOT NULL AND wheel_cooldown_end IS NULL;
            RAISE NOTICE 'Atualizado wheel_cooldown_end usando last_wheel_time';
        ELSE
            RAISE NOTICE 'Não foi possível atualizar wheel_cooldown_end (coluna de timestamp não encontrada)';
        END IF;
    END IF;
END $$;

-- Criar ou atualizar a função que verifica e reinicia os contadores quando o cooldown termina
CREATE OR REPLACE FUNCTION reset_after_cooldown()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o cooldown de like terminou
    IF NEW.like_cooldown_end IS NOT NULL AND NOW() >= NEW.like_cooldown_end THEN
        NEW.like_reviews_completed := 0;
        NEW.like_cooldown_end := NULL;
        RAISE NOTICE 'Cooldown de Like for Money terminou, contador reiniciado para: %', NEW.user_id;
    END IF;
    
    -- Verificar se o cooldown de inspector terminou
    IF NEW.inspector_cooldown_end IS NOT NULL AND NOW() >= NEW.inspector_cooldown_end THEN
        NEW.inspector_reviews_completed := 0;
        NEW.inspector_cooldown_end := NULL;
        RAISE NOTICE 'Cooldown de Inspector terminou, contador reiniciado para: %', NEW.user_id;
    END IF;
    
    -- Verificar se o cooldown da roleta terminou
    IF NEW.wheel_cooldown_end IS NOT NULL AND NOW() >= NEW.wheel_cooldown_end THEN
        NEW.wheels_remaining := 1;
        NEW.wheel_cooldown_end := NULL;
        RAISE NOTICE 'Cooldown da Roleta terminou, rodas reiniciadas para: %', NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que verificará o cooldown quando o registro for acessado/atualizado
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'check_cooldown_end_trigger' 
        AND tgrelid = 'user_progress'::regclass
    ) THEN
        CREATE TRIGGER check_cooldown_end_trigger
        BEFORE UPDATE ON user_progress
        FOR EACH ROW
        EXECUTE FUNCTION reset_after_cooldown();
        
        RAISE NOTICE 'Trigger check_cooldown_end_trigger criado com sucesso';
    ELSE
        RAISE NOTICE 'Trigger check_cooldown_end_trigger já existe';
    END IF;
END $$;

-- Adicionar campo de fim de cooldown à tabela user_progress
ALTER TABLE IF EXISTS user_progress
ADD COLUMN IF NOT EXISTS wheel_cooldown_end TIMESTAMP WITH TIME ZONE;

-- Criar ou substituir a função que gerencia o cooldown da roleta
CREATE OR REPLACE FUNCTION update_wheel_cooldown()
RETURNS TRIGGER AS $$
BEGIN
    -- Se estamos atualizando o número de rodas restantes para 0 (após girar a roleta)
    IF NEW.wheels_remaining = 0 AND (OLD.wheels_remaining IS NULL OR OLD.wheels_remaining > 0) THEN
        -- Definir o momento exato em que o cooldown termina (24 horas a partir de agora)
        NEW.wheel_cooldown_end := NOW() + INTERVAL '24 hours';
        NEW.last_wheel_spin := NOW();
        
        RAISE NOTICE 'Cooldown da roleta atualizado para terminar em: %', NEW.wheel_cooldown_end;
    END IF;
    
    -- Se o cooldown da roleta já terminou, resetamos para 1 giro disponível
    IF NEW.wheel_cooldown_end IS NOT NULL AND NOW() >= NEW.wheel_cooldown_end THEN
        NEW.wheels_remaining := 1;
        NEW.wheel_cooldown_end := NULL;
        
        RAISE NOTICE 'Cooldown da roleta terminou, rodas reiniciadas para: %', NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar um trigger específico para a roleta se ainda não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'wheel_cooldown_trigger' 
        AND tgrelid = 'user_progress'::regclass
    ) THEN
        CREATE TRIGGER wheel_cooldown_trigger
        BEFORE UPDATE ON user_progress
        FOR EACH ROW
        EXECUTE FUNCTION update_wheel_cooldown();
        
        RAISE NOTICE 'Trigger wheel_cooldown_trigger criado com sucesso';
    ELSE
        RAISE NOTICE 'Trigger wheel_cooldown_trigger já existe';
    END IF;
END $$;

-- Garantir que os usuários que já usaram a roleta hoje não possam usá-la novamente
UPDATE user_progress
SET wheel_cooldown_end = (last_wheel_spin + INTERVAL '24 hours')
WHERE wheels_remaining = 0 
  AND last_wheel_spin IS NOT NULL 
  AND (wheel_cooldown_end IS NULL OR wheel_cooldown_end < last_wheel_spin + INTERVAL '24 hours')
  AND last_wheel_spin > NOW() - INTERVAL '24 hours';

-- Corrigir quaisquer usuários que tenham wheels_remaining incorreto
UPDATE user_progress
SET wheels_remaining = 0
WHERE wheels_remaining > 0 
  AND last_wheel_spin IS NOT NULL 
  AND last_wheel_spin > NOW() - INTERVAL '24 hours';

-- Resetar o contador para usuários cujo cooldown já terminou
UPDATE user_progress
SET wheels_remaining = 1,
    wheel_cooldown_end = NULL
WHERE wheel_cooldown_end IS NOT NULL 
  AND NOW() >= wheel_cooldown_end; 