-- Deploy creal:role_postgraphile to pg

BEGIN;

\set role-creal-postgraphile-password `cat /run/secrets/postgres-role-creal-postgraphile-password`
CREATE ROLE creal_postgraphile LOGIN PASSWORD :'role-creal-postgraphile-password';

COMMENT ON ROLE creal_postgraphile IS 'PostGraphile''s role.';

COMMIT;
