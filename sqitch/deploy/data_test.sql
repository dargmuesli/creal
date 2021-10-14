-- Deploy creal:data_test to pg

BEGIN;

INSERT INTO creal.suggestion (
    "title",
    "artist"
    ) VALUES (
        'Song Title',
        'Song Artist'
    );
INSERT INTO creal.suggestion (
    "title",
    "artist",
    "comment"
    ) VALUES (
        'Song Title',
        'Song Artist',
        'BlaBlaBla'
    );

COMMIT;
