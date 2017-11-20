const randomString = require('randomstring')
const simpleOauth2 = require('simple-oauth2')
const {
  CMS_MESSAGE_ERROR,
  CMS_MESSAGE_SUCCESS
} = require('./constants')

class OAuth2Client {
  constructor (credentials, redirectUri, scope, provider) {
    this.instance = simpleOauth2.create(credentials)

    this.config = {
      provider,
      redirectUri,
      scope
    }
  }

  getProvider () {
    const { provider } = this.config
    return provider
  }

  /**
   * Return authorizeUrl to initiate oAuth-flow
   * @return {String} url that will be redirected to
   */
  getauthorizeURL () {
    const { redirectUri: redirect_uri, scope } = this.config
    const { authorizationCode } = this.instance
    const state = randomString.generate(32)
    return authorizationCode.authorizeURL({ redirect_uri, scope, state })
  }

  /**
   * Retrieves access_token from oAuth response, handles errors returned from the API
   * @param  {String}  code response code
   * @return {Promise<Object>} resolves to netlify-cms-compatible response object
   */
  async getAccessToken (code) {
    const { accessToken, authorizationCode } = this.instance
    const { redirectUri: redirect_uri, provider } = this.config

    let message = null
    let content = null

    try {
      const result = await authorizationCode.getToken({ code, redirect_uri })
      message = CMS_MESSAGE_SUCCESS
      content = {
        token: accessToken.create(result),
        provider
      }
    } catch (error) {
      console.error('Access Token Error', error.message)
      message = CMS_MESSAGE_ERROR
      content = error
    }

    return { content, message }
  }
}

module.exports = OAuth2Client
