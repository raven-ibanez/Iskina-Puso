/*
  # Add Supabase Cron Jobs

  1. Extensions
    - Enable `pg_cron` extension for scheduling tasks.

  2. Procedures
    - `handle_expired_discounts`: Automatically deactivates discounts that have reached their end date.

  3. Schedules
    - Runs `handle_expired_discounts` every hour.
*/

-- Enable pg_cron extension
-- Note: In Supabase, pg_cron is usually pre-installed but needs to be enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create procedure to handle expired discounts
CREATE OR REPLACE PROCEDURE handle_expired_discounts()
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE menu_items
  SET discount_active = false
  WHERE discount_active = true
    AND discount_end_date IS NOT NULL
    AND discount_end_date < now();
END;
$$;

-- Schedule the job to run every hour
-- We use cron.schedule to run the procedure
SELECT cron.schedule(
  'deactivate-expired-discounts', -- name of the job
  '0 * * * *',                   -- every hour (on the hour)
  'CALL handle_expired_discounts()'
);
