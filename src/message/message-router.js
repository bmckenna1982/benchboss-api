const express = require("express");
const path = require("path");
const logger = require("../logger");
const MessageService = require("./message-services");
const messageRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const messages = require("../message-data");

messageRouter
  .route("/")
  .get((req, res, next) => {
    MessageService.getAllMessages(req.app.get("db"))
      .then(
        messages => res.json(messages)
        // res.json(ThingsService.serializeThings(things))
      )
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { title, content } = req.body;
    const author_id = req.user.id;
    const newMessage = { title, content, author_id };

    if (!title) {
      return res.status(400).send("Invalid data");
    }
    if (!content) {
      return res.status(400).send("Invalid data");
    }

    MessageService.insertMessage(req.app.get("db"), newMessage)
      .then(message => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${message.id}`))
          .json(message);
      })
      .catch(next);
  });

messageRouter
  .route("/:messageId")
  .all(requireAuth)
  .get((req, res) => {
    MessageService.getById(req.app.get("db"), req.params.messageId)
      .then(
        message => {
          if (!message) {
            return res.status(404).send("Message not found");
          }
          res.json(message);
        }
      );
  })
  .delete((req, res) => {
    const { messageId } = req.params;
    const index = messages.findIndex(m => m.id === messageId);

    if (index === -1) {
      return res.status(404).send("Message not found");
    }

    messages.splice(index, 1);
    logger.info(`Message with id ${messageId} deleted.`);
    res.send("Deleted");
  });

messageRouter.route("/:messageId/comments").get((req, res, next) => {
  MessageService.getCommentsForMessage(req.app.get("db"), req.params.messageId)
    .then(comments => res.json(comments))
    .catch(next);
});

messageRouter.route("/:messageId/latest-comment").get((req, res, next) => {
  MessageService.getLatestMessageComment(req.app.get("db"), req.params.messageId)
    .then(comment => res.json(comment))
    .catch(next);
});

module.exports = messageRouter;
