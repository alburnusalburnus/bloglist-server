const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs.map((blog) => blog.toJSON()));
    })
    .catch((error) => console.log(error));
});

blogRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog.toJSON());
      } else {
        response.status(204).end();
      }
    })
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response) => {
  const body = request.body;
  console.log(body);
  if (body === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  const blog = new Blog({
    content: body.content,
    name: body.name,
    url: body.url,
  });
  blog
    .save()
    .then((savedBlog) => savedBlog.toJSON())
    .then((savedAndFormattedBlog) => {
      response.json(savedAndFormattedBlog);
    })
    .catch((error) => next(error));
});

blogRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const updatedInfo = {
    content: body.content,
    name: body.name,
    url: body.url,
  };

  Blog.findByIdAndUpdate(request.params.id, updatedInfo, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
