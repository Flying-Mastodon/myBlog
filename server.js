const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const POSTS_FILE = path.join(__dirname, "posts.json");

// GET posts
app.get("/api/posts", (req, res) => {
  fs.readFile(POSTS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load posts." });
    res.json(JSON.parse(data || "[]"));
  });
});

// POST new post
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required." });
  }

  fs.readFile(POSTS_FILE, "utf8", (err, data) => {
    let posts = [];
    if (!err && data) posts = JSON.parse(data);

    const newPost = { title, content };
    posts.push(newPost);

    fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save post." });
      res.status(201).json(newPost);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
