-- Verify creal:table_suggestion on pg

BEGIN;

SELECT "id",
       "title",
       "artist",
       "comment",
       "ip",
       "timestamp"
FROM creal.suggestion WHERE FALSE;

DO $$
BEGIN
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.suggestion', 'SELECT'));
   ASSERT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.suggestion', 'INSERT'));
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.suggestion', 'UPDATE'));
   ASSERT NOT (SELECT pg_catalog.has_table_privilege('creal_anonymous', 'creal.suggestion', 'DELETE'));
END $$;

ROLLBACK;