const ScheduleServices = require('../src/schedule/schedule-services')
const knex = require('knex')

describe(`Schedule service object`, () => {
  let db

  let testSchedule = [
    {
      id: 1,
      summary: 'Test game 1 summary',
      location: 'IceComplex',
      time: new Date('2020-02-06T20:00:00.000Z')
    },
    {
      id: 2,
      summary: 'Test game 2 summary',
      location: 'IceComplex',
      time: new Date('2020-02-09T16:00:00.000Z')
    },
    {
      id: 3,
      summary: 'Test game 2 summary',
      location: 'Sandy Springs',
      time: new Date('2020-02-16T18:00:00.000Z')
    },
  ]
  console.log('testSchedule[0].time', testSchedule[0].time)

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('schedule').truncate())

  afterEach(() => db('schedule').truncate())

  after(() => db.destroy())

  context(`Given 'schedule' has data`, () => {
    beforeEach(() => {
      return db
        .into('schedule')
        .insert(testSchedule)
    })

    it(`getFullSchedule() resolves all games from 'schedule' table`, () => {
      return ScheduleServices.getFullSchedule(db)
        .then(actual => {
          expect(actual).to.eql(testSchedule.map(game => ({
            ...game,
            time: new Date(game.time)
          })))
        })
    })

    it(`getById() resolves a game by id from 'schedule' table`, () =>{
      const gameId = 3
      // const thirdTestGame = testSchedule[gameId - 1]
      return ScheduleServices.getById(db, gameId)
        .then(actual => { 
          expect(actual).to.eql(testSchedule[gameId - 1])
        })
    })
  })

  context(`Given 'schedule' has data`, () => {
    it(`getFullSchedule() resolves an empty array`, () => {
      return ScheduleServices.getFullSchedule(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })


  })



})