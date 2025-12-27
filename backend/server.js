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

// Routes (import the correct router file)
const todoRoutes = require("./routes/TodosRouter.js");
app.use("/api/todos", todoRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

<<<<<<< HEAD
// Start Server on port 5000 as required
const PORT = 5000;
=======
// Start Server on port 3000 as required
const PORT = 3000;
>>>>>>> bb406d73025504f486f2a6770dc09530c5c2833c
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
