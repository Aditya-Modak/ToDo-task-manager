const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      maxlength: 2000,
      trim: true,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["general", "work", "personal", "urgent"],
      default: "general",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
