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
    
    -- Atualizar os campos de cooldown_end para os registros existentes
    UPDATE user_progress 
    SET like_cooldown_end = (last_like_review + INTERVAL '6 hours')
    WHERE last_like_review IS NOT NULL AND like_cooldown_end IS NULL;
    
    UPDATE user_progress 
    SET inspector_cooldown_end = (last_inspector_review + INTERVAL '6 hours')
    WHERE last_inspector_review IS NOT NULL AND inspector_cooldown_end IS NULL;
    
    UPDATE user_progress 
    SET wheel_cooldown_end = (last_wheel_spin + INTERVAL '24 hours')
    WHERE last_wheel_spin IS NOT NULL AND wheel_cooldown_end IS NULL;
    
    RAISE NOTICE 'Campos de cooldown_end calculados para registros existentes';
END $$; 