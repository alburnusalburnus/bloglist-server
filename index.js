const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

const blogs = [
  {
    content: "Blogi",
    name: "Blogger",
    url: "www.www.fi",
    id: 1
  },
  {
    content: "Bloggaaja",
    name: "Blogaaja",
    url: "www.www.com",
    id: 2
  },
  {
    content: "Blog",
    name: "blogger",
    url: "www.www.org",
    id: 3
  }
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/blogs", (request, response) => {
  response.json(blogs);
});

app.get("/api/blogs/:id", (request, response) => {
  const id = Number(request.params.id);
  const blog = blogs.find(blog => blog.id === id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end;
  }
});

const generateId = () => {
  const maxId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) : 0;
  return maxId + 1;
};

app.post("/api/blogs", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing"
    });
  }

  const newBlog = {
    content: body.content,
    name: body.name,
    url: body.url,
    id: generateId()
  };

  blogs = blogs.concat(newBlog);
  response.json(newBlog);
});

app.delete("/api/blogs/:id", (request, response) => {
  const id = Number(request.params.id);
  const updatedBlog = blogs.filter(blog => blog.id !== id);
  response.status(204).end();
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
