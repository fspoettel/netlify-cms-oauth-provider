const simpleOauth2 = require('simple-oauth2')
const { CMS_MESSAGE_ERROR, CMS_MESSAGE_SUCCESS } = require('./config')

class OAuth2Client {
  static constructResponse (message, content) {
    return { content, message }
  }

  constructor (provider, credentials, redirectUri = null, scope = null) {
    this.instance = simpleOauth2.create(credentials)

    this.config = {
      provider,
      redirectUri,
      scope
    }
  }

  constructSuccessResponse (tokenRes) {
    const { token } = this.instance.accessToken.create(tokenRes)
    return OAuth2Client.constructResponse(CMS_MESSAGE_SUCCESS, {
      token: token.access_token,
      provider: this.getProvider()
    })
  }

  constructErrorResponse (error) {
    const getResponse = err => OAuth2Client.constructResponse(CMS_MESSAGE_ERROR, err)
    if (error && error.message) return getResponse(error)
    return getResponse({ message: error })
  }

  getProvider () { return this.config.provider }

  authorizeUrl (uuid) {
    const { redirectUri: redirect_uri, scope } = this.config
    return this.instance.authorizationCode.authorizeURL({ redirect_uri, scope, state: uuid })
  }

  async accessToken (uuid, query) {
    const { redirectUri: redirect_uri } = this.config

    const {
      code,
      error,
      error_description: errorDescription,
      state
    } = query

    if (state !== uuid) return this.constructErrorResponse('CSRF detected')
    if (error && errorDescription) return this.constructErrorResponse(errorDescription)

    try {
      const tokenRes = await this.instance.authorizationCode.getToken({ code, redirect_uri })
      return this.constructSuccessResponse(tokenRes)
    } catch (error) {
      return this.constructErrorResponse(error)
    }
  }
}

module.exports = OAuth2Client
