//previously used
const express = require('express');
const helmet = require('helmet');

const UsersRouter = require('../users/users-router');
const server = express();

//new for this project
const cors = require('cors');
const session = require('express-session');
const sessionStore = require('connect-session-knex')(session);

//previously used
server.use(helmet());
server.use(express.json());
server.use('/api', UsersRouter);

//new for this project
server.use(cors());
server.use(
  session({
    name: 'monkey',
    secret: 'this should come from process.env',
    cookie: {
      maxAge: 1000 * 60,
      secure: false, //in production, do true(https is a must)
      httpOnly: true, //this means that the js on the page can not read the cookie
    },
    resave: false,
    saveUninitialized: false, // we dont want to persist the session by default
    store: new sessionStore({
      knex: require('../data/db-config'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createTable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
);

module.exports = server;
