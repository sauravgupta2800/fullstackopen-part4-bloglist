const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  if (!user) {
    //401 Unauthorized
    response.status(401).json({
      error: 'user doesn\'t exist',
    });
  }

  const isValidPassword =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!isValidPassword) {
    //401 Unauthorized
    response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username,
    id: user._id,
  };

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    userId: user._id,
  });
});

module.exports = loginRouter;
