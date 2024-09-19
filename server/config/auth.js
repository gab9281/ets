require('dotenv').config({ path: './.env.auth' });

module.exports = {
  // Activer ou désactiver les types d'authentifications
  simpleLoginActive: process.env.SIMPLE_LOGIN_ACTIVE === 'true',
  oauthActive: process.env.OAUTH_ACTIVE === 'true',
  oidcActive: process.env.OIDC_ACTIVE === 'true',

  // Configuration Simple Login
  sessionSecret: process.env.SESSION_SECRET || 'default_session_secret',

  // Configuration OAuth
  oauth: {
    authorizationURL: process.env.OAUTH_AUTHORIZATION_URL || '',
    tokenURL: process.env.OAUTH_TOKEN_URL || '',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
    callbackURL: process.env.OAUTH_CALLBACK_URL || '',
    scope: process.env.OAUTH_ADD_SCOPE || '',
    teacherRoleClaim: process.env.OAUTH_ROLE_TEACHER_VALUE || '',
  },

  // Configuration OIDC
  oidc: {
    clientID: process.env.OIDC_CLIENT_ID || '',
    clientSecret: process.env.OIDC_CLIENT_SECRET || '',
    issuerURL: process.env.OIDC_ISSUER_URL || '',
    callbackURL: process.env.OIDC_CALLBACK_URL || '',
  }
};
