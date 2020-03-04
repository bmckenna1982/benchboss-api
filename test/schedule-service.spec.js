const ScheduleService = require('../src/schedule/schedule-services')
const knex = require('knex')
const helpers = require('./test-helpers')

describe.only(`Schedule service object`, () => {
  let db

  const { testUsers, testRsvp, testSchedule, testMessages, testComments } = helpers.makeMessagesFixtures()

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  })


  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  after('disconnect from db', () => db.destroy())

  context(`Given 'schedule' has data`, () => {
    beforeEach(() => {
      return db
        .into('schedule')
        .insert(testSchedule)
    })

    beforeEach('insert data', () =>
      helpers.seedTables(db, testUsers, testMessages, testComments, testRsvp)
    )

    it(`getFullSchedule() resolves all games from 'schedule' table`, () => {
      return ScheduleService.getFullSchedule(db)
        .then(actual => {
          actual.map(g => ({
            ...actual,
            time: new Date(actual.time)
          }))
          console.log('actual', actual)
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
    it(`getRsvp() resolves game rsvp status from 'rsvp' table`, () => {
      // before(() => {
      //   helpers.seedUsers(
      //     db,
      //     testUsers
      //   )
      // })

      // beforeEach('insert data', () =>
      //   helpers.seedTables(db, testUsers, testMessages, testComments, testRsvp)
      // )

      const gameId = 1
      const expectedRsvp = testRsvp.filter(gstatus => gstatus.game_id === gameId).map(status =>
        helpers.makeExpectedRsvp(
          testUsers,
          status,
        ))
      return ScheduleService.getRsvp(db, gameId)
        .then(actual => {
          expect(actual).to.eql(expectedRsvp)
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