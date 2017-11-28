const { LABELS } = require('../oAuth/config')

function makeHomeRoute (oAuth2) {
  return (req, res) => {
    const providerLabel = LABELS[oAuth2.getProvider()]

    res.render('home', {
      title: `Netlify ${providerLabel} Authorization`,
      providerLabel
    })
  }
}

module.exports = makeHomeRoute
