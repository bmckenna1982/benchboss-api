const app = require('../src/app')

describe('Schedule endpoints', () => {

  describe('GET /schedule', () => {

    it('should return unauthorized if no Authorization header is sent', () => {
      return supertest(app)
        .get('/schedule')
        .expect(401, { error: 'Unauthorized request' })
    })

    it('should return unauthorized if API_TOKEN is incorrect', () => {
      return supertest(app)
        .get('/schedule')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401, { error: 'Unauthorized request' })
    })

    it('should return the full schedule', () => {
      const schedule = require('../src/schedule-data')
      return supertest(app)
        .get('/schedule')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, schedule)
    })
  })

})