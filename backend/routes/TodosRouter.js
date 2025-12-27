const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

// Validate ObjectId middleware
function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Todo ID format" });
  }
  next();
}

/* GET all todos */
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/* CREATE new todo */
router.post("/", async (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  try {
    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || "",
      completed: completed || false,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
});

/* UPDATE todo */
router.patch("/:id", validateId, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description.trim();
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Update Failed", error: err.message });
  }
});

/* DELETE todo */
router.delete("/:id", validateId, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Failed", error: err.message });
  }
});

module.exports = router;
