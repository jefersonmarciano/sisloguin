-- Adicionar campos para armazenar o momento exato em que o período de cooldown deve terminar
-- Isso facilita o cálculo do tempo restante ao atualizar a página

-- Verificar se as colunas já existem
DO $$
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
    DECLARE
        last_like_col_exists BOOLEAN;
        last_inspector_col_exists BOOLEAN;
        last_wheel_col_exists BOOLEAN;
    BEGIN
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
    END;
END $$; 