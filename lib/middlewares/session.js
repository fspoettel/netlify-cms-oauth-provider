require('dotenv').config({ silent: true })

const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const client = redis.createClient()

const { SESSION_SECRET } = process.env

module.exports = session({
  cookie: { maxAge: 1000 * 60 },
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new RedisStore({ client })
})
