const express = require("express");
const CommentService = require("./comment-services");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

const commentRouter = express.Router();
const bodyParser = express.json();

commentRouter
  .route("/")
  .get((req, res, next) => {
    CommentService.getAllComments(
      req.app
        .get("db")
        .then(comments => {
          res.json(comments);
        })
        .catch(next)
    );
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { content, message_id } = req.body;
    const author_id = req.user.id;
    const newComment = { content, message_id, author_id };

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    CommentService.insertComment(req.app.get("db"), newComment)
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(comment);
      })
      .catch(next);

  });

commentRouter
  .route("/:comment_id")
  .all((req, res, next) => {
    CommentService.getById(req.app.get("db"), req.params.comment_id)
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: { message: `Comment doesn't exist` }
          });
        }
        res.comment = comment;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.comment);
  })
  .delete((req, res, next) => {
    CommentService.deleteComment(req.app.get("db"), req.params.comment_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const { content, posted_date } = req.body;
    const commentToUpdate = { content, posted_date };

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'content' or 'posted_date' `
        }
      });

    CommentService.updateComment(
      req.app.get("db"),
      req.params.comment_id,
      commentToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = commentRouter;
