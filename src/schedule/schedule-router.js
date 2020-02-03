const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const scheduleRouter = express.Router()
const bodyParser = express.json()

const schedule = require('../schedule-data')

scheduleRouter
  .route('/schedule')
  .get((req, res) => {
    res.json(schedule)
  })
  .post(bodyParser, (req, res) => {
    const { opponent, status, location, time } = req.body

    if (!opponent || !status || !location || !time) {
      return res.status(400).send('Invalid data')
    }

    const summary = (status === 'home')
      ? `${opponent} at Guinness`
      : `Guinness at ${opponent}`

    const id = uuid()

    const game = {
      id,
      summary,
      location,
      time,
    }

    console.log(game)
    schedule.push(game)

    res
      .status(201)
      .location(`https://localhost:8000/schedule/${id}`)
      .json(game)
  })

scheduleRouter
  .route('/schedule/:gameId')
  .get((req, res) => {
    const { gameId } = req.params
    const game = schedule.find(g => g.id == gameId)

    if (!game) {
      return res.status(404).send('Game not found')
    }

    res.json(game)
  })

module.exports = scheduleRouter