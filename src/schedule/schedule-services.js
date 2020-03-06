const ScheduleService = {
  getFullSchedule(db) {
    return db.select('*').from('schedule')
  },
  getById(db, id) {
    return db
      .select('*')
      .from('schedule')
      .where('id', id)
      .first()
  },
  // getRsvp(db) {    
  //   return db.select('*').from('rsvp')
  // },
  getRsvp(db, id) {
    return db
      .from('rsvp as rsvp')      
      .select(
        'rsvp.id',
        'rsvp.game_id',
        'rsvp.game_status',
        'rsvp.response_date',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name            
            )
          ) AS "user"`
        ),
      )
      .leftJoin(
        'benchboss_user as usr',
        'rsvp.user_id',
        'usr.id',
      )       
      .where('rsvp.game_id', id)
  },
  getUserRsvpByGame(db, game_id, user_id) {
    return ScheduleService.getRsvp(db, game_id)
      .where('usr.id', user_id)
      // .first()    
  },
  insertGame(db, newGame) {
    return db
      .insert(newGame)
      .into('schedule')
      .returning('*')
      .then(rows => rows[0])
  },
  deleteGame(db, id) {
    return db('schedule')
      .where({ id })
      .delete()
  },
  updateGame(db, id, newGame) {
    return db('schedule')
      .where({ id })
      .update(newGame)
  },
  serializeSchedule(schedule) {
    const { author } = article
    return {
      id: article.id,
      style: article.style,
      title: xss(article.title),
      content: xss(article.content),
      date_created: new Date(article.date_created),
      number_of_comments: Number(article.number_of_comments) || 0,
      author: {
        id: author.id,
        user_name: author.user_name,
        full_name: author.full_name,
        nickname: author.nickname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },
    }
  },
}

module.exports = ScheduleService