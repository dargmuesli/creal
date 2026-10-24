-- Verify creal:table_suggestion_behavior on pg

BEGIN;

DO $$
BEGIN
   IF NOT EXISTS (
     SELECT
     FROM pg_catalog.pg_attribute
     WHERE attrelid = 'creal.suggestion'::regclass
       AND attname = 'id'
       AND col_description(attrelid, attnum) LIKE '%@behavior -insert%'
   ) THEN
     RAISE EXCEPTION 'creal.suggestion.id is missing the @behavior -insert tag';
   END IF;

   IF NOT EXISTS (
     SELECT
     FROM pg_catalog.pg_attribute
     WHERE attrelid = 'creal.suggestion'::regclass
       AND attname = 'timestamp'
       AND col_description(attrelid, attnum) LIKE '%@behavior -insert%'
   ) THEN
     RAISE EXCEPTION 'creal.suggestion.timestamp is missing the @behavior -insert tag';
   END IF;
END $$;

ROLLBACK;
