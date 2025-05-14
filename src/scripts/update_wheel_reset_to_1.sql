-- Update the check_and_reset_timers function to reset wheels_remaining to 1 instead of 3
CREATE OR REPLACE FUNCTION check_and_reset_timers()
RETURNS TRIGGER AS $$
DECLARE
    settings record;
BEGIN
    -- Obter configurações do sistema
    SELECT * INTO settings FROM system_settings WHERE id = 'default';
    
    -- Verificar e resetar contador de avaliações
    IF NEW.last_review_reset IS NULL OR 
       (EXTRACT(EPOCH FROM (NOW() - NEW.last_review_reset)) / 3600) >= settings.review_reset_hours THEN
        NEW.reviews_completed := 0;
        NEW.like_reviews_completed := 0;
        NEW.inspector_reviews_completed := 0;
        NEW.last_review_reset := NOW();
    END IF;
    
    -- Verificar e resetar contador de rodas da sorte (now set to 1 per day)
    IF NEW.last_wheel_spin IS NULL OR 
       (EXTRACT(EPOCH FROM (NOW() - NEW.last_wheel_spin)) / 3600) >= settings.wheel_reset_hours THEN
        NEW.wheels_remaining := 1;
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