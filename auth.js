const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { userType, fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ userType, fullName, email, password: hashedPassword });
    await user.save();
    res.redirect('/login.html');
  } catch (err) {
    console.error(err);
    res.send('Registration failed.');
  }
});

router.post('/login', async (req, res) => {
  const { userType, email, password } = req.body;
  const user = await User.findOne({ email, userType });

  if (!user) return res.send('No such user.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Incorrect password.');

  req.session.user = { id: user._id, email: user.email, userType: user.userType };
  res.send(`Welcome ${user.userType} ${user.email}`);
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

module.exports = router;
