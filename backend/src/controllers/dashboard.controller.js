const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');

// ==========================================
// GET DASHBOARD OVERVIEW DATA
// ==========================================
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User identity missing from token context." });
    }

    // Locate account linked to individual user
    const account = await Account.findOne({ user: userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Wallet entity not registered for this user profile." });
    }

    // Pull systemic records where this account is the sender or receiver
    const transactions = await Transaction.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10); // pulling the last 10 activities for clean UX

    return res.status(200).json({
      success: true,
      dashboardData: {
        userId,
        totalBalance: account.totalBalance || 0,
        totalIncome: account.totalIncome || 0,
        totalExpense: account.totalExpense || 0,
        transactions
      }
    });

  } catch (error) {
    console.error("Dashboard controller error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// POST ADD FUNDS (DEPOSIT MONEY)
// ==========================================
exports.addFundsController = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Please provide a valid deposit amount." });
    }

    // 1. Locate current user's financial record wallet
    const account = await Account.findOne({ user: userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Financial wallet account not found." });
    }

    const parsedAmount = parseFloat(amount);

    // 2. Adjust core math balances directly in storage
    account.totalBalance = (account.totalBalance || 0) + parsedAmount;
    account.totalIncome = (account.totalIncome || 0) + parsedAmount;
    await account.save();

    // 3. Generate a distinct key string hash to safely conform to your unique index restriction
    const systemIdempotencyKey = `DEP-${userId}-${Date.now()}`;

    // 4. Record entry to historical trace collection log
    const newDepositTransaction = await Transaction.create({
      toAccount: account._id,
      fromAccount: null, // External source pipeline feed
      amount: parsedAmount,
      type: 'DEPOSIT', 
      status: 'COMPLETED',
      note: description || "Manually Deposited Funds",
      idempotencyKey: systemIdempotencyKey
    });

    return res.status(200).json({
      success: true,
      message: "Funds successfully credited to account.",
      updatedBalance: account.totalBalance,
      transaction: newDepositTransaction
    });

  } catch (error) {
    console.error("ADD FUNDS CONTROLLER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};