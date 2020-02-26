const express = require("express");
const uuid = require("uuid/v4");
const logger = require("../logger");
const ScheduleService = require("./schedule-services");

const scheduleRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
// const schedule = require('../schedule-data')

scheduleRouter
  .route("/")
  .get((req, res) => {
    ScheduleService.getFullSchedule(req.app.get("db")).then(games => {
      res.json(games);
    });
    // res.json(schedule)
  })
  .post(bodyParser, (req, res) => {
    const { opponent, status, location, time } = req.body;

    if (!opponent || !status || !location || !time) {
      return res.status(400).send("Invalid data");
    }

    const summary =
      status === "home" ? `${opponent} at Guinness` : `Guinness at ${opponent}`;

    // const id = uuid()

    const newGame = {
      // id,
      summary,
      location,
      time
    };

    ScheduleService.insertGame(req.app.get("db"), newGame).then(game =>
      res
        .status(201)
        .location(`https://localhost:8000/api/schedule/${game.id}`)
        .json(game)
    );
  });

scheduleRouter
  .route("/:gameId")
  .all(requireAuth)
  .get((req, res) => {
    ScheduleService.getById(req.app.get("db"), req.params.gameId).then(
      gameById => {
        // console.log("gameById", gameById);
        // console.log("req.user", req.user);
        if (!gameById) {
          return res.status(404).send("Game not found");
        }

        res.json({
          game: gameById,
          user: req.user
        });
      }
    );
  });

scheduleRouter
  .route("/:gameId/rsvp")
  .all(requireAuth)
  // .get((req, res) => {
  // ScheduleService.getRsvp(req.app.get('db'), req.params.gameId)
  //   .then(game => {
  //     console.log('game', game)

  //     if (!game) {
  //       return res.status(404).send('Rsvp not found')
  //     }

  //     res.json(game)
  //   })

  // })
  .all((req, res, next) => {
    ScheduleService.getRsvp(req.app.get("db"), req.params.gameId)
      .then(allGameRsvp => {
        // console.log("allGameRsvp", allGameRsvp);

        if (!allGameRsvp) {
          return res.status(404).send("Rsvp not found");
        }

        res.allGameRsvp = allGameRsvp;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const userId = req.user.id;
    ScheduleService.getUserRsvpByGame(
      req.app.get("db"),
      req.params.gameId,
      userId
    )
      .then(currentUserRsvp => {
        // console.log("currentUserRsvp", currentUserRsvp);
        // if(currentUserRsvp) {
        //   res.json({  rsvp: {
        //     game: res.game,
        //     userRsvp: currentUserRsVP
        //   }})
        // }
        res.json({
          teamRsvp: res.allGameRsvp,
          userRsvp: currentUserRsvp
        });
      })
      .catch(next);
  });
module.exports = scheduleRouter;
