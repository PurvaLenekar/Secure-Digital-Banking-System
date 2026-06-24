const express = require('express');

const authMiddleware = require('../middleware/auth.middleware');
const {getAnalyticsController} = require('../controllers/analytics.controller');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();


router.get('/',authMiddleware.authMiddleware, roleMiddleware('ADMIN'), getAnalyticsController);

module.exports = router;