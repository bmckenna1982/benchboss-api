const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const commentRouter = express.Router()
const bodyParser = express.json()

const comments = require('../comment-data')

commentRouter
  .route('/message-board/:messageId/comments')
  .get((req, res) => {
    const { messageId } = req.params;
    console.log('messageId', messageId)
    const commentsArray = comments.filter(c => c.messageId == messageId)
    console.log('commentsArray', commentsArray)
    res.json(commentsArray)
  })
  .post(bodyParser, (req, res) => {
    const { content } = req.body
    const { messageId } = req.params

    console.log('messageId', messageId)

    if (!content) {
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
      .location(`https://localhost:8000/message-board/${messageId}/comments/${id}`)
      .json(comment)
  })

commentRouter
  .route('/message-board/messageId/comments/:commentId')
  .delete((req, res) => {
    const { commentId } = req.params
    const index = comments.findIndex(c => c.id === commentId)

    if (index === -1) {
      return res.status(404).send('Comment not found')
    }

    comments.splice(index, 1)

    logger.info(`Comment with id ${commentId} deleted.`);
    res.send('Deleted')
  })

module.exports = commentRouter