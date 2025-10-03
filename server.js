
const express = require('express');
const { syncDatabase } = require('./config/db');
require('./models/user'); 
require('dotenv').config();


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('User Management System API is running...');
});


const PORT = process.env.PORT || 5000;


syncDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});