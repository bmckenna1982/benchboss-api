const CommentService = require('../src/comment/comment-services')
const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe(`Comment service object`, () => {
  let db

  const { testUsers, testMessages, testComments } = helpers.makeMessagesFixtures()

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  after(() => db.destroy())

  describe(`POST /api/comments`, () => {
    // beforeEach(() => {
    //   return db
    //     .into('comment')
    //     .insert(testComments)
    // })

    beforeEach('insert data', () =>
      helpers.seedTables(db, testUsers, testMessages, testComments)
    )

    it(`creates a comment, responding with 201 and the new comment`, function () {
      // this.retries(3)
      const testMessage = testMessages[0]
      const testUser = testUsers[0]
      const newComment = {
        content: 'Test new comment',
        message_id: testMessage.id,
        author_id: testUser.id
      }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        // .set('Authorization', process.env.API_TOKEN)
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.content).to.eql(newComment.content)
          expect(res.body.message_id).to.eql(newComment.message_id)
          const expected_date = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actual_date = new Date(res.body.posted_date).toLocaleString()
          console.log('actual_date', res.body.posted_date)
          expect(actual_date).to.eql(expected_date)
          expect(res.body.author).to.eql({
            id: testUser.id,
            user_name: testUser.user_name,
            full_name: testUser.full_name
          })
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)

        })
      // .expect(res => 
      //   db)
    })

  })

})

module.exports = CommentService