function makeAuthRoute (oAuth2) {
  return (req, res) => {
    const { session } = req
    res.redirect(oAuth2.authorizeUrl(session.id))
  }
}

module.exports = makeAuthRoute
