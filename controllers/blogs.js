const Blog = require("../models/blog");
const blogRouter = require("express").Router();

blogRouter.get("/",(request, response, next) =>{
    Blog.find({}).then((blogs) => {
        response.send(blogs)
    })
})

blogRouter.post("/", (request, response, next) => {
    const blog = new Blog(request.body)
    blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch((error) => next(error));
})



module.exports = blogRouter;