const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth.middleware');
const { generateOTPController ,  verifyOTPController} = require('../controllers/otp.controller');

router.post('/generate', authMiddleware, generateOTPController);

router.post('/verify', authMiddleware, verifyOTPController);

module.exports = router;