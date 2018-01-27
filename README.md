# netlify-cms-oauth-provider

> Secure, [custom](https://www.netlifycms.org/docs/authentication-backends/) oAuth provider for [netlify-cms](https://www.netlifycms.org/).

## Features

* Support for Github, Github Enterprise, ~~Gitlab~~ \* & ~~Bitbucket~~ \* out-of-the-box
* Protection against CSRF attacks via Redis-backed sessions


\* netlify-cms support for these is pending

## Configuring oAuth provider

The oAuth client is configured via environment variables. To get started, create an oAuth application with the `git` provider of your choice and set the following environment variables in your application:

```
# {REQUIRED} Sets the git provider. Possible values: github (default), gitlab, bitbucket
PROVIDER="github"
OAUTH_CLIENT_ID="b9dc30005131c7a69d94"
OAUTH_CLIENT_SECRET="d44669a2ca4754a1401fe3415c0a4ad4f1f57adf"
REDIRECT_URL="http://your-url/callback"
```

You can further customize the oAuth parameters to support Github Enterprise or self-hosted Gitlab instances. This is done for you for the default `github`, `gitlab` and `bitbucket` providers. The following configuration variables are supported (shown here with the Github defaults):

```
GIT_HOSTNAME="https://github.com"
OAUTH_AUTHORIZE_PATH="/login/oauth/authorize"
OAUTH_TOKEN_PATH="/login/oauth/access_token"
SCOPES="repo,user"
```

## Configuring sessions middleware

This project uses Redis and express sessions to detect CSRF attacks against the oAuth process. To configure this, you need to set two environment variables:

```
SESSION_SECRET="your-secret"
REDIS_URL="redis://..."
```

## Deploy

I run this on Heroku with the `node.js` buildpack and the `Heroku Redis` addon. It should be possible to run this wherever you want, ymmv.

## Configuring netlify-cms

Add the following to your netlify-cms config:

```
backend:
  name: github
  repo:  your/repo
  branch: master
  base_url: https://your-url
```
