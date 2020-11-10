const express = require('express');
const db = require('../data/db-config');
const Users = require('./users-model');
const router = express.Router();

const bcrypt = require('bcryptjs');

//put this middleware in a centralized location
function secure(req, res, next) {
  //check if there is a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'unathorized' });
  }
}

router.get('/users', secure, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

//need to polish up
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
      req.session.user = user;
      res.json({ message: `Logged in!, ${user.username}` });
    } else {
      res.status(401).json({ message: 'You shall not pass!' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

//how to: post login
// 1- use the req.username to find in the db the user with said username
// 2- compare the bcrypt has of the user we just pulled against req.body.password
// 3- if user AND credentials good then welcome message
// 4- if no user, send back a failure message
// 5- if user but credentials bad send packing
