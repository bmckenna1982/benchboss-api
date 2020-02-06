TRUNCATE message RESTART IDENTITY CASCADE;

INSERT INTO message (content, title, author_id, posted_date)
  VALUES
     ('Message 1 content',
    'Message 1 title',
    1,
    '20200108T203000Z'
  ),
  (
    'Message 2 content',
    'Message 2 title',
    1,
    '20200109T203000Z'
  ),
  (
    'Message 3 content',
    'Message 3 title',
    1,
    '20200110T203000Z'
  );
