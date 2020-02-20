const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`Rsvp Endpoints`, function () {
  let db

  const { testUsers, testMessages, testComments, testRsvp, testSchedule } = helpers.makeMessagesFixtures()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe.only(`POST /api/rsvp`, () => {
    beforeEach(() => {
      return db
        .into('schedule')
        .insert(testSchedule)
    })
    beforeEach('insert data', () =>
      helpers.seedTables(db, testUsers, testMessages, testComments, testRsvp)
    )
    it(`creates the rsvp in 'rsvp' table and responds 201 and the rsvp`, () => {
      this.retries(3)
      const testUserRsvp = testUsers[3]
      const newRsvp = {
        game_id: 1,
        user_id: 4,
        game_status: 'in'
      }
      return supertest(app)
        .post('/api/rsvp')
        .set('Authorization', helpers.makeAuthHeader(testUserRsvp))
        .send(newRsvp)
        .expect(201)
        .expect(res => {
          console.log('res.body', res.body)
          expect(res.body).to.have.property('id')
          expect(res.body.game_status).to.eql(newRsvp.game_status)
          expect(res.body.game_id).to.eql(newRsvp.game_id)
          expect(res.body.user.id).to.eql(testUserRsvp.id)
          expect(res.headers.location).to.eql(`/api/rsvp/${res.body.id}`)
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actualDate = new Date(res.body.response_date).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })

    })
  })
})