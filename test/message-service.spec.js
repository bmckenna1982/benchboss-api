const MessageService = require('../src/message/message-services')
const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe('Message service object', () => {
  let db

  const {
    testUsers,
    testMessages,
    testComments
  } = helpers.makeMessagesFixtures()
  const testUser = testUsers[0]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  after('disconnect from database', () => db.destroy())

  context(`Given 'message' has data`, () => {
    // beforeEach(() => {
    //   return db
    //     .into('message')
    //     .insert(testMessageBoard)
    // })
    beforeEach('insert data', () =>
      helpers.seedTables(db, testUsers, testMessages, testComments)
    )

    it(`getAllMessages() resolves all messages from 'message' table`, () => {
      const expectedMessages = testMessages.map(message =>
        helpers.makeExpectedMessage(testUsers, message, testComments)
      )

      return supertest(app)
        .get('/api/message-board')
        .expect(200, expectedMessages)
      // return MessageService.getAllMessages(db)
      //   .then(allMessages => {
      //     expect(allMessages).to.eql(
      //       testMessageBoard.map(message => (
      //         {
      //           author: author,
      //           content: message.content,
      //           id: message.id,
      //           number_of_comments: "0",
      //           posted_date: new Date(message.posted_date),
      //           title: message.title
      //         }
      //       ))
      //     )
      // })
    })

    it(`getById() resolves a message by id from 'message' table`, () => {
      const messageId = 2
      // const testMessage = testMessageBoard[messageId - 1]
      const expectedMessage = helpers.makeExpectedMessage(testUsers, testMessages[messageId - 1], testComments)
      return supertest(app)
        .get(`/api/message-board/${messageId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, expectedMessage)

      // return MessageService.getById(db, messageId)
      //   .then(actual => {
      //     expect(actual).to.eql({
      //       author: author,
      //       content: testMessage.content,
      //       id: testMessage.id,
      //       number_of_comments: "0",
      //       posted_date: new Date(testMessage.posted_date),
      //       title: testMessage.title
      //     })
      //   })
    })

    it(`getCommentsForMessage() from 'comment' table`, () => {
      const messageId = 1
      const expectedComments = helpers.makeExpectedMessageComments(testUsers, messageId, testComments)
      // console.log('expectedComments', expectedComments)
      return supertest(app)
        .get(`/api/message-board/${messageId}/comments`)
        .expect(200, expectedComments)
    })

  })

  context(`Given 'message' has no data`, () => {

    it(`getAllMessages() resolves an empty array`, () => {
      return MessageService.getAllMessages(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
  })
})