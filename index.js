const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const app = express();

const RedisStore = connectRedis(session);

// configure our redis

const redisClient = redis.createClient({
  port: 6379,
  host: 'localhost',
});

// configure session middleware
const maximumCookieAge = 1000 * 60 * 30;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'very-secure-secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, // if true: only transmit cookie over https
    httpOnly: true, // if true: prevents client side JS from reading the cookie
    maxAge: maximumCookieAge, // in miliseconds
  },
}));

// create login endpoint

app.post('/login', (req, res) => {
  const { email, password } = req;

  // TODO: check if the credentials are correct

  req.session.clientId = 'abc123';
  req.session.myNum = 5;

  res.json('you are now logged in');
});

// plug in another middleware that will check if the user is authenticated or not
// all requests that are plugged in after after this middleware will only be accessible
// if the user is logged in

app.use((req, res, next) => {
  if (!req.session || !req.session.clientId) {
    const error = new Error('User is unauthorized');
    error.statusCode = 401;
    next(error);
  }

  next();
});

// plug in all routes that user can only acess if logged in

app.get('/profile', (req, res) => {
  res.json(req.session);
});

app.listen(8080, () => console.log('server is running in port 8080'));
