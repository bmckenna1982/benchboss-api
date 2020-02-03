const ScheduleServices = require('../src/services/schedule-services')
const knex = require('knex')

describe(`Schedule service object`, () => {
  let db

  let testSchedule = [
    {
      summary: 'Test game 1 summary',
      location: 'IceComplex',
      time: '20200206T200000Z'
    },
    {
      summary: 'Test game 2 summary',
      location: 'IceComplex',
      time: '20200209T160000Z'
    },
    {
      summary: 'Test game 2 summary',
      location: 'Sandy Springs',
      time: '20200216T180000Z'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => {
    return db
      .into('schedule')
      .insert(testSchedule)
  })

  after(() => db.destroy())

  describe(`getFullSchedule()`, () => {
    it(`resolves all games from 'schedule' table`, () => {
      //test that ScheduleServices.getFullSchedule gets all games
    })
  })
  
  
})