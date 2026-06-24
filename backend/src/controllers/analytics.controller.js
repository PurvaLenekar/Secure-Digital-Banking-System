const userModel = require('../models/user.model');
const transactionModel = require('../models/transaction.model');
const FraudLog = require('../models/fraudLog.model');

async function getAnalyticsController(req, res) {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalTransactions = await transactionModel.countDocuments();
        const totalFraudAttempts = await FraudLog.countDocuments();
        
        // Calculate Volume
        const transactions = await transactionModel.find({ status: 'COMPLETED' });
        // Use 0 as default if array is empty
        const totalMoneyTransferred = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

        const recentLogs = await FraudLog.find().sort({ timestamp: -1 }).limit(5);
        const flaggedUsers = await userModel.find({ isFlagged: true }).limit(5);

        res.status(200).json({
            kpis: {
                volume: `₹ ${totalMoneyTransferred.toLocaleString()}`,
                approvalRate: "98.4%",
                anomalies: totalFraudAttempts,
                activeUsers: totalUsers
            },
            chartData: [ 
                { name: 'Mon', volume: 4000 },
                { name: 'Tue', volume: 3000 },
                { name: 'Wed', volume: 5000 }
            ],
            logs: recentLogs,
            riskUsers: flaggedUsers
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Error fetching analytics", error });
    }
}

module.exports = { getAnalyticsController };