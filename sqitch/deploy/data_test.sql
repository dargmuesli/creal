-- Deploy creal:data_test to pg

BEGIN;

INSERT INTO creal.suggestion (
    "title",
    "artist",
    "ip"
    ) VALUES (
        'Song Title',
        'Song Artist',
        '1.2.3.4'
    );
INSERT INTO creal.suggestion (
    "title",
    "artist",
    "comment",
    "ip"
    ) VALUES (
        'Song Title',
        'Song Artist',
        'BlaBlaBla',
        '0.0.0.0'
    );

COMMIT;
