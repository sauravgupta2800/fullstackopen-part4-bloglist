const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose.
afterAll(() => {
  mongoose.connection.close();
});