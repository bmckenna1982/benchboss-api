require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const schedule = require('./schedule-data')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())



app.get('/', (req, res) => {
  res.send('Hello, world!')
  // res.json({ok: true})
})

app.get('/schedule', (req, res) => {
  // const { search = ""} = req.query;

  // let results = schedule.filter(game => game.)
  res.json(schedule)
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app