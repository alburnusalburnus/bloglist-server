require("dotenv").config();
const express = require("express");
const app = express();
const Blog = require("./models/blog");

const cors = require("cors");

app.use(cors());

app.use(express.static("build"));

app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs.map((blog) => blog.toJSON()));
    })
    .catch((error) => console.log(error));
});

app.get("api/blogs/:id", (request, response, next) => {
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

app.post("/api/blogs", (request, response) => {
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

app.delete("/api/blogs/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/blogs/:id", (request, response, next) => {
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

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
