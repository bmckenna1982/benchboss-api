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
  }
}

module.exports = ScheduleService