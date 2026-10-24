-- Deploy creal:table_suggestion_behavior to pg
-- requires: table_suggestion

BEGIN;

COMMENT ON COLUMN creal.suggestion.id IS E'@behavior -insert\nThe record''s id.';
COMMENT ON COLUMN creal.suggestion.timestamp IS E'@behavior -insert\nIndicates at which time the record is suggested.';

COMMIT;
