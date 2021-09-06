// test/app.integration.test.js
import request from 'supertest';
import app from '../../app';

describe('app', () => {
  it('GETs /comics and should obtain comics length', async () => {
    const res = await request(app)
      .get('/comics')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('results');
  });
});
