async function analyzeTransaction(data) {

    // HIGH RISK
    if (data.amount > 50000) {

        return {
            riskLevel: "HIGH",
            riskScore: 90,
            fraudType: "LARGE_TRANSACTION",
            reason: "Large transaction amount detected"
        };
    }

    // MEDIUM RISK
    if (data.failedLogins > 3) {

        return {
            riskLevel: "MEDIUM",
            riskScore: 60,
            fraudType: "FAILED_LOGIN_PATTERN",
            reason: "Multiple failed login attempts"
        };
    }

    // HIGH FREQUENCY
    if (data.transactionCount > 10) {

        return {
            riskLevel: "MEDIUM",
            riskScore: 55,
            fraudType: "HIGH_FREQUENCY",
            reason: "Too many transactions detected"
        };
    }

    // LOW RISK
    return {
        riskLevel: "LOW",
        riskScore: 10,
        fraudType: "NORMAL",
        reason: "Normal transaction"
    };
}

module.exports = {
    analyzeTransaction
};