const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter = require('express').Router();

userRouter.post('/', async (request, response) => {
  const body = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

module.exports = userRouter;
