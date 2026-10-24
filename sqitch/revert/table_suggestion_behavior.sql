-- Revert creal:table_suggestion_behavior from pg

BEGIN;

COMMENT ON COLUMN creal.suggestion.id IS E'@omit create\nThe record''s id.';
COMMENT ON COLUMN creal.suggestion.timestamp IS E'@omit create\nIndicates at which time the record is suggested.';

COMMIT;
