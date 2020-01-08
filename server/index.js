const express = require("express");
const massive = require("massive");
const users = require("./controllers/users");
const posts = require("./controllers/posts");
const comments = require("./controllers/comments");
const secret = require("../secret");
const jwt = require("jsonwebtoken");

massive({
  host: "localhost",
  port: 5432,
  database: "node3",
  user: "postgres",
  password: "node3db"
}).then(db => {
  const app = express();

  app.set("db", db);

  app.use(express.json());
  //USERS
  app.post("/api/users", users.create);
  app.get("/api/users", users.list);
  app.get("/api/users/:id", users.getById);
  app.get("/api/users/:id/profile", users.getProfile);

  app.get('/api/protected/data', (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).end();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, secret);
      res.status(200).json({ data: 'here is the protected data' });
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  });
  app.post('/api/login', users.login);
  
  // POSTS
  app.post("/api/posts", posts.create); // Create a post
  app.get("/api/posts", posts.list); // Get all posts
  app.get("/api/posts/:id", posts.getById); //Get post by Id
  app.put("/api/posts/:id", posts.updateById); //Update post by postId
  // COMMENTS
  app.post("/api/:postid/comment", comments.create); // Create a comment
  app.put("/api/:post_id/:comment_id", comments.updateById); //Update a comment by postId and commentId

  const PORT = 3003;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
