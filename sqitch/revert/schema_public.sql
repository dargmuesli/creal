-- Revert creal:schema_public from pg

BEGIN;

DROP SCHEMA creal;

COMMIT;
