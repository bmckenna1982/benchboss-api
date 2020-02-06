const ScheduleService = require('../src/schedule/schedule-services')
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

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
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
      return ScheduleService.getFullSchedule(db)
        .then(actual => {
          expect(actual).to.eql(testSchedule.map(game => ({
            ...game,
            time: new Date(game.time)
          })))
        })
    })

    it(`getById() resolves a game by id from 'schedule' table`, () => {
      const gameId = 3
      // const thirdTestGame = testSchedule[gameId - 1]
      return ScheduleService.getById(db, gameId)
        .then(actual => {
          expect(actual).to.eql(testSchedule[gameId - 1])
        })
    })

    it(`deleteGame() removes a game by if from 'schedule' table`, () => {
      const gameId = 3
      return ScheduleService.deleteGame(db, gameId)
        .then(() => ScheduleService.getFullSchedule(db))
        .then(allGames => {
          expect(allGames).to.eql(testSchedule.filter(game => game.id !== gameId))
        })
    })
    it(`updateGame() updates a game from 'schedule' and resolves`, () => {
      const idOfGameToUpdate = 3
      const newGame = {
        summary: 'Good guys vs Bad Guys',
        location: 'Sandy Springs',
        time: new Date('2020-02-04T10:00:00.000Z')
      }
      return ScheduleService.updateGame(db, idOfGameToUpdate, newGame)
        .then(() => ScheduleService.getById(db, idOfGameToUpdate))
        .then(game => {
          expect(game).to.eql({
            id: idOfGameToUpdate,
            ...newGame
          })
        })
    })

  })

  context(`Given 'schedule' has no data`, () => {
    it(`getFullSchedule() resolves an empty array`, () => {
      return ScheduleService.getFullSchedule(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertGame() inserts a new game and resolves the new game with an 'id'`, () => {
      const newGame = {
        summary: 'Good guys vs Bad Guys',
        location: 'Sandy Springs',
        time: new Date('2020-02-04T10:00:00.000Z')
      }
      return ScheduleService.insertGame(db, newGame)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            summary: newGame.summary,
            location: newGame.location,
            time: new Date(newGame.time)
          })
        })
    })

  })



})