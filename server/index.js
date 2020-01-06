const express = require("express");
const massive = require("massive");
const users = require('./controllers/users')
const posts = require('./controllers/posts')
const comments = require('./controllers/comments')

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

  app.post('/api/users', users.create);
  app.get('/api/users', users.list);
  app.get('/api/users/:id', users.getById);
  app.get('/api/users/:id/profile', users.getProfile);

// POSTS
  app.post('/api/posts', posts.create); // Create a post
  app.get('/api/posts', posts.list); // Get all posts
  app.get('/api/posts/:id', posts.getById);  //Get post by id
  app.put('/api/posts/:id', posts.updateById);
// COMMENTS
  app.post('/api/:postid', comments.create); // Create a comment
  app.put('/api/:post_id/:comment_id', comments.updateById);
  const PORT = 3003;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
