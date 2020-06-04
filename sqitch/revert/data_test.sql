-- Revert creal:data_test from pg

BEGIN;

DELETE FROM creal.suggestion;

COMMIT;
