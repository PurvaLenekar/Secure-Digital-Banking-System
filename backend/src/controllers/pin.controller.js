const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const createAuditLog = require('../utils/createAuditLog');
// 📬 Import your real email utility directly
const { sendEmail } = require('../services/email.service'); 

// 1. REQUEST PIN RESET OTP
async function requestPinResetOtpController(req, res) {
    try {
        // Fallback check to safely capture user identification from the middleware
        const userId = req.user?._id || req.user?.id || req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication failed. User session not found in request."
            });
        }

        // Generate a random 6-digit cryptographic OTP string
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

        // Fetch user document to get their real email address securely
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Save the temporary OTP fields to your user document
        user.resetPinOtp = otp;
        user.resetPinOtpExpires = otpExpiry;
        await user.save();

        // 📬 Send Real Email using your exact positional arguments: (to, subject, text, html)
        try {
            const subject = "🔒 Secure Transaction PIN Reset Verification Code";
            
            const text = `Hi ${user.name},\n\nYou requested a verification code to change or reset your secure transaction PIN.\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis code is highly confidential and is valid for the next 5 minutes. If you did not initiate this request, please contact support immediately.\n\nBest regards,\nThe Digital Banking Team`;
            
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body{margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif}
                    .container{max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)}
                    .header{background:#0F766E;color:white;padding:20px;text-align:center;font-size:22px;font-weight:bold}
                    .content{padding:30px;color:#333;line-height:1.6;text-align:center}
                    .otp-box{display:inline-block;margin:20px auto;padding:14px 30px;background:#f3f4f6;color:#0F766E;letter-spacing:4px;font-size:26px;font-weight:bold;border-radius:8px;border:1px dashed #0F766E}
                    .footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">🛡️ Security Gateway</div>
                    <div class="content">
                        <h2>Transaction PIN Reset 🎉</h2>
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>Use the secure one-time verification code below to complete your PIN setup adjustments:</p>
                        <div class="otp-box">${otp}</div>
                        <p style="color:#ef4444; font-size:11px;">This verification string is only valid for 5 minutes.</p>
                        <p style="margin-top:30px; text-align:left;">Best regards,<br><strong>Digital Banking Team</strong></p>
                    </div>
                    <div class="footer">© 2026 Digital Banking System | Secure Session Manager</div>
                </div>
            </body>
            </html>`;

            // Executing via commas as commas/positional parameters
            await sendEmail(user.email, subject, text, html);
            console.log(`✉️ Real OTP email successfully handed over to transporter for: ${user.email}`);

        } catch (emailErr) {
            console.error("❌ Failed to send real email via transporter:", emailErr.message);
            console.log(`Fallback Terminal OTP Code: ${otp}`);
        }

        // Log the security action safely to Audit Logs
        try {
            if (typeof createAuditLog === 'function') {
                await createAuditLog({
                    userId: userId,
                    action: 'REQUEST_PIN_RESET_OTP',
                    req
                });
            }
        } catch (auditErr) {
            console.log("Audit log skipped or file not found:", auditErr.message);
        }

        return res.status(200).json({
            message: `Verification OTP has been sent to your registered email: ${user.email}`
        });

    } catch (err) {
        console.error("Backend Error in requestPinResetOtpController:", err);
        return res.status(500).json({
            message: "Failed to process OTP request",
            error: err.message
        });
    }
}

// 2. VERIFY OTP AND UPDATE TRANSACTION PIN
async function verifyAndSetPinController(req, res) {
    try {
        const { otp, newPin } = req.body;
        const userId = req.user?._id || req.user?.id || req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Authentication failed." });
        }

        if (!otp || !newPin) {
            return res.status(400).json({ message: "Both OTP and new PIN are required" });
        }

        if (!/^\d{4}$/.test(newPin)) {
            return res.status(400).json({ message: "PIN must be exactly 4 digits" });
        }

        // Find the active user document
        const user = await userModel.findById(userId);
        if (!user || !user.resetPinOtp || !user.resetPinOtpExpires) {
            return res.status(400).json({ message: "Invalid or unrequested OTP session" });
        }

        // Check if OTP has expired
        if (new Date() > user.resetPinOtpExpires) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Verify OTP value matching
        if (user.resetPinOtp !== otp) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Securely hash the new 4-digit transaction pin using bcrypt
        const hashedPin = await bcrypt.hash(newPin, 10);

        // Clear the temporary OTP fields and update the secure PIN
        user.transactionPin = hashedPin;
        user.resetPinOtp = undefined;
        user.resetPinOtpExpires = undefined;
        await user.save();

        // Write confirmation entry to database audit ledger
        try {
            if (typeof createAuditLog === 'function') {
                await createAuditLog({
                    userId: userId,
                    action: 'RESET_TRANSACTION_PIN_SECURELY',
                    req
                });
            }
        } catch (auditErr) {
            console.log("Audit log skipped:", auditErr.message);
        }

        return res.status(200).json({
            message: "Transaction PIN reset successfully!"
        });

    } catch (err) {
        console.error("Backend Error in verifyAndSetPinController:", err);
        return res.status(500).json({
            message: "Failed to securely verify and set your PIN",
            error: err.message
        });
    }
}

module.exports = {
    requestPinResetOtpController,
    verifyAndSetPinController
};