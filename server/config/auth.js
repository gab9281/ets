module.exports = {
  // Enable or disable the types of authentications
  simpleLoginActive: process.env.SIMPLE_LOGIN_ACTIVE || 'true',
  oauthActive: process.env.OAUTH_ACTIVE || 'false',
  oidcActive: process.env.OIDC_ACTIVE || 'false',

  // Simple Login Configuration
  sessionSecret: process.env.SESSION_SECRET || 'default_session_secret',

  // OAuth Configuration
  oauth: {
    authorizationURL: process.env.OAUTH_AUTHORIZATION_URL || '',
    tokenURL: process.env.OAUTH_TOKEN_URL || '',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
    callbackURL: process.env.OAUTH_CALLBACK_URL || '',
    scope: process.env.OAUTH_ADD_SCOPE || '',
    teacherRoleClaim: process.env.OAUTH_ROLE_TEACHER_VALUE || '',
    studentRoleClaim: process.env.OAUTH_ROLE_STUDENT_VALUE || '',
  },

  // OIDC Configuration
  oidc: {
    clientID: process.env.OIDC_CLIENT_ID || '',
    clientSecret: process.env.OIDC_CLIENT_SECRET || '',
    issuerURL: process.env.OIDC_ISSUER_URL || '',
    callbackURL: process.env.OIDC_CALLBACK_URL || '',
  }
};
