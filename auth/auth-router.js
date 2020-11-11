const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Users = require('../users/users-model');
const { isValid } = require('../users/users-service');

// pull in the secret we'll use to make the JWT
const { jwtSecret } = require('./secrets.js');
const { unsubscribe } = require('../api/server');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const user = { username, password: hash, role: 2 };
    const addedUser = await Users.add(user);
    res.json(addedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const [user] = await Users.findBy({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = makeToken(user);
      res.json({ message: `Logged in!, ${user.username}`, token });
    } else {
      res.status(401).json({ message: 'You shall not pass!' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  };
  const options = {
    expiresIn: '45 seconds',
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
