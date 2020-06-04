-- Deploy creal:table_kv to pg
-- requires: schema_public

BEGIN;

CREATE TABLE creal.kv (
    "key" TEXT UNIQUE,
    "value" TEXT
);

COMMENT ON TABLE creal.kv IS 'A key value store.';
COMMENT ON COLUMN creal.kv.key IS 'The key.';
COMMENT ON COLUMN creal.kv.value IS 'A value.';

ALTER TABLE creal.kv ENABLE ROW LEVEL SECURITY;

INSERT INTO creal.kv ("key", "value") VALUES ('SUGGESTION_LIMIT_DAYUSER', '20');

COMMIT;