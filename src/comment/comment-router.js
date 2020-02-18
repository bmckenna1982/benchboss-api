const express = require('express')
const CommentService = require('./comment-services')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const commentRouter = express.Router()
const bodyParser = express.json()

// const comments = require('../comment-data')

commentRouter
  .route('/')
  .get((req, res, next) => {
    CommentService.getAllComments(req.app.get('db')
      .then(comments => {
        res.json(comments)
      })
      .catch(next)
      // const { messageId } = req.params;
      // console.log('messageId', messageId)
      // const commentsArray = comments.filter(c => c.messageId == messageId)
      // console.log('commentsArray', commentsArray)
      // res.json(commentsArray)
    )
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { content, message_id, author_id } = req.body
    const newComment = { content, message_id, author_id }
    // const { messageId } = req.params

    // console.log('messageId', messageId)

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    // newComment.posted_date = posted_date

    CommentService.insertComment(req.app.get('db'), newComment)
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(comment)
      })
      .catch(next)

    // if (!content) {
    //   return res.status(400).send('Invalid data')
    // }

    // const id = uuid()
    // const postedDate = new Date();
    // const author = "api author"
    // console.log('postedDate', postedDate)

    // const comment = {
    //   id,
    //   content,
    //   author,
    //   postedDate,
    //   messageId,
    // }

    // comments.push(comment)

    // res
    //   .status(201)
    //   .location(`https://localhost:8000/message-board/${messageId}/comments/${id}`)
    //   .json(comment)
  })

commentRouter
  .route('/:comment_id')
  .all((req, res, next) => {
    CommentService.getById(req.app.get('db'), req.params.comment_id)
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: { message: `Comment doesn't exist` }
          })
        }
        res.comment = comment
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.comment)
  })
  .delete((req, res, next) => {
    CommentService.deleteComment(req.app.get('db'), req.params.comment_id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    // const { commentId } = req.params
    // const index = comments.findIndex(c => c.id === commentId)

    // if (index === -1) {
    //   return res.status(404).send('Comment not found')
    // }

    // comments.splice(index, 1)

    // logger.info(`Comment with id ${commentId} deleted.`);
    // res.send('Deleted')
  })
  .patch((req, res, next) => {
    const { content, posted_date } = req.body
    const commentToUpdate = { content, posted_date }

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: { message: `Request body must contain 'content' or 'posted_date' ` }
      })

    CommentService.updateComment(req.app.get('db'), req.params.comment_id, commentToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = commentRouter