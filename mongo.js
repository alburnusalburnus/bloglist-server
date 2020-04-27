const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://aceboi:${password}@cluster0-ahjoq.mongodb.net/Blogs?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
  content: String,
  name: String,
  url: String,
});

const Blog = mongoose.model("Blog", blogSchema);

/*const blog = new Blog({
  content: "juu",
  name: "juu",
  url: "www.www.fi",
});
*/

Blog.find({}).then((result) => {
  result.forEach((blog) => {
    console.log(blog);
  });
  mongoose.connection.close();
});

/*blog.save().then((result) => {
  console.log("blog saved!");
  mongoose.connection.close();
});*/
