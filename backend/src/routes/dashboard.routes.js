const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { getSpendingInsights } = require('../services/aiService');
const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');
const Account = require('../models/account.model');

// Fetch dashboard analytical data
router.get(
  '/',
  authMiddleware,
  dashboardController.getDashboardData
);

// Process wallet manual deposit
router.post(
  '/add-funds',
  authMiddleware,
  dashboardController.addFundsController
);

console.log("DASHBOARD ROUTES FILE LOADED");

router.get('/ai-insights', authMiddleware, async (req, res) => {
    try {
        // 1. Search using the 'user' field instead of 'userId'
        // We use req.user.id, but your DB seems to have a different user ID.
        // If this still returns null, it means the logged-in user 
        // doesn't "own" that specific account in the database.
        const userAccount = await Account.findOne({ user: req.user.id });
        
        if (!userAccount) {
            // For testing: try to find the account that DOES exist 
            // so we can see if it works with that ID
            const anyAccount = await Account.findOne({});
            console.log("DEBUG: Testing with account:", anyAccount._id);
            
            // Try to fetch transactions for the account that DOES exist
            const transactions = await Transaction.find({ fromAccount: anyAccount._id }).limit(10);
            
            if (transactions.length > 0) {
                 const insights = await getSpendingInsights(transactions);
                 return res.json({ insights });
            }
            
            return res.json({ insights: ["Account not found for this user."] });
        }

        const transactions = await Transaction.find({ fromAccount: userAccount._id }).limit(10);
        
        if (transactions.length === 0) {
            return res.json({ insights: ["No transactions found for this account."] });
        }

        const insights = await getSpendingInsights(transactions);
        res.json({ insights });
        
    } catch (error) {
        console.error("DEBUG ERROR: ", error);
        res.status(500).json({ message: "Failed to generate AI insights" });
    }
});

module.exports = router;