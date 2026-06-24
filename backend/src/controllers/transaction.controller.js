const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');
const accountModel = require('../models/account.model');
const FraudLog = require('../models/fraudLog.model');
const createAuditLog = require('../utils/createAuditLog');
const mongoose = require('mongoose');
const otpModel = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const { checkFraud } = require('../services/aiService');


/**
 * - Create a new transaction
 * The 10 step - transfer flow :-
 * * 1.Validate request
 * * 2. Validate idempotency key
 * * 3. check accounts status
 * * 4. Derive sender balance from ledger
 * * 5. Create transaction with PENDING status
 * * 6. Create DEBIT ledger entry for sender
 * * 7. Create CREDIT ledger entry for receiver
 * * 8. Update transaction status to COMPLETED
 * * 9. Commit mongoDB transaction
 * * 10. send email notification to sender and receiver
 * * */
async function requestTransferOTP(req, res) {
    const { amount } = req.body;
    if (amount <= 10000) return res.status(400).json({ message: "OTP not required for this amount." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    await otpModel.deleteMany({ userId: req.user._id }); // Clear old OTPs
    await otpModel.create({ userId: req.user._id, otp, expiresAt });

    await emailService.sendEmail(
        req.user.email, 
        "Transfer OTP Verification", 
        `Your OTP is ${otp}`, 
        `<h1>Transfer Verification</h1><p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    );

    res.status(200).json({ message: "OTP sent to your email." });
}

async function createTransaction(req, res) {

    /* 1.Validate request - Added custom category and description extraction */
    const { fromAccount, toAccount, amount, idempotencyKey, pin, category, description } = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey || !pin){   
        return res.status(400).json({ 
            message: "fromAccount, toAccount, amount, idempotencyKey and pin are required." });
    }

    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
            message: "Amount must be a positive number"
        });
    }


    // const fromUserAccount = await accountModel.findOne({
    //     _id: fromAccount,
    // });

    // const toUserAccount = await accountModel.findOne({
    //     _id: toAccount,
    // });

    // 1. Validate the 'To' Account (This one is usually a specific target)
const toUserAccount = await accountModel.findOne({ _id: toAccount });
if (!toUserAccount) {
    return res.status(400).json({ message: "Invalid toAccount" });
}

// 2. FIND THE CORRECT 'FROM' ACCOUNT (Automatically)
// Get ALL active accounts for the logged-in user
const userAccounts = await accountModel.find({ user: req.user._id, status: 'ACTIVE' });


for (let acc of userAccounts) {
    const bal = await acc.getBalance();
    

let fromUserAccount = null;

// Check which one has enough money to cover the 'amount'
for (let acc of userAccounts) {
    const bal = await acc.getBalance();
    if (bal >= amount) {
        fromUserAccount = acc;
        break; // We found the account with the money!
    }
}


for (let acc of userAccounts) {
    const bal = await acc.getBalance();
   
}

if (!fromUserAccount) {
    return res.status(400).json({ 
        message: "No account found with sufficient balance to cover this transfer." 
    });
}

// Now continue with your existing code...

    console.log("From Account Document Found:", fromUserAccount);
    console.log("To Account Document Found:", toUserAccount);
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({ message: "Invalid fromAccount or toAccount" });
    }


    /* VERIFY TRANSACTION PIN */
    const account = await accountModel
        .findById(fromAccount)
        .populate({
            path: 'user',
            select: '+transactionPin'
        });

    if(!account || !account.user.transactionPin){
        return res.status(400).json({
            message: "Transaction PIN not set"
        });
    }

    const isValidPin = await bcrypt.compare(
        pin,
        account.user.transactionPin
    );

    if(!isValidPin){
        return res.status(401).json({
            message: "Invalid transaction PIN"
        });
    }

    /* 2. Validate idempotency key*/ 
    const isTransactionAlreadyExists = await transactionModel.findOne({ 
        idempotencyKey : idempotencyKey });

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === 'COMPLETED'){
            return res.status(200).json({ 
                message: "Transaction already processed.",
                transaction : isTransactionAlreadyExists
             });
        }

        if(isTransactionAlreadyExists.status === 'PENDING'){
            return res.status(200).json({ 
                message: "Transaction is still pending.",
             });
        }

        if(isTransactionAlreadyExists.status === 'FAILED'){
            return res.status(500).json({ 
                message: "Transaction processing failed previously. Please retry.",
             });
        }

        if(isTransactionAlreadyExists.status === 'REVERSED'){
            return res.status(500).json({ 
                message: "Transaction has been reversed. Please retry.",
             });
        }
    }

    /* 3. check accounts status */
    if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
        return res.status(400).json({ message: "Both toAccount and fromAccount must be active to process transaction." });
    }


    let transaction;
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        /* 4. Derive sender balance from ledger */
        const balance = await fromUserAccount.getBalance();

        if(balance < amount){
            return res.status(400).json({ 
                message: `Insufficient balance . Current balance: ${balance}, Requested amount: ${amount}` });
        }
        
        /* OTP CHECK FOR LARGE TRANSACTIONS */
        /* OTP CHECK FOR LARGE TRANSACTIONS */
        if (amount > 10000) {
            const { otp } = req.body; // Expecting the OTP from the frontend in the body

            if (!otp) {
                return res.status(400).json({ 
                    message: "OTP required for transactions above 10,000. Please request and enter OTP." 
                });
            }

            // Check if the provided OTP matches the one in the database
            const validOTP = await otpModel.findOne({
                userId: req.user._id,
                otp: otp, // Compare directly
                expiresAt: { $gt: new Date() }
            });

            if (!validOTP) {
                return res.status(403).json({ 
                    message: "Invalid or expired OTP." 
                });
            }

            // OTP is valid, remove it so it cannot be reused
            await otpModel.deleteOne({ _id: validOTP._id });
        }

        
        
        // Run the AI Fraud Check
          // 1. Run the AI Fraud Check
        const history = await ledgerModel.find({ account: fromUserAccount._id })
            .sort({ _id: -1 })
            .limit(10); 

        const fraudAnalysis = await checkFraud(amount, history);

        // 2. ADD THIS CHECK: If suspicious, stop the execution here!
        if (fraudAnalysis.isSuspicious) {
            console.log("Fraud Alert: Blocking transaction.");
            // This return prevents the rest of the function (the transfer logic) from running
            return res.status(403).json({ 
                fraudDetected: true, 
                message: fraudAnalysis.warning 
            });
        }


// /* 5. Create transaction with PENDING status... */

        if(amount > 50000){
            await FraudLog.create({
                userId: req.user._id,
                reason: 'LARGE_TRANSACTION',
                amount,
                riskLevel: 'HIGH',
                riskScore: 90,
                fraudType: 'UNUSUAL_AMOUNT',
                status: 'SUSPICIOUS'
            });
        }

        /* TOO MANY TRANSACTIONS CHECK */
        const recentTransactions = await transactionModel.countDocuments({
            fromAccount: fromUserAccount._id, // <--- USE THE FOUND ACCOUNT
            createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
        });

        console.log("Recent Transactions:", recentTransactions);

        if(recentTransactions >= 5){
            await FraudLog.create({
                userId: req.user._id,
                reason: 'TOO_MANY_TRANSACTIONS',
                amount,
                riskLevel: 'MEDIUM',
                riskScore: 75,
                fraudType: 'RAPID_TRANSACTIONS',
                status: 'SUSPICIOUS'
            });
        }

        /* 5. Create transaction with PENDING status and formatted dynamic note details */
        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING',
            note: `${category || 'Transfer'} | ${description || 'Digital Transfer Ledger Entry'}`
        }], { session }))[0];


        /* 6. Create DEBIT ledger entry for sender */
       /* 6. Create DEBIT ledger entry for sender */
await ledgerModel.create([{
    account: fromUserAccount._id, // <--- USE THE ACCOUNT WE FOUND
    amount,
    transaction: transaction._id,
    type: 'DEBIT'
}], { session });


        /* 7. Create CREDIT ledger entry for receiver */
        await ledgerModel.create([{
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: 'CREDIT'
        }], { session });


        /* 8. Update transaction status to COMPLETED */
        transaction.status = 'COMPLETED';

        await otpModel.deleteMany({
            userId: req.user._id
        });

        await transaction.save({ session });


        /* 9. Commit mongoDB transaction */
        await session.commitTransaction();

        if(amount <= 50000 && recentTransactions < 5){
            await FraudLog.create([{
                userId: req.user._id,
                reason: 'NORMAL_TRANSACTION',
                amount,
                riskLevel: 'LOW',
                riskScore: 10,
                fraudType: 'NORMAL_ACTIVITY',
                status: 'NORMAL'
            }], { session });
        }

        await createAuditLog({
            userId: req.user._id,
            action: 'MONEY_TRANSFER',
            req
        });

        global.io.emit('transaction-success', {
            message: 'Transaction completed successfully',
            amount,
            fromAccount,
            toAccount
        });

        console.log('Socket event emitted');
    }
    catch (err) {
        console.log(err);

        /* rollback transaction */
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        /* update status to FAILED */
        if (transaction) {
            transaction.status = 'FAILED';
            await transaction.save();
        }

        return res.status(500).json({
            message: "Transaction failed"
        });
    }
    finally {
        /* always close session */
        if (session) {
            session.endSession();
        }
    }

    /* 10. send email notification to sender and receiver */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, fromAccount, toAccount); 

    return res.status(201).json({ 
        message: "Transaction created successfully.",
        transaction : transaction
     });
}
}

async function createInitialFundsTransaction(req, res) {
    const {toAccount , amount, idempotencyKey} = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ message: "toAccount, amount and idempotencyKey are required." });
    }

    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
            message: "Amount must be a positive number"
        });
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });
        
    if(!toUserAccount){
        return res.status(400).json({ message: "Invalid toAccount" });
    }


    const fromUserAccount = await accountModel.findOne({
         user: req.user._id
    });

    if(!fromUserAccount){
        return res.status(400).json({ message: "System account for user not found." });
    }

    const session  =  await  mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING'
    });

    await transaction.save({ session });

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }], { session });

    const creditLedgerEntry = await ledgerModel.create([{
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: 'CREDIT'
    }], { session });

    transaction.status = 'COMPLETED';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ 
        message: "Initial funds transaction created successfully.",
        transaction : transaction
     });
}

async function getUserTransactions (req, res)  {
    try {
        const userId = req.user.id;

        const accounts = await accountModel.find({
            user: userId
        });

        const accountIds = accounts.map(account => account._id);

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        })
        .populate('fromAccount')
        .populate('toAccount')
        .sort({ createdAt: -1 });

        // Add this right after you get fromAccount from the request
console.log("DEBUG: Transfer requested FROM Account ID:", fromAccount);
        res.status(200).json({
            transactions
        });

    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
}

module.exports = { createTransaction, createInitialFundsTransaction, getUserTransactions, requestTransferOTP };
