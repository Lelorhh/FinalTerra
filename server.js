
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const USERS_FILE = 'users.json';
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

const saveUser = (user) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const authenticate = (email, password) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  return users.find((u) => u.email === email && u.password === password);
};

app.post('/register', (req, res) => {
  const { userType, fullName, email, password } = req.body;
  saveUser({ userType, fullName, email, password });
  res.send(`<h2>Registered Successfully!</h2><a href="/login.html">Go to Login</a>`);
});

app.post('/login', (req, res) => {
  const { userType, email, password } = req.body;
  const user = authenticate(email, password);
  if (user) {
    res.send(`<h2>Welcome, ${user.fullName} (${userType})!</h2>`);
  } else {
    res.send(`<h2>Login Failed. <a href="/login.html">Try Again</a></h2>`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
