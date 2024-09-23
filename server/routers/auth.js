const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwtToken.js');

const authController = require('../controllers/auth.js')

router.get("/getActiveAuth",jwt.authenticate, authController.getActive);

module.exports = router;