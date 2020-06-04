-- Deploy creal:schema_public to pg
-- requires: role_anonymous

BEGIN;

CREATE SCHEMA creal;

COMMENT ON SCHEMA creal IS 'The public schema.';

GRANT USAGE ON SCHEMA creal TO creal_anonymous;

COMMIT;
