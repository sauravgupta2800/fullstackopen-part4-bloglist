const Blog = require('../models/blog');
const User = require('../models/user');
const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.send(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  if (blog) response.send(blog);
  else response.status(404).send({ message:'Id is not available' });
});

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  // userId must be there in request.body;
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    if (blog.user.toString() === request.body.userId.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    }
    else response.status(401).send({ message:'you are not the owner of this blog' });
  } else response.status(404).send({ message:'Id is not available' });
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes, userId } = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(userId);
  const blog = new Blog({ title, author, url, likes, user: user._id });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).send(savedBlog);
});

blogRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.status(201).json(updatedBlog);
});

module.exports = blogRouter;
