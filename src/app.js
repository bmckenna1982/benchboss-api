const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./config')

const scheduleRouter = require('./schedule/schedule-router')
const messageRouter = require('./message/message-router')
const commentRouter = require('./comment/comment-router')
const userRouter = require('./user/user-router')

// const schedule = require('./schedule-data')
// const messages = require('./message-data')
// const comments = require('./comment-data')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

app.use(morgan(morganOption))
app.use(express.json())
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    console.log('authToken', authToken)
    console.log('apiToken', apiToken)
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/', (req, res) => {
  // res.send('Hello, world!')
  res.json({ ok: true })
})


app.use('/api/schedule', scheduleRouter)
app.use('/api/message-board', messageRouter)
app.use('/api/comments', commentRouter)
app.use('/api/users', userRouter)

// app.get('/schedule', (req, res) => {
//   // const { search = ""} = req.query;

//   // let results = schedule.filter(game => game.)
//   res.json(schedule)
// })

// app.get('/schedule/:gameId', (req, res) => {
//   const { gameId } = req.params
//   const game = schedule.find(g => g.id == gameId)

//   if (!game) {
//     return res.status(404).send('Game not found')
//   }

//   res.json(game)
// })

// app.get('/message-board', (req, res) => {
//   // const { search = ""} = req.query;

//   // let results = schedule.filter(game => game.)
//   res.json(messages)
// })

// app.get('/message-board/:messageId', (req, res) => {
//   const { messageId } = req.params
//   const message = messages.find(m => m.id == messageId)

//   if (!message) {
//     return res.status(404).send('Message not found')
//   }

//   //*** Get comments here as well?? */
//   res.json(message)
// })

// app.get('/message-board/:messageId/comments', (req, res) => {
//   const { messageId } = req.params;
//   console.log('messageId', messageId)
//   const commentsArray = comments.filter(c => c.messageId == messageId)
//   console.log('commentsArray', commentsArray)
//   res.json(commentsArray)
// })

// app.post('/message-board', (req, res) => {
//   const { title, content } = req.body
//   console.log('req.body', req.body)
//   if (!title) {
//     return res.status(400).send('Invalid data')
//   }
//   if (!content) {
//     return res.status(400).send('Invalid data')
//   }

//   const id = uuid()
//   const postedDate = new Date();
//   const author = "api author"
//   console.log('postedDate', postedDate)

//   const message = {
//     id,
//     title,
//     content,
//     author,
//     postedDate
//   }

//   messages.push(message)

//   res
//     .status(201)
//     .location(`https://localhost:8000/message-board/${id}`)
//     .json(message)

// })

// app.post('/message-board/:messageId/comments', (req, res) => {
//   const { content } = req.body
//   const { messageId } = req.params

//   console.log('messageId', messageId)

//   if (!content) {
//     return res.status(400).send('Invalid data')
//   }

//   const id = uuid()
//   const postedDate = new Date();
//   const author = "api author"
//   console.log('postedDate', postedDate)

//   const comment = {
//     id,
//     content,
//     author,
//     postedDate,
//     messageId,
//   }

//   comments.push(comment)

//   res
//     .status(201)
//     .location(`https://localhost:8000/message-board/${messageId}/comments/${id}`)
//     .json(comment)

// })

// app.post('/schedule', (req, res) => {
//   const { opponent, status, location, time } = req.body

//   if (!opponent || !status || !location || !time) {
//     return res.status(400).send('Invalid data')
//   }

//   const summary = (status === 'home')
//     ? `${opponent} at Guinness`
//     : `Guinness at ${opponent}`

//   const id = uuid()

//   const game = {
//     id,
//     summary,
//     location,
//     time,
//   }

//   console.log(game)
//   schedule.push(game)

//   res
//     .status(201)
//     .location(`https://localhost:8000/schedule/${id}`)
//     .json(game)

// })

// app.delete('/message-board/:messageId/comments/:commentId', () => {
//   const { commentId } = req.params
//   const index = comments.findIndex(c => c.id === commentId)

//   if (index === -1) {
//     return res.status(404).send('Comment not found')
//   }

//   comments.splice(index, 1)

//   logger.info(`Comment with id ${commentId} deleted.`);
//   res.send('Deleted')
// })

// app.delete('/message-board/:messageId', () => {
//   const { messageId } = req.params
//   const index = messages.findIndex(m => m.id === messageId)

//   if (index === -1) {
//     return res.status(404).send('Message not found')
//   }

//   messages.splice(index, 1)
//   logger.info(`Message with id ${messageId} deleted.`);
//   res.send('Deleted')
// })


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