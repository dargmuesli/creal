-- Verify creal:role_anonymous on pg

BEGIN;

DO $$
BEGIN
   ASSERT (SELECT pg_catalog.pg_has_role('creal_postgraphile', 'creal_anonymous', 'USAGE'));
   -- Other accounts might not exist yet for a NOT-check.
END $$;

ROLLBACK;
