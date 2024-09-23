const authConfig = require('../config/auth.js');

class authController {

    async getActive(req, res, next) {

        try {

            const passportConfig = authConfig.getPassportJSConfig();
            const simpleLoginConfig = authConfig.getSimpleLoginConfig();

            const response = {
                passportConfig,
                simpleLoginConfig
            };

            return res.json(response);
        }
        catch (error) {
            return next(error);  // Gérer l'erreur
        }
    }

}

module.exports = new authController;