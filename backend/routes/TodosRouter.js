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

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// CREATE new todo
router.post("/", async (req, res) => {
  const { title, description, completed, priority, dueDate, tags, category } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  try {
    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || "",
      completed: completed || false,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [],
      category: category || "general",
    });

    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
});

// UPDATE todo by ID
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

    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update Failed", error: err.message });
  }
});

// DELETE todo by ID
router.delete("/:id", validateId, async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Failed", error: err.message });
  }
});

// TOGGLE complete status
router.patch("/:id/toggle", validateId, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    const saved = await todo.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Toggle Failed", error: err.message });
  }
});

module.exports = router;
