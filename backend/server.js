const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
const todoRoutes = require("./routes/TodosRouter.js");
app.use("/api/todos", todoRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server (using port 5000)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
