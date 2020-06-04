-- Deploy creal:table_suggestion to pg
-- requires: schema_public
-- requires: role_anonymous
-- requires: table_kv

BEGIN;

CREATE TABLE creal.suggestion (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT CHECK (char_length("title") < 100) NOT NULL,
    "artist" TEXT CHECK (char_length("artist") < 100) NOT NULL,
    "comment" TEXT CHECK (char_length("comment") < 250),
    "ip" INET NOT NULL,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE creal.suggestion IS 'A song suggestion.';
COMMENT ON COLUMN creal.suggestion.id IS 'The record''s id.';
COMMENT ON COLUMN creal.suggestion.title IS 'The suggestion''s title.';
COMMENT ON COLUMN creal.suggestion.artist IS 'The suggestion''s artist name.';
COMMENT ON COLUMN creal.suggestion.comment IS 'A comment on the suggestion.';
COMMENT ON COLUMN creal.suggestion.ip IS 'The ip address from which the suggestion originates.';
COMMENT ON COLUMN creal.suggestion.timestamp IS 'Indicates at which time the record is suggested.';

GRANT INSERT ON TABLE creal.suggestion TO creal_anonymous;

ALTER TABLE creal.suggestion ENABLE ROW LEVEL SECURITY;

-- Display the contact that is linked to the own account.
-- Display contacts that are accessible via contact invites.
CREATE POLICY suggestion_insert ON creal.suggestion FOR INSERT WITH CHECK (
    (SELECT COUNT(*) FROM creal.suggestion WHERE suggestion.ip = "ip" AND suggestion.timestamp > NOW() - interval '1d')
    <=
    (SELECT "value" FROM creal.kv WHERE "key" = 'SUGGESTION_LIMIT_DAYUSER')::INTEGER
);

COMMIT;