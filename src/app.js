require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const uuid = require('uuid/v4')
const { NODE_ENV } = require('./config')

const schedule = require('./schedule-data')
const messages = require('./message-data')
const comments = require('./comment-data')

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
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/', (req, res) => {
  // res.send('Hello, world!')
  res.json({ok: true})
})

app.get('/schedule', (req, res) => {
  // const { search = ""} = req.query;

  // let results = schedule.filter(game => game.)
  res.json(schedule)
})

app.get('/schedule/:gameId', (req, res) => {
  const { gameId } = req.params
  const game = schedule.find(g => g.id == gameId)

  if(!game) {
    return res.status(404).send('Game not found')
  }
  
  res.json(game)
})

app.get('/message-board', (req, res) => {
  // const { search = ""} = req.query;

  // let results = schedule.filter(game => game.)
  res.json(messages)
})

app.get('/message-board/:messageId', (req, res) => {
  const { messageId } = req.params
  const message = messages.find(m => m.id == messageId)

  if(!message) {
    return res.status(404).send('Message not found')
  }
  
  //*** Get comments here as well?? */
  res.json(message)
})

app.get('/message-board/:messageId/comments', (req, res) => {
  const { messageId } = req.params;
  console.log('messageId', messageId)
  const commentsArray = comments.filter(c => c.messageId == messageId)
  console.log('commentsArray', commentsArray)
  res.json(commentsArray)
})

app.post('/message-board', (req, res) => {
  const { title, content } = req.body
  console.log('req.body', req.body)
  if(!title) {
    return res.status(400).send('Invalid data')
  }
  if(!content) {
    return res.status(400).send('Invalid data')
  }

  const id = uuid()
  const postedDate = new Date();
  const author = "api author"
  console.log('postedDate', postedDate)

  const message = {
    id,
    title,
    content,
    author,    
    postedDate
  }

  messages.push(message)

  res
    .status(201)
    .location(`https://localhost:8000/message-board/${id}`)
    .json(message)

})

app.post('/message-board/:messageId', (req, res) => {
  const { content } = req.body
  const { messageId } = req.params

  console.log('messageId', messageId)
  
  if(!content) {
    return res.status(400).send('Invalid data')
  }

  const id = uuid()
  const postedDate = new Date();
  const author = "api author"
  console.log('postedDate', postedDate)

  const comment = {
    id,    
    content,
    author,    
    postedDate, 
    messageId,
  }

  comments.push(comment)

  res
    .status(201)
    .location(`https://localhost:8000/message-board/${messageId}/comments`)
    .json(comment)

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