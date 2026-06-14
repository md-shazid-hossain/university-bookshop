require('dotenv').config();
const express = require('express');

const { sequelize, connectDB } = require('./models');
const User = require('./models/user');

const app = express();

app.use(express.json());


connectDB();

sequelize.sync()
  .then(() => console.log('✅ Tables synced'));


app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});