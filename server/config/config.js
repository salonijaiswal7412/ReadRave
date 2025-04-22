// MongoDB connection
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB=async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/readrave")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));
}

module.exports = connectDB;