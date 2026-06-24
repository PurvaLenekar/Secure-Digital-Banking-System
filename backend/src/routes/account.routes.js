const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware =  require('../middleware/admin.middleware');
const accountController = require('../controllers/account.controller');
const roleMiddleware = require('../middleware/role.middleware');    

const router = express.Router();

/*
POST  /api/accounts
create new account
protected route
*/

router.post('/', authMiddleware.authMiddleware, accountController.createAccountController);
    // Implementation for creating a new account

/*
  - GET /api/accounts
    - Get all accounts for the authenticated user

*/
router.get('/', authMiddleware.authMiddleware , accountController.getUserAccountsController);

router.post(
    '/deposit',
    authMiddleware.authMiddleware,
    accountController.depositMoney
);


router.get(
    '/admin-test',
    authMiddleware.authMiddleware,
    adminMiddleware,
    (req, res) => {

        res.status(200).json({
            message: "Admin access granted"
        });
 });

/*
*- GET /api/accounts/balance/:accountId
    - Get balance for a specific account
*/
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);


/**- POST /api/accounts/freeze/:accountId
    - Freeze a specific account (admin only)
*/
router.post("/freeze/:accountId", authMiddleware.authMiddleware, roleMiddleware('ADMIN'), accountController.freezeAccountController);


/**- POST /api/accounts/unfreeze/:accountId
    - Unfreeze a specific account (admin only)
*/
router.post("/unfreeze/:accountId", authMiddleware.authMiddleware,roleMiddleware('ADMIN'), accountController.unfreezeAccountController);


module.exports = router;

