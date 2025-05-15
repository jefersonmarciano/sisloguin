-- Criar a tabela system_settings se não existir
CREATE TABLE IF NOT EXISTS system_settings (
    id TEXT PRIMARY KEY,
    review_reset_hours INTEGER DEFAULT 6,
    wheel_reset_hours INTEGER DEFAULT 24,
    reviews_limit INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir configurações padrão se não existirem
INSERT INTO system_settings (id, review_reset_hours, wheel_reset_hours, reviews_limit)
VALUES ('default', 6, 24, 10)
ON CONFLICT (id) DO NOTHING;

-- Update the check_and_reset_timers function to reset wheels_remaining to 1 instead of 3
-- and properly handle the cooldown end times
CREATE OR REPLACE FUNCTION check_and_reset_timers()
RETURNS TRIGGER AS $$
DECLARE
    settings record;
    review_reset_hours INTEGER := 6; -- valor padrão
    wheel_reset_hours INTEGER := 24; -- valor padrão
BEGIN
    -- Tentar obter configurações do sistema com tratamento de erro
    BEGIN
        SELECT * INTO settings FROM system_settings WHERE id = 'default';
        IF FOUND THEN
            review_reset_hours := settings.review_reset_hours;
            wheel_reset_hours := settings.wheel_reset_hours;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Em caso de erro, usar valores padrão
            review_reset_hours := 6;
            wheel_reset_hours := 24;
    END;
    
    -- Verificar se a coluna like_cooldown_end existe, e se existir, usá-la para reset
    BEGIN
        IF TG_OP = 'UPDATE' AND NEW.like_cooldown_end IS NOT NULL AND NOW() >= NEW.like_cooldown_end THEN
            NEW.like_reviews_completed := 0;
            NEW.like_cooldown_end := NULL;
            RAISE NOTICE 'Cooldown de like terminou, contador reiniciado';
        -- Se não tiver a coluna de cooldown_end, usar a lógica antiga
        ELSIF NEW.last_like_review IS NOT NULL AND 
            (EXTRACT(EPOCH FROM (NOW() - NEW.last_like_review)) / 3600) >= review_reset_hours THEN
            NEW.like_reviews_completed := 0;
            RAISE NOTICE 'Cooldown de like terminou usando lógica antiga';
        END IF;
    EXCEPTION
        WHEN UNDEFINED_COLUMN THEN
            -- Usar lógica antiga se a coluna não existir
            IF NEW.last_like_review IS NOT NULL AND 
                (EXTRACT(EPOCH FROM (NOW() - NEW.last_like_review)) / 3600) >= review_reset_hours THEN
                NEW.like_reviews_completed := 0;
                RAISE NOTICE 'Coluna like_cooldown_end não existe, usando lógica antiga';
            END IF;
    END;
    
    -- Verificar se a coluna inspector_cooldown_end existe, e se existir, usá-la para reset
    BEGIN
        IF TG_OP = 'UPDATE' AND NEW.inspector_cooldown_end IS NOT NULL AND NOW() >= NEW.inspector_cooldown_end THEN
            NEW.inspector_reviews_completed := 0;
            NEW.inspector_cooldown_end := NULL;
            RAISE NOTICE 'Cooldown de inspector terminou, contador reiniciado';
        -- Se não tiver a coluna de cooldown_end, usar a lógica antiga
        ELSIF NEW.last_inspector_review IS NOT NULL AND 
            (EXTRACT(EPOCH FROM (NOW() - NEW.last_inspector_review)) / 3600) >= review_reset_hours THEN
            NEW.inspector_reviews_completed := 0;
            RAISE NOTICE 'Cooldown de inspector terminou usando lógica antiga';
        END IF;
    EXCEPTION
        WHEN UNDEFINED_COLUMN THEN
            -- Usar lógica antiga se a coluna não existir
            IF NEW.last_inspector_review IS NOT NULL AND 
                (EXTRACT(EPOCH FROM (NOW() - NEW.last_inspector_review)) / 3600) >= review_reset_hours THEN
                NEW.inspector_reviews_completed := 0;
                RAISE NOTICE 'Coluna inspector_cooldown_end não existe, usando lógica antiga';
            END IF;
    END;
    
    -- Verificar se a coluna wheel_cooldown_end existe, e se existir, usá-la para reset
    BEGIN
        IF TG_OP = 'UPDATE' AND NEW.wheel_cooldown_end IS NOT NULL AND NOW() >= NEW.wheel_cooldown_end THEN
            NEW.wheels_remaining := 1;
            NEW.wheel_cooldown_end := NULL;
            RAISE NOTICE 'Cooldown da roleta terminou, rodas reiniciadas';
        -- Se não tiver a coluna de cooldown_end, usar a lógica antiga
        ELSIF NEW.last_wheel_spin IS NOT NULL AND 
            (EXTRACT(EPOCH FROM (NOW() - NEW.last_wheel_spin)) / 3600) >= wheel_reset_hours THEN
            NEW.wheels_remaining := 1;
            RAISE NOTICE 'Cooldown da roleta terminou usando lógica antiga';
        END IF;
    EXCEPTION
        WHEN UNDEFINED_COLUMN THEN
            -- Usar lógica antiga se a coluna não existir
            IF NEW.last_wheel_spin IS NOT NULL AND 
                (EXTRACT(EPOCH FROM (NOW() - NEW.last_wheel_spin)) / 3600) >= wheel_reset_hours THEN
                NEW.wheels_remaining := 1;
                RAISE NOTICE 'Coluna wheel_cooldown_end não existe, usando lógica antiga';
            END IF;
    END;
    
    -- Verificar campos antigos só para compatibilidade
    IF TG_OP = 'UPDATE' AND (NEW.last_review_reset IS NULL OR 
       (EXTRACT(EPOCH FROM (NOW() - NEW.last_review_reset)) / 3600) >= review_reset_hours) THEN
        NEW.reviews_completed := 0;
        NEW.last_review_reset := NOW();
        RAISE NOTICE 'Reset geral baseado em last_review_reset';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update any existing user progress to have at most 1 wheel remaining
UPDATE user_progress
SET wheels_remaining = LEAST(wheels_remaining, 1)
WHERE wheels_remaining > 1;

-- Update the user_progress table definition to set the default value of wheels_remaining to 1
ALTER TABLE user_progress 
ALTER COLUMN wheels_remaining SET DEFAULT 1;

-- Make sure the system settings are correct for the wheel reset hours (24 hours)
UPDATE system_settings
SET wheel_reset_hours = 24
WHERE id = 'default'; 