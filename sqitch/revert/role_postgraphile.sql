-- Revert creal:role_postgraphile from pg

BEGIN;

DROP OWNED BY creal_postgraphile;
DROP ROLE creal_postgraphile;

COMMIT;
