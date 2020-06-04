-- Verify creal:table_kv on pg

BEGIN;

SELECT "key",
       "value"
FROM creal.kv WHERE FALSE;

DO $$
BEGIN
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.kv', 'SELECT'));
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.kv', 'INSERT'));
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.kv', 'UPDATE'));
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.kv', 'DELETE'));
END $$;

ROLLBACK;