const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const ScheduleService = require('./schedule-services')

const scheduleRouter = express.Router()
const bodyParser = express.json()

const schedule = require('../schedule-data')

scheduleRouter
  .route('/')
  .get((req, res) => {
    ScheduleService.getFullSchedule(req.app.get('db'))
      .then(games => {
        res.json(games)
      })
    // res.json(schedule)
  })
  .post(bodyParser, (req, res) => {
    const { opponent, status, location, time } = req.body

    if (!opponent || !status || !location || !time) {
      return res.status(400).send('Invalid data')
    }

    const summary = (status === 'home')
      ? `${opponent} at Guinness`
      : `Guinness at ${opponent}`

    // const id = uuid()

    const newGame = {
      // id,
      summary,
      location,
      time,
    }

    ScheduleService.insertGame(req.app.get('db'), newGame)
      .then(game =>
        res
          .status(201)
          .location(`https://localhost:8000/api/schedule/${game.id}`)
          .json(game)
      )
  })

scheduleRouter
  .route('/:gameId')
  .get((req, res) => {
    ScheduleService.getById(req.app.get('db'), req.params.gameId)
      .then(game => {
        console.log('game', game)

        if (!game) {
          return res.status(404).send('Game not found')
        }

        res.json(game)
      })

  })

module.exports = scheduleRouter