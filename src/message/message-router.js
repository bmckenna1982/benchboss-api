const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const messageRouter = express.Router()
const bodyParser = express.json()

const messages = require('../message-data')

messageRouter
  .route('/message-board')
  .get((req, res) => {
    res.json(messages)
  })
  .post(bodyParser, (req, res) => {
    const { title, content } = req.body
    console.log('req.body', req.body)
    if (!title) {
      return res.status(400).send('Invalid data')
    }
    if (!content) {
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

messageRouter
  .route('/message-board/:messageId')
  .get((req, res) => {
    const { messageId } = req.params
    const message = messages.find(m => m.id == messageId)

    if (!message) {
      return res.status(404).send('Message not found')
    }

    //*** Get comments here as well?? */
    res.json(message)
  })
  .delete((req, res) => {
    const { messageId } = req.params
    const index = messages.findIndex(m => m.id === messageId)

    if (index === -1) {
      return res.status(404).send('Message not found')
    }

    messages.splice(index, 1)
    logger.info(`Message with id ${messageId} deleted.`);
    res.send('Deleted')
  })

module.exports = messageRouter