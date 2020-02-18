const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password may not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },

  hasUserWithUserName(db, user_name) {
    return db('benchboss_user')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  
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
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  }
}

module.exports = UsersService