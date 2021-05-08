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

const maximumCookieAge = 1000 * 60 * 30;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'very-secure-secret',
  saveUninitialized: false,
  cookie: {
    secure: false, // if true: only transmit cookie over https
    httpOnly: true, // if true: prevents client side JS from reading the cookie
    maxAge: maximumCookieAge, // in miliseconds
  },
}));
