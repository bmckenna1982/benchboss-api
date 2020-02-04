const ScheduleServices = {
  getFullSchedule(knex) {
    return knex.select('*').from('schedule')
  },
  getById(knex, id) {
    return knex.select('*').from('schedule').where('id', id).first()
  }

}

module.exports = ScheduleServices