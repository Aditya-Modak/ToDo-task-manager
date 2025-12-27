const express = require("express");
<<<<<<< HEAD
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

const router = express.Router();

// GET all todos
=======
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
>>>>>>> bb406d73025504f486f2a6770dc09530c5c2833c
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
<<<<<<< HEAD
    res.status(500).json({ message: err.message });
  }
});

// CREATE new todo
router.post("/", async (req, res) => {
  const { title, description, priority, dueDate, tags, category } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
=======
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/* CREATE new todo */
router.post("/", async (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty" });
>>>>>>> bb406d73025504f486f2a6770dc09530c5c2833c
  }

  try {
    const todo = new Todo({
<<<<<<< HEAD
      title,
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [],
      category: category || "general",
    });

    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE todo by ID (PATCH)
router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const updated = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE complete status
router.patch("/:id/toggle", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
=======
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
>>>>>>> bb406d73025504f486f2a6770dc09530c5c2833c
  }
});

module.exports = router;
