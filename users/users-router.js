const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const db = require('../data/db-config');
const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');

//put this middleware in a centralized location
// function secure(req, res, next) {
//   //check if there is a user in the session
//   if (req.session && req.session.user) {
//     next();
//   } else {
//     res.status(401).json({ message: 'unathorized' });
//   }
// }

function roleChecker(role) {
  return function (req, res, next) {
    if (req.decodedJwt.role === role) {
      next();
    } else {
      res.status(401).json({ message: 'denied access' });
    }
  };
}

router.get('/users', restricted, roleChecker(2), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;

//how to: post login
// 1- use the req.username to find in the db the user with said username
// 2- compare the bcrypt has of the user we just pulled against req.body.password
// 3- if user AND credentials good then welcome message
// 4- if no user, send back a failure message
// 5- if user but credentials bad send packing
