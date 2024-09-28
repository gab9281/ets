var OAuth2Strategy = require('passport-oauth2')

class PassportOAuth {
    register(app, passport, name, provider) {
        passport.use(name, new OAuth2Strategy({
            authorizationURL: provider.authorization_url,
            tokenURL: provider.token_url,
            clientID: provider.client_id,
            clientSecret: provider.client_secret,
            callbackURL: `http://localhost:4400/api/auth/gmatte/callback`,
            passReqToCallback: true
        },
        async function(req, accessToken, refreshToken, params, profile, done) {
            try {
                const userInfoResponse = await fetch(provider.userinfo_url, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const userInfo = await userInfoResponse.json();

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
                console.error(`Error in OAuth2 Strategy ${name} :`, error);
                return done(error);
            }
        }));

        app.get(`/api/auth/${name}`, (req, res, next) => {
            passport.authenticate(name, {
                scope: provider.scopes.join(' ') ?? 'openid profile email offline_access',
                prompt: 'consent'
            })(req, res, next);
        });

        app.get(`/api/auth/${name}/callback`, 
            (req, res, next) => {
                passport.authenticate(name, { failureRedirect: '/login' })(req, res, next);
            },
            (req, res) => {
                if (req.user) {
                    res.json(req.user)
                } else {
                    res.status(401).json({ error: 'Authentication failed' });
                }
            }
        );
    }
}

module.exports = PassportOAuth;