const { LABELS } = require('../oAuth/config')

function makeCallbackRoute (oAuth2) {
  return (req, res) => {
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
  }
}

module.exports = makeCallbackRoute
