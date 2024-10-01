var OAuth2Strategy = require('passport-oauth2')
var authUserAssoc = require('../../../models/authUserAssociation')
var users = require('../../../models/users')
var {hasNestedValue} = require('../../../utils')


class PassportOAuth {
    constructor(passportjs,auth_id){
        this.passportjs = passportjs
        this.auth_id = auth_id
    }

    updateUser(userinfos){

    }

    register(app, passport,endpoint, name, provider) {
        const cb_url =`${process.env['BACKEND_URL']}${endpoint}/${name}/callback`
        passport.use(name, new OAuth2Strategy({
            authorizationURL: provider.OAUTH_AUTHORIZATION_URL,
            tokenURL: provider.OAUTH_TOKEN_URL,
            clientID: provider.OAUTH_CLIENT_ID,
            clientSecret: provider.OAUTH_CLIENT_SECRET,
            callbackURL: cb_url,
            passReqToCallback: true
        },
        async function(req, accessToken, refreshToken, params, profile, done) {
            try {
                const userInfoResponse = await fetch(provider.OAUTH_USERINFO_URL, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const userInfo = await userInfoResponse.json();

                let received_user = {
                    email: userInfo.email,
                    name: userInfo.name,
                    roles: []
                };
                if(hasNestedValue(userInfo,provider.OIDC_ROLE_TEACHER_VALUE)) received_user.roles.push('teacher')
                if(hasNestedValue(userInfo,provider.OIDC_ROLE_STUDENT_VALUE)) received_user.roles.push('student')

                const user_association = await authUserAssoc.find_user_association(userInfo.sub)

                if(user_linked){
                    let user = await users.getById(user_association.user_id)
                    user.name = received_user.name
                    user.email = received_user.email
                    user.roles = received_user.roles
                    users.editUser(user)
                    this.passportjs.authenticate(user)
                } 
                else {
                    let user_id = await users.getId(userInfo.email)
                    if(!user_id){
                        await users.register(received_user.email,"");
                        users.editUser
                    }
                }

                // Store the tokens in the session
                req.session.oauth2Tokens = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresIn: params.expires_in
                };

                return done(null, user);
            } catch (error) {
                console.error(`Erreur dans la strategie OAuth2 '${name}' : ${error}`);
                return done(error);
            }
        }));

        app.get(`${endpoint}/${name}`, (req, res, next) => {
            passport.authenticate(name, {
                scope: 'openid profile email offline_access'+ ` ${provider.OAUTH_ADD_SCOPE}`,
                prompt: 'consent'
            })(req, res, next);
        });

        app.get(`${endpoint}/${name}/callback`, 
            (req, res, next) => {
                passport.authenticate(name, { failureRedirect: '/login' })(req, res, next);
            },
            (req, res) => {
                if (req.user) {
                    res.json(req.user)

                    //const redirectUrl = `http://your-frontend-url.com/oauth/callback?user=${encodeURIComponent(req.user)}`;
                    //res.redirect(redirectUrl);
                    console.info(`L'utilisateur '${req.user.name}' vient de se connecter`)
                } else {
                    res.status(401).json({ error: "L'authentification a échoué" });
                }
            }
        );
    }
}

module.exports = PassportOAuth;
