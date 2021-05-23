const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
require('express-async-errors');
const express = require('express');
const app = express();

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to mongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);
app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);
// handler of requests with result to errors
app.use(middleware.errorHandler);

module.exports = app;
