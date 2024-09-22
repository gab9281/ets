const authConfig = require('../config/auth.js');

class authController {

    async getActive(req, res, next) {
        try {
            console.log(authConfig);
            const authServices = {
                simpleLoginActive: authConfig.simpleLoginActive,
                oauthActive: authConfig.oauthActive,
                oidcActive: authConfig.oidcActive
            };

            res.json(authServices);
        }
        catch (error) {
            return next(error);
        }
    }

}

module.exports = new authController;