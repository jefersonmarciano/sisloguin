-- Script para corrigir o problema da Lucky Wheel permitindo mais de um giro por dia
-- O problema ocorre porque o cooldown não está sendo adequadamente persistido

-- 1. Garantir que o campo wheel_cooldown_end seja atualizado corretamente quando o usuário girar a roleta
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

-- Criar um trigger específico para a roleta
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

-- 2. Garantir que os usuários que já usaram a roleta hoje não possam usá-la novamente
UPDATE user_progress
SET wheel_cooldown_end = (last_wheel_spin + INTERVAL '24 hours')
WHERE wheels_remaining = 0 
  AND last_wheel_spin IS NOT NULL 
  AND (wheel_cooldown_end IS NULL OR wheel_cooldown_end < last_wheel_spin + INTERVAL '24 hours')
  AND last_wheel_spin > NOW() - INTERVAL '24 hours';

-- 3. Corrigir quaisquer usuários que tenham wheels_remaining incorreto
UPDATE user_progress
SET wheels_remaining = 0
WHERE wheels_remaining > 0 
  AND last_wheel_spin IS NOT NULL 
  AND last_wheel_spin > NOW() - INTERVAL '24 hours';

-- 4. Resetar o contador para usuários cujo cooldown já terminou
UPDATE user_progress
SET wheels_remaining = 1,
    wheel_cooldown_end = NULL
WHERE wheel_cooldown_end IS NOT NULL 
  AND NOW() >= wheel_cooldown_end;

-- Fim do script 