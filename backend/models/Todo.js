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
<<<<<<< HEAD
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
=======
>>>>>>> bb406d73025504f486f2a6770dc09530c5c2833c
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
