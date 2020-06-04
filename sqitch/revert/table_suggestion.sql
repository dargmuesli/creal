-- Revert creal:table_suggestion from pg

BEGIN;

DROP TABLE creal.suggestion;

COMMIT;