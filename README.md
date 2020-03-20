# Bench Boss API server

This is the REST API server for Bench Boss. 

## Set up

1. Clone this repository to your local machine
2. `cd` into the cloned repository
3. Install the node dependencies `npm install`
4. Move the example Environment file to .env  `mv example.env .env`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Open Endpoints

|Path       |Method    |Protected |
|:-------------|:---------|:---------|
|/api/login |POST      |No        |
|/api/schedule |GET |No |
| |POST |Yes |
| |GET |Yes |
| |GET |Yes |

Authentication
  * POST /api/login
  
Schedule
  * GET /api/schedule
  * POST /api/schedule
  * GET /api/schedule/:gameId
  * GET /api/schedule/:gameId/rsvp

Messages
  * GET /api/message-board
  * POST /api/message-board
  * GET /api/message-board/:messageId
  * DELETE /api/message-board/:messageId

Latest Message
  * GET /api/latest-message

Comments
  * GET /api/comments
  * POST /api/comments
  * GET /api/comments/:commentId
  * DELETE /api/comments/:commentId
  * PATCH /api/comments/:commentId
  
Users  
  * POST /api/users
  * GET /api/users/:userId
  * DELETE /api/users/:userId
  * PATCH /api/users/:userId
