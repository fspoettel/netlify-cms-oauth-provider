require('dotenv').config({ silent: true })

const express = require('express')
const exphbs  = require('express-handlebars')
const oAuth2Factory = require('./src/oAuth2Factory')
const { LABELS } = require('./src/constants')

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

const oAuth2 = oAuth2Factory()
const authorizationUri = oAuth2.getauthorizeURL()

app.get('/', (req, res) => {
  const providerLabel = LABELS[oAuth2.getProvider()]

  return res.render('index', {
    title: `Netlify ${providerLabel} Authorization`,
    providerLabel
  })
})

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  return res.redirect(authorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const { query: { code } } = req

  const renderCallback = ({ content, message, provider }) => {
    return res.render('callback', {
      content: JSON.stringify(content),
      message,
      provider,
      title: `${LABELS[oAuth2.getProvider()]} OAuth Callback`
    })
  }

  return oAuth2.getAccessToken(code).then(renderCallback)
})


app.listen(port, () => {
  console.log(`gandalf is walkin' on port ${port}`)
})
