const express = require("express");
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new todo
router.post("/", async (req, res) => {
  const { title, description, priority, dueDate, tags, category } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const todo = new Todo({
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
  }
});

module.exports = router;
