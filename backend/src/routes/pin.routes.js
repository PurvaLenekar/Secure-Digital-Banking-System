const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { 
    requestPinResetOtpController, 
    verifyAndSetPinController 
} = require('../controllers/pin.controller');

// Both secure routes MUST pass through authMiddleware to generate and apply settings cleanly!
router.post('/request-reset-otp', authMiddleware, requestPinResetOtpController);
router.post('/verify-reset', authMiddleware, verifyAndSetPinController);

module.exports = router;