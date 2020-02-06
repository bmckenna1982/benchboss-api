const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('benchboss_user')
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('benchboss_user')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('benchboss_user')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteUser(knex, id) {
    return knex('benchboss_user')
      .where({ id })
      .delete()
  },

  updateUser(knex, id, newUserFields) {
    return knex('benchboss_user')
      .where({ id })
      .update(newUserFields)
  },
}

module.exports = UsersService