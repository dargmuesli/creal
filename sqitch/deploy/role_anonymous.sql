-- Deploy creal:role_anonymous to pg
-- requires: role_postgraphile

BEGIN;

CREATE ROLE creal_anonymous;

COMMENT ON ROLE creal_anonymous IS 'The public role.';

GRANT creal_anonymous to creal_postgraphile;

COMMIT;
