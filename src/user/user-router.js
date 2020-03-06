const path = require('path')
const express = require('express')
const xss = require('xss')
const UserService = require('./user-services')

const userRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  full_name: xss(user.full_name),
  user_name: xss(user.user_name),
  date_created: user.date_created,
})

userRouter
  .post('/', jsonParser, (req, res, next) => {
    const { full_name, user_name, password } = req.body
    const newUser = { full_name, user_name, password }

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    const passwordError = UserService.validatePassword(password)
    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UserService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithName => {
        if (hasUserWithName)
          return res.status(400).json({ error: 'User name already take' })

        return UserService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              date_created: 'now()',
            }

            return UserService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(serializeUser(user))
              })
          })
          .catch(next)
      })

  })

userRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UserService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    UserService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { full_name, user_name, password } = req.body
    const userToUpdate = { full_name, user_name, password }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'fullname', 'username', 'password' or 'nickname'`
        }
      })

    UserService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = userRouter