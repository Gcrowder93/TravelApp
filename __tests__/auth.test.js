const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('TravelBackend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirect to the github oauth when logged in', async () => {
    const req = await request(app).get('/api/v1/github/login');
    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });
});