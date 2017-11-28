require('dotenv').config({ silent: true })

const express = require('express')
const exphbs = require('express-handlebars')
const oAuth2Factory = require('./lib/oAuth/factory')
const session = require('./lib/middlewares/session')
const { LABELS } = require('./lib/oAuth/config')

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

app.get('/', (req, res) => {
  const providerLabel = LABELS[oAuth2.getProvider()]

  res.render('index', {
    title: `Netlify ${providerLabel} Authorization`,
    providerLabel
  })
})

app.get('/auth', (req, res) => {
  const { session } = req
  res.redirect(oAuth2.authorizeUrl(session.id))
})

app.get('/callback', (req, res) => {
  const { query, session } = req

  const renderCallback = ({ content, message }) => {
    const provider = oAuth2.getProvider()
    session.destroy()

    res.render('callback', {
      content: JSON.stringify(content),
      message,
      provider,
      title: `${LABELS[provider]} OAuth Callback`
    })
  }

  return oAuth2.accessToken(session.id, query).then(renderCallback)
})

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Running on ${port}`) })
