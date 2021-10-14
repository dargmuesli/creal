-- Deploy creal:table_suggestion to pg
-- requires: schema_public
-- requires: role_anonymous

BEGIN;

CREATE TABLE creal.suggestion (
    "id" SERIAL PRIMARY KEY,
    "artist" TEXT CHECK (char_length("artist") > 0 AND char_length("artist") < 100) NOT NULL,
    "comment" TEXT CHECK (char_length("comment") < 250),
    "timestamp" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "title" TEXT CHECK (char_length("title") > 0 AND char_length("title") < 100) NOT NULL,
    "url" TEXT CHECK (char_length("url") < 200 AND "url" ~ '^https:\/\/')
);

COMMENT ON TABLE creal.suggestion IS 'A song suggestion.';
COMMENT ON COLUMN creal.suggestion.id IS E'@omit create\nThe record''s id.';
COMMENT ON COLUMN creal.suggestion.artist IS 'The suggestion''s artist name.';
COMMENT ON COLUMN creal.suggestion.comment IS 'A comment on the suggestion.';
COMMENT ON COLUMN creal.suggestion.timestamp IS E'@omit create\nIndicates at which time the record is suggested.';
COMMENT ON COLUMN creal.suggestion.title IS 'The suggestion''s title.';
COMMENT ON COLUMN creal.suggestion.url IS 'The suggestion''s url.';

GRANT SELECT, INSERT ON TABLE creal.suggestion TO creal_anonymous;
GRANT USAGE ON SEQUENCE creal.suggestion_id_seq TO creal_anonymous;

COMMIT;