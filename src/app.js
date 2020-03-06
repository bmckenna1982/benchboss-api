require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./config')

const MessageService = require('./message/message-services')

const scheduleRouter = require('./schedule/schedule-router')
const messageRouter = require('./message/message-router')
const commentRouter = require('./comment/comment-router')
const userRouter = require('./user/user-router')
const authRouter = require('./auth/auth-router')
const rsvpRouter = require('./rsvp/rsvp-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

app.use(morgan(morganOption))
app.use(express.json())
app.use(helmet())
app.use(cors())

// app.get('/', (req, res) => {
//   // res.send('Hello, world!')
//   res.json({ ok: true })
// })

app.get('/api/latest-message', (req, res) => {
  MessageService.getLatest(req.app.get('db'))
    .then(message => {
      if (!message) {
        return res.status(404).send('Latest message not found')
      }
      res.json(message)
    })

})

app.use('/api/schedule', scheduleRouter)
app.use('/api/message-board', messageRouter)
app.use('/api/comments', commentRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/rsvp', rsvpRouter)


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