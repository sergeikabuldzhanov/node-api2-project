const express = require("express");
const db = require("../data/db");

const router = express.Router();

// GET routes
router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    if (posts.length === 0) {
      res.status(204).json({ messaage: "No posts" });
    } else {
      res.status(200).json(posts);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    if (post.length) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    const { message, stack } = error;
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    if (post.length) {
      const comments = await db.findPostComments(id);
      res.status(200).json(comments);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    const { message, stack } = error;
    res
      .status(500)
      .json({ error: "The comments information could not be retrieved." });
  }
});

//POST routes
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    try {
      const newPostId = await db.insert(req.body);
      const newPost = await db.findById(newPostId.id);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    }
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (text) {
    try {
      const postExists = await db.findById(id);
      if (postExists.length) {
        try {
          const newCommentId = db.insertComment({ text, post_id: id });
          const newComment = db.findCommentById(newCommentId.id);
          res.status(201).json(newComment);
        } catch (error) {
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    } catch (error) {}
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

//DELETE routes
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postToDelete = await db.findById(id);
    const isDeleted = await db.remove(id);
    if (isDeleted) {
      res.status(200).json(postToDelete);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

//PUT routes
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (title && contents) {
    try {
      const isUpdated = await db.update(id, { title, contents });
      if (isUpdated) {
        const updatedPost = await db.findById(id);
        res.status(200).json(updatedPost);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    }
  } else {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
  }
});

module.exports = router;
