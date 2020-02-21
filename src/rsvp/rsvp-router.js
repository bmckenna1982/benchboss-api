const express = require('express')
const path = require('path')
const rsvpRouter = express.Router()
const bodyParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const RsvpService = require('./rsvp-service')

rsvpRouter
  .post('/', requireAuth, bodyParser, (req, res, next) => {
    const { game_id, game_status } = req.body
    const newRsvp = { game_id, game_status }

    for (const [key, value] of Object.entries(newRsvp))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    //check database to see if user has already RSVP
    console.log('req.user.id', req.user.id)
    newRsvp.user_id = req.user.id

    // res.json(req.user.id)
    RsvpService.insertRsvp(
      req.app.get('db'),
      newRsvp
    )
      .then(rsvp => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${rsvp.id}`))
          .json(rsvp)
      })
      .catch(next)

  })

rsvpRouter
  .route('/:rsvp_id')
  .all(requireAuth)
  .get((req, res, next) => {
    RsvpService.getRsvpById(req.app.get('db'), req.params.rsvp_id)
      .then(rsvp => {
        console.log('rsvp', rsvp)
        res.json(rsvp)
      })
      .catch(next)
  })  
  .patch(bodyParser, (req, res, next) => {
    const { game_status } = req.body
    const rsvpToUpdate = { game_status }

    console.log('req.params.rsvp_id', req.params.rsvp_id)
    if (!game_status) {
      return res.status(400).json({ error: `Request must contain 'game_status'` })
    }

    RsvpService.updateRsvp(
      req.app.get('db'),
      req.params.rsvp_id,
      rsvpToUpdate
    )
      .then(numRowsAffected => {
        console.log('numRowsAffected', numRowsAffected)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = rsvpRouter
