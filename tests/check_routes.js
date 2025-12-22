import request from 'supertest';
import app from '../backend/index.js';

(async () => {
  try {
    const resGet = await request(app).get('/users');
    console.log('/users GET', resGet.status, JSON.stringify(resGet.body));

    const resPost = await request(app).post('/users').send({ name: 'Alice' });
    console.log('/users POST', resPost.status, JSON.stringify(resPost.body));

    const resGetOne = await request(app).get('/users/1');
    console.log('/users/1 GET', resGetOne.status, JSON.stringify(resGetOne.body));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
})();
