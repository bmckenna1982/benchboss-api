const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeMessagesArray(users) {
  return [
    {
      id: 1,
      title: 'First test post!',      
      author_id: users[0].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      title: 'Second test post!',      
      author_id: users[1].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      title: 'Third test post!',      
      author_id: users[2].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 4,
      title: 'Fourth test post!',      
      author_id: users[3].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}

function makeCommentsArray(users, messages) {
  return [
    {
      id: 1,
      content: 'First test comment!',
      message_id: messages[0].id,
      author_id: users[0].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      content: 'Second test comment!',
      message_id: messages[0].id,
      author_id: users[1].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      content: 'Third test comment!',
      message_id: messages[0].id,
      author_id: users[2].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      content: 'Fourth test comment!',
      message_id: messages[0].id,
      author_id: users[3].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 5,
      content: 'Fifth test comment!',
      message_id: messages[messages.length - 1].id,
      author_id: users[0].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      content: 'Sixth test comment!',
      message_id: messages[messages.length - 1].id,
      author_id: users[2].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      content: 'Seventh test comment!',
      message_id: messages[3].id,
      author_id: users[0].id,
      posted_date: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedMessage(users, message, comments=[]) {
  const author = users
    .find(user => user.id === message.author_id)

  const number_of_comments = comments
    .filter(comment => comment.message_id === message.id)
    .length.toString()

  return {
    id: message.id,
    title: message.title,
    content: message.content,
    posted_date: message.posted_date.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      date_created: author.date_created.toISOString().slice(0, author.date_created.toISOString().length - 1),
    },
  }
}

function makeExpectedMessageComments(users, messageId, comments) {
  
  const expectedComments = comments
  .filter(comment => comment.message_id === messageId)  
  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.author_id)
    return {
      id: comment.id,
      content: comment.content,
      posted_date: comment.posted_date.toISOString(),
      // message_id: comment.message_id,
      author: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        // date_created: commentUser.date_created.toISOString(),
        // date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMessagesFixtures() {
  const testUsers = makeUsersArray()
  const testMessages = makeMessagesArray(testUsers)
  const testComments = makeCommentsArray(testUsers, testMessages)
  return { testUsers, testMessages, testComments }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        message,
        benchboss_user,
        comment
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE message_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE benchboss_user_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE comment_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('message_id_seq', 0)`),
        trx.raw(`SELECT setval('benchboss_user_id_seq', 0)`),
        trx.raw(`SELECT setval('comment_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('benchboss_user').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('benchboss_user_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedTables(db, users, messages, comments = []) {
  // return db
  //   .into('benchboss_user')
  //   .insert(users)
  //   .then(() =>
  //     db
  //       .into('message')
  //       .insert(messages)
  //   )
  //   .then(() =>
  //     comments.length && db.into('comment').insert(comments)
  //   )
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('message').insert(messages)
    await trx.raw(
      `SELECT setval('message_id_seq', ?)`,
      [messages[messages.length - 1].id],
    )    
    console.log('comments', comments.length)
    if (comments.length) {
      await trx.into('comment').insert(comments)
      await trx.raw(
        `SELECT setval('comment_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeMessagesArray,
  makeExpectedMessage,
  makeExpectedMessageComments, 
  makeCommentsArray, 
  makeMessagesFixtures,
  cleanTables,
  seedTables,
  seedUsers,
  makeAuthHeader  
}