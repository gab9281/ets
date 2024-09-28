var OpenIDConnectStrategy = require('passport-openidconnect')

class PassportOpenIDConnect {
    register(app, passport, name, provider) {
        passport.use(name, new OpenIDConnectStrategy({
            issuer: provider.issuer_url,
            authorizationURL: provider.authorization_url,
            tokenURL: provider.token_url,
            userInfoURL: provider.userinfo_url,
            clientID: provider.client_id,
            clientSecret: provider.client_secret,
            callbackURL: `http://localhost/api/auth/${name}/callback`,
            passReqToCallback: true
        },
        async function(req, issuer, accessToken, refreshToken, params, profile, done) {
            try {
                const userInfo = (await fetch(provider.userinfo_url, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }))
                .json();

                const user = {
                    id: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresIn: params.expires_in
                };

                // Store the tokens in the session
                req.session.oauth2Tokens = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresIn: params.expires_in
                };

                return done(null, user);
            } catch (error) {
            }
        }));

        app.get(`/api/auth/${name}`, (req, res, next) => {
            passport.authenticate(name, {
                scope: provider.scopes.join(' ') ?? 'openid profile email offline_access',
                prompt: 'consent'
            }) (req, res, next);
        });

        app.get(`/api/auth/${name}/callback`, (req, res, next) => {
            passport.authenticate(name, {
                failureRedirect: '/login'
            }) (req, res, next);
            },

            (req, res) => {
                if (req.user) {
                    res.json(req.user);
                }
                else {
                    // create error in errorCodes.js
                    res.status(401).json({ error: 'Authentication failed' });
                }
            }
        );
    }
}

module.exports = PassportOpenIDConnect;
