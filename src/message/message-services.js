const xss = require('xss')

const MessageService = {
  getAllMessages(db) {
    return db
      .from('message as mess')
      .select(
        'mess.id',
        'mess.title',
        'mess.date_created',
        'mess.style',
        'mess.content',
        db.raw(
          `count(DISTINCT comm) AS number_of_comments`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name,
              'nickname', usr.nickname,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        ),
      )
      .leftJoin(
        'blogful_comments AS comm',
        'mess.id',
        'comm.article_id',
      )
      .leftJoin(
        'blogful_users AS usr',
        'mess.author_id',
        'usr.id',
      )
      .groupBy('mess.id', 'usr.id')
  },

  getById(db, id) {
    return MessageService.getAllMessages(db)
      .where('mess.id', id)
      .first()
  },

  getCommentsForMessage(db, messageId) {
    return db
      .from('comment AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.full_name,
                  usr.nickname,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where('comm.article_id', messageId)
      .leftJoin(
        'blogful_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .groupBy('comm.id', 'usr.id')
  },

  serializeArticle(message) {
    const { author } = message
    return {
      id: message.id,
      content: xss(message.content),
      title: xss(message.title),
      author: {
        id: author.id,
        user_name: author.user_name,
        full_name: author.full_name,
        nickname: author.nickname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },      
      postedDate: new Date(message.postedDate),
      number_of_comments: Number(message.number_of_comments) || 0,
      
    }
  },

  serializeArticleComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      article_id: comment.article_id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  },
}