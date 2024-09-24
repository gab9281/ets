var OAuth2Strategy = require('passport-oauth2')

class PassportOAuth{

    register(app,passport,name,provider){
        passport.use(name, new OAuth2Strategy({
            authorizationURL: provider.authorization_url,
            tokenURL: provider.token_url,
            clientID: provider.client_id,
            clientSecret: provider.client_secret,
            callbackURL: `http://gti700.gmatte.xyz:4400/api/auth/gmatte/callback`,
          },
          async function(accessToken, refreshToken, params, profile, done) {
            try {
                const req = await fetch(provider.userinfo_url,{
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                })

                const data = await req.json()
                profile = data
                done(null,{accessToken,refreshToken,profile});
            } catch (error) {
                return done(error);
            }
            }
        ));

        app.use(`/api/auth/${name}`, passport.authenticate(name,{scope: provider.scopes.join(' ') ?? 'openid profile email'}));
        app.use(`/api/auth/${name}/callback`,
            passport.authenticate(name, { 
                successRedirect: '/', 
                failureRedirect: '/login',
                session:false
            }),
            function(accessToken, refreshToken, params, profile, cb) {
                console.log(params);
            }
        );
    }
}
module.exports = PassportOAuth;