const express = require('express');
const router = express.Router();
const securityController = require('../controllers/security.controller');

// 1. Destructure the exact function names from your auth middleware file
const { authMiddleware } = require('../middleware/auth.middleware');

// 2. Apply your actual authMiddleware function to secure the endpoints
router.get('/fraud-metrics', authMiddleware, securityController.getFraudMetrics);
router.patch('/toggle-freeze/:id', authMiddleware, securityController.toggleFreezeAccount);

// GET all pending alerts

console.log("DEBUG - Controller:", securityController);
console.log("DEBUG - getAlerts function:", securityController.getAlerts);

router.get('/alerts', securityController.getAlerts); // Line 13

// POST to resolve alert (Use this in your frontend handleResolution function)
router.post('/resolve/:id', authMiddleware, securityController.resolveAlert);

module.exports = router;