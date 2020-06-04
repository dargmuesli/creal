-- Verify creal:schema_public on pg

BEGIN;

DO $$
BEGIN
   ASSERT (SELECT pg_catalog.has_schema_privilege('creal_anonymous', 'creal', 'USAGE'));
END $$;

ROLLBACK;
