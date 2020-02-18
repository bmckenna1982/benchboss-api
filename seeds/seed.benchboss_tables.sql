BEGIN;

TRUNCATE
  schedule,
  comment,
  message,
  rsvp,
  benchboss_user
  RESTART IDENTITY CASCADE;

INSERT INTO schedule (summary, location, time)
  VALUES
    (
      'Gremlins at Guinness', 
      'The Cooler (Red)', 
      '20191208T203000Z'
    ),
    (
      'Clyde at Guinness',
      'Sandy Springs',
      '20191220T013000Z'
    ),
    (
      'Guinness at Redwings',
      'The Cooler (Red)',
      '20200113T014500Z'    
    ),
    (
      'Guinness at Average Joes',
      'The Cooler (Red)',
      '20200120T014500Z'
    ),
    (
      'Guinness at Cossacks',
      'Sandy Springs',
      '20200124T031000Z'
    ),
    (
      'Victorious Secret at Guinness',
      'Sandy Springs',
      '20200130T031000Z'
    ),
    (
      'Guinness at Hitmen',
      'IceComplex',
      '20200207T021000Z'
    ),
    (
      'Guinness at Gremlins',
      'Sandy Springs',
      '20200213T013000Z'
    ),
    (
      'Guinness at Clyde',
      'The Cooler (Red)',
      '20200223T203000Z'
    ),
    (
      'Redwings at Guinness',
      'IceComplex',
      '20200302T000000Z'
    ),
    (
      'Average Joes at Guinness',
      'IceComplex',
      '20200306T013000Z'
    ),
    (
      'Cossacks at Guinness',
      'IceComplex',
      '20200315T194000Z'
    ),
    (
      'Guinness at Victorious Secret',
      'The Cooler (Red)',
      '20200322T230000Z'
    ),
    (
      'Hitmen at Guinness',
      'Sandy Springs',
      '20200328T225000Z'
    ),
    (
      'Guinness at Gremlins',
      'IceComplex',
      '20200405T212000Z'
    ),
    (
      'Guinness at Clyde',
      'Sandy Springs',
      '20200410T003000Z'
    ),
    (
      'Redwings at Guinness',
      'Sandy Springs',
      '20200419T230000Z'
    ),
    (
      'Average Joes at Guinness',
      'IceComplex',
      '20200427T004000Z'
    ),
    (
      'Cossacks at Guinness',
      'The Cooler (Red)',
      '20200502T193000Z'
    ),
    (
    'Guinness at Victorious Secret',
      'IceComplex',
      '20200509T212000Z'
    );


INSERT INTO benchboss_user (user_name, full_name, password)
  VALUES
    ('bmckenna1982@gmail.com', 'Brian McKenna', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('mitchgianoni@yahoo.com', 'Mitch Gianoni', '$2a$12$0N.jshW8ITIZTbXnWDvPpe4YnjW7VFFYbJESTtGLLxRYosBEGLQVC'),
    ('demo1@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo2@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo3@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo4@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo5@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo6@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo7@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo8@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo9@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo10@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK'),
    ('demo11@gmail.com', 'Demo User', '$2a$12$C29oksTbdcB/fqSAp4.ILuaH2RIdcaHBTiqaZJqQG/AjNaBrjfneK');

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

INSERT INTO comment (content, author_id, posted_date, message_id)
  VALUES
    ('comment 1 content',
    1,
    '20200108T203000Z',
    1
  ),
  (
    'comment 2 content',
    1,
    '20200109T203000Z',
    1
  ),
  (
    'comment 3 content',
    1,
    '20200110T203000Z',
    2
  ),
  (
    'comment 4 content',
    1,
    '20200111T203000Z',
    3
  );

INSERT INTO rsvp (game_id, user_id, game_status )
  VALUES
    (
      1,
      1,
      'in'
    ),
    (
      1,
      2,
      'in'
    ),
    (
      1,
      3,
      'out'
    ),
    (
      1,
      4,
      'in'
    ),
    (
      1,
      5,
      'maybe'
    ),
    (
      1,
      6,
      'in'
    ),
    (
      1,
      7,
      'out'
    );

COMMIT;