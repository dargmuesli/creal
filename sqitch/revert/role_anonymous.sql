-- Revert creal:role_anonymous from pg

BEGIN;

DROP ROLE creal_anonymous;

COMMIT;
