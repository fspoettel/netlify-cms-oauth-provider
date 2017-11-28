require('dotenv').config({ silent: true })

const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const { REDIS_HOST, REDIS_PORT, SESSION_MAX_AGE, SESSION_SECRET } = process.env

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
})

module.exports = session({
  cookie: { maxAge: SESSION_MAX_AGE || 1000 * 60 * 15 },
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new RedisStore({ client })
})
