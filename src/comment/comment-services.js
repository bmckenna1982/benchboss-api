const CommentService = {
  getById(db, id) {
    return db
      .from('comment AS comm')
      .select(
        'comm.id',
        'comm.content',
        'comm.posted_date',
        'comm.message_id',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name
            )
          ) AS "author"`
        ),
      )
      .leftJoin(
        'benchboss_user AS usr',
        'comm.author_id',
        'usr.id',
      )
      .where('comm.id', id)
      .first()
  },
  
  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('comment')
      .returning('*')
      .then(([ comment ]) => comment)
      .then(comment => 
        CommentService.getById(db, comment.id)
        )
        
  },
  
    
}

module.exports = CommentService