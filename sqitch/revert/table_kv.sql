-- Revert creal:table_kv from pg

BEGIN;

DROP TABLE creal.kv;

COMMIT;