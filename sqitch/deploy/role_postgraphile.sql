-- Deploy creal:role_postgraphile to pg

BEGIN;

\set role_creal_postgraphile_password `cat /run/secrets/postgres_role_creal_postgraphile_password`
CREATE ROLE creal_postgraphile LOGIN PASSWORD :'role_creal_postgraphile_password';

COMMENT ON ROLE creal_postgraphile IS 'PostGraphile''s role.';

COMMIT;
