const Blog = require('../models/blog');
const User = require('../models/user');
const blogRouter = require('express').Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.send(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) response.send(blog);
  else throw new Error('id does not exists');
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes, userId } = request.body;
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
