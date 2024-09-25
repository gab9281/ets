const authConfig = require('../config/auth.js');

class authController {

    async getActive(req, res, next) {

        try {

            const authActive = authConfig.getActiveAuth();

            const response = {
                authActive
            };

            return res.json(response);
        }
        catch (error) {
            return next(error);  // Gérer l'erreur
        }
    }

}

module.exports = new authController;