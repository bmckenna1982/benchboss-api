BEGIN;

INSERT INTO message (content, title, author, postedDate)
  VALUES
     ('Message 1 content',
    'Message 1 title',
    'Message 1 author',
    '20200108T203000Z'
  ),
  (
    'Message 2 content',
    'Message 2 title',
    'Message 2 author',
    '20200109T203000Z'
  ),
  (
    'Message 3 content',
    'Message 3 title',
    'Message 3 author',
    '20200110T203000Z'
  );

INSERT INTO comment (content, author, postedDate, messageId)
  VALUES
    ('comment 1 content',
    'comment 1 author',
    '20200108T203000Z',
    1
  ),
  (
    'comment 2 content',
    'comment 2 author',
    '20200109T203000Z',
    1
  ),
  (
    'comment 3 content',
    'comment 3 author',
    '20200110T203000Z',
    2
  ),
  (
    'comment 4 content',
    'comment 4 author',
    '20200111T203000Z',
    3
  );

  COMMIT;