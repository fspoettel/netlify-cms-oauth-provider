const OAuth2Client = require('../client')
const oAuth2Factory = require('../factory')
const { BITBUCKET_SETTINGS, GITHUB_SETTINGS } = require('../config')

jest.mock('../client')

process.env.OAUTH_CLIENT_ID = 'foo'
process.env.OAUTH_CLIENT_SECRET = 'bar'
process.env.REDIRECT_URL = 'baz'

const expectedConfig = (provider) => {
  let settings = GITHUB_SETTINGS
  if (provider === 'bitbucket') settings = BITBUCKET_SETTINGS

  return {
    auth: {
      authorizePath: settings.OAUTH_AUTHORIZE_PATH,
      tokenHost: settings.GIT_HOSTNAME,
      tokenPath: settings.OAUTH_TOKEN_PATH
    },
    client: {
      id: 'foo',
      secret: 'bar'
    }
  }
}

describe('oAuth2Factory', () => {
  afterEach(() => {
    delete process.env.PROVIDER
    OAuth2Client.mockClear()
  })

  it('returns the settings for a given provider', () => {
    process.env.PROVIDER = 'bitbucket'
    oAuth2Factory()
    const clientCallArgs = OAuth2Client.mock.calls[0]
    expect(clientCallArgs[0]).toEqual('bitbucket')
    expect(clientCallArgs[1]).toEqual(expectedConfig('bitbucket'))
    expect(clientCallArgs[2]).toEqual(expectedConfig('baz'))
  })

  it('defaults to github as default provider', () => {
    oAuth2Factory()
    const clientCallArgs = OAuth2Client.mock.calls[0]
    expect(clientCallArgs[0]).toEqual('github')
    expect(clientCallArgs[1]).toEqual(expectedConfig('github'))
    expect(clientCallArgs[2]).toEqual(expectedConfig('baz'))
  })

  it('allows to overwrite specific settings', () => {
    process.env.REDIRECT_URL = 'foo'
    process.env.OAUTH_TOKEN_PATH = 'bar'
    oAuth2Factory()

    const clientCallArgs = OAuth2Client.mock.calls[0]

    expect(clientCallArgs[1]).not.toEqual(expectedConfig('github'))
    expect(clientCallArgs[1].auth.tokenPath).toEqual('bar')
    expect(clientCallArgs[2]).toEqual('foo')
  })
})
