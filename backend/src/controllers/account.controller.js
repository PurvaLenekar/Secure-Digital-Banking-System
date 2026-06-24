const accountModel = require('../models/account.model');
const createAuditLog = require('../utils/createAuditLog');
const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const mongoose = require('mongoose');
const crypto = require('crypto');

async function createAccountController(req, res) {
    const user = req.user; // Assuming authMiddleware sets req.user

    const account = await accountModel.create({
        user: user._id,
    });

    res.status(201).json({
        account
    });
}

async function getUserAccountsController(req, res) {
    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    });
}

async function getAccountBalanceController(req, res) {
    const {accountId} = req.params;

    const account  = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    });

    if(!account){
        return res.status(404).json({ message: "Account not found." });
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId : account._id,
        balance : balance
    });
}

async function freezeAccountController(req, res){

    try{
        const { accountId } = req.params;
        const account = await accountModel.findById(accountId);

        if(!account){
            return res.status(404).json({
                message: "Account not found"
            });

        }

        if(account.status === 'INACTIVE'){
            return res.status(400).json({
                message: "Account already frozen"
            });

        }

        account.status = 'INACTIVE';

        await account.save();

        return res.status(200).json({
            message: "Account frozen successfully"
        });

        await createAuditLog({
            userId: req.user._id,
            action: 'FREEZE_ACCOUNT',
            req
        });

    }
    catch(err){

        return res.status(500).json({
            message: "Error freezing account",
            error: err.message
        });

    }

}



async function unfreezeAccountController(req, res){

    try{
        const { accountId } = req.params;
        const account = await accountModel.findById(accountId);

        if(!account){

            return res.status(404).json({
                message: "Account not found"
            });

        }

        if(account.status === 'ACTIVE'){
            return res.status(400).json({
                message: "Account already active"
            });

        }

        account.status = 'ACTIVE';

        await account.save();

        return res.status(200).json({
            message: "Account unfrozen successfully"
        });

        await createAuditLog({
            userId: req.user._id,
            action: 'UNFREEZE_ACCOUNT',
            req
        });

    }
    catch(err){

        return res.status(500).json({
            message: "Error unfreezing account",
            error: err.message
        });
    }
}

async function depositMoney(req, res) {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        console.log(req.user);

         const { amount, accountId } = req.body; // Ensure accountId is passed from the UI

        if (!amount || amount <= 0) {

            return res.status(400).json({
                message: "Valid amount is required"
            });
        }

        // FIND USER ACCOUNT
      
        const account = await accountModel.findOne({ 
            _id: accountId, 
            user: req.user._id 
        }).session(session);
        
        if (!account) {

            return res.status(404).json({
                message: "Account not found"
            });
        }

        // CREATE TRANSACTION FIRST
        const transaction = await transactionModel.create([{

            fromAccount: null,

            toAccount: account._id,

            amount: Number(amount),

            status: "COMPLETED",

            note: "Money deposited",

            idempotencyKey: crypto.randomUUID()

        }], { session });

        // CREATE LEDGER ENTRY
        await ledgerModel.create([{

            account: account._id,

            transaction: transaction[0]._id,

            type: "CREDIT",

            amount: Number(amount),

            description: "Money deposited"

        }], { session });

        // UPDATED BALANCE
        const updatedBalance =
            await account.getBalance(session);

        await session.commitTransaction();

        res.status(200).json({

            message: "Money deposited successfully",

            balance: updatedBalance

        });

    } catch (err) {

        await session.abortTransaction();

        console.log(err);

        res.status(500).json({
            message: "Deposit failed"
        });

    } finally {

        session.endSession();

    }
};


module.exports = {createAccountController , getUserAccountsController , getAccountBalanceController, freezeAccountController, unfreezeAccountController , depositMoney};