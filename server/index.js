const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Must be above the routes to parse JSON body

// Routes
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/readrave")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Test route
app.get('/', (req, res) => {
  res.send("Backend working fine");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.log('Server error:', err);
});
