require('dotenv').config({ silent: true })

const express = require('express')
const exphbs = require('express-handlebars')
const oAuth2Factory = require('./lib/oAuth/factory')
const session = require('./lib/middlewares/session')
const { makeAuthRoute, makeHomeRoute, makeCallbackRoute } = require('./lib/routes')

const app = express()

app.use(express.static('public'))
app.use(session)

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

const oAuth2 = oAuth2Factory()

app.get('/', makeHomeRoute(oAuth2))
app.get('/auth', makeAuthRoute(oAuth2))
app.get('/callback', makeCallbackRoute(oAuth2))

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Running on ${port}`) })
