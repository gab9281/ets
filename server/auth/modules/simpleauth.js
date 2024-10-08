var authprovider = require('../../models/authProvider.js')
var users = require('../../app.js')
const jwt = require('../../middleware/jwtToken.js');
const emailer = require('../../config/email.js');

const model = require('../../models/users.js');
const AppError = require('../../middleware/AppError.js');
const { MISSING_REQUIRED_PARAMETER, LOGIN_CREDENTIALS_ERROR, GENERATE_PASSWORD_ERROR, UPDATE_PASSWORD_ERROR, DELETE_USER_ERROR } = require('../../constants/errorCodes');

class SimpleAuth{
    constructor(authmanager,settings){
        this.authmanager = authmanager
        this.providers = settings
        this.endpoint = "/api/users"
    }

    async registerAuth(expressapp){
        try{
            expressapp.post(`${this.endpoint}/register`, this.register);
            expressapp.post(`${this.endpoint}/login`, this.authenticate);
            expressapp.post(`${this.endpoint}/reset-password`, this.resetPassword);
            expressapp.post(`${this.endpoint}/change-password`, jwt.authenticate, this.changePassword);
        } catch(error){
            console.error(`La connexion ${name} de type ${provider.type} n'as pu être chargé.`)
        }
    }

    async register(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            await model.register(email, password);

            emailer.registerConfirmation(email)

            return res.status(200).json({
                message: 'Utilisateur créé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async authenticate(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            const user = await model.login(email, password);

            if (!user) {
                throw new AppError(LOGIN_CREDENTIALS_ERROR);
            }

            const token = jwt.create(user.email, user._id);

            return res.status(200).json({
                token: token,
                id: user.email
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            const newPassword = await model.resetPassword(email);

            if (!newPassword) {
                throw new AppError(GENERATE_PASSWORD_ERROR);
            }

            emailer.newPasswordConfirmation(email, newPassword);

            return res.status(200).json({
                message: 'Nouveau mot de passe envoyé par courriel.'
            });
        }
        catch (error) {
            return next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { email, oldPassword, newPassword } = req.body;

            if (!email || !oldPassword || !newPassword) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // verify creds first
            const user = await model.login(email, oldPassword);

            if (!user) {
                throw new AppError(LOGIN_CREDENTIALS_ERROR);
            }

            const password = await model.changePassword(email, newPassword)

            if (!password) {
                throw new AppError(UPDATE_PASSWORD_ERROR);
            }

            return res.status(200).json({
                message: 'Mot de passe changé avec succès.'
            });
        }
        catch (error) {
            return next(error);
        }
    }
    
}

module.exports = SimpleAuth;