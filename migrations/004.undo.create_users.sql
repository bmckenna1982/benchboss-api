ALTER TABLE message
  DROP COLUMN IF EXISTS authorid;

ALTER TABLE message
  ADD COLUMN
    author TEXT;

ALTER TABLE comment
  DROP COLUMN IF EXISTS authorid;

ALTER TABLE comment
  ADD COLUMN
    author TEXT;

DROP TABLE IF EXISTS benchboss_user;

