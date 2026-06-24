const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/auth.validate');
const { registerSchema} = require('../validators/auth.validator');
const router = express.Router();

router.post('/register' , authLimiter, validate(registerSchema), authController.userRegisterController);

router.post('/login' , authLimiter, authController.userLoginController);

router.post('/logout' , authController.userLogoutController);

router.post( '/forgot-password',  authController.forgotPasswordController);

router.post( '/reset-password',  authController.resetPasswordController);

module.exports = router;