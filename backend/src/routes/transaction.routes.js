const {Router} = require('express');
const authMiddleware  = require('../middleware/auth.middleware');

const transactionController = require('../controllers/transaction.controller');
const transationRoutes = Router();
const express = require('express');

/**POST  /api/transactions
create new transaction

*/
transationRoutes.post('/' , authMiddleware.authMiddleware , transactionController.createTransaction); 



/**
 * GET /api/transactions
 * Get all transactions of logged in user
 */

transationRoutes.get(
    '/',
    authMiddleware.authMiddleware,
    transactionController.getUserTransactions
);


/**
 * POST /api/transactions/system/initial-funds
 */
transationRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);

// Add this to your routes file
transationRoutes.post('/request-otp', authMiddleware.authMiddleware, transactionController.requestTransferOTP);

module.exports = transationRoutes;