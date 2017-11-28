const crypto = require('crypto')
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

  _constructErrorResponse (error) {
    const getResponse = err => OAuth2Client.constructResponse(CMS_MESSAGE_ERROR, err)
    if (error && error.message) return getResponse(error)
    return getResponse({ message: error })
  }

  _constructSuccessResponse (tokenRes) {
    const { token } = this.instance.accessToken.create(tokenRes)
    return OAuth2Client.constructResponse(CMS_MESSAGE_SUCCESS, {
      token: token.access_token,
      provider: this.getProvider()
    })
  }

  _hashSessionId (uuid) {
    const hash = crypto.createHash('md5')
    return hash.update(uuid).digest('hex')
  }

  getProvider () { return this.config.provider }

  authorizeUrl (uuid) {
    const { redirectUri: redirect_uri, scope } = this.config
    return this.instance.authorizationCode.authorizeURL({
      redirect_uri,
      scope,
      state: this._hashSessionId(uuid)
    })
  }

  async accessToken (uuid, query) {
    const { redirectUri: redirect_uri } = this.config

    const {
      code,
      error,
      error_description: errorDescription,
      state
    } = query

    if (state !== this._hashSessionId(uuid)) return this._constructErrorResponse('CSRF detected')
    if (error && errorDescription) return this._constructErrorResponse(errorDescription)

    try {
      const tokenRes = await this.instance.authorizationCode.getToken({ code, redirect_uri })
      return this._constructSuccessResponse(tokenRes)
    } catch (error) {
      return this._constructErrorResponse(error)
    }
  }
}

module.exports = OAuth2Client
