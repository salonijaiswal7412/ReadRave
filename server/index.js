const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require("./routes/UserRoutes");
const cookieParser=require('cookie-parser');
const connectDB=require('./config/config');
const googleBooksRoutes = require('./routes/googleBookRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const path=require('path');
const readListRoutes=require('./routes/readListRoutes');
const chabotRoutes=require('./routes/chatbotRoutes');
const genreRoutes = require('./routes/genreRoutes');



const app = express();
connectDB();


// Middleware setup
app.use(express.json());
app.use(cookieParser());


const corsOptions={
  origin:['http://localhost:5173', 'https://read-rave.vercel.app'],
  methods:['GET','POST','PUT',"PATCH",'DELETE'],
  credentials:true,
};
app.use(cors(corsOptions));




app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/users", userRoutes);
app.use('/api/reviews',reviewRoutes);
app.use('/api/reading-list',readListRoutes);
app.use('/api/google-books', googleBooksRoutes);
app.use('/api/chatbot',chabotRoutes);
app.use('/api/genres', genreRoutes);


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
