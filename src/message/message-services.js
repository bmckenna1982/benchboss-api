const xss = require("xss");

const MessageService = {
  getAllMessages(db) {
    return db
      .from("message as mess")
      .select(
        "mess.id",
        "mess.title",
        "mess.content",
        "mess.posted_date",
        db.raw(`count(DISTINCT comm) AS number_of_comments`),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        )
      )
      .leftJoin("comment AS comm", "mess.id", "comm.message_id")
      .leftJoin("benchboss_user AS usr", "mess.author_id", "usr.id")
      .groupBy("mess.id", "usr.id");
  },

  getById(db, id) {
    return MessageService.getAllMessages(db)
      .where("mess.id", id)
      .first();
  },

  getCommentsForMessage(db, messageId) {
    return db
      .from("comment AS comm")
      .select(
        "comm.id",
        "comm.content",
        "comm.posted_date",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.full_name                  
              ) tmp)
            )
          ) AS "author"`
        )
      )
      .where("comm.message_id", messageId)
      .leftJoin("benchboss_user AS usr", "comm.author_id", "usr.id")
      .groupBy("comm.id", "usr.id");
  },

  getLatest(db) {
    return MessageService.getAllMessages(db)
      .orderBy("posted_date", "desc")
      .limit(1)
      .first();
  },

  getLatestComment(db, messageId) {
    return db
      .from("comment AS comm")
      .select(
        "comm.id",
        "comm.content",
        "comm.posted_date",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.full_name                  
              ) tmp)
            )
          ) AS "author"`
        )
      )
      .where("comm.message_id", messageId)
      .leftJoin("benchboss_user AS usr", "comm.author_id", "usr.id")
      .groupBy("comm.id", "usr.id")
      .orderBy("posted_date", "desc")
      .limit(1)
      .first();
  },
  insertMessage(db, newMessage) {
    return db
      .insert(newMessage)
      .into("message")
      .returning("*")
      .then(([message]) => message)
      .then(message => MessageService.getById(db, message.id));
  },
  serializeMessage(message) {
    const { author } = message;
    return {
      id: message.id,
      content: xss(message.content),
      title: xss(message.title),
      author: {
        id: author.id,
        user_name: author.user_name,
        full_name: author.full_name,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },
      posted_date: new Date(message.posted_date),
      number_of_comments: Number(message.number_of_comments) || 0
    };
  },

  serializeMessageComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      message_id: comment.message_id,
      content: xss(comment.content),
      posted_date: new Date(comment.posted_date),
      user: {
        id: user.id,
        user_name: user.user_name,
        full_name: user.full_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      }
    };
  }
};

module.exports = MessageService;
