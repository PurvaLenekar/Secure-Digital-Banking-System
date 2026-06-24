const sendOTP = require('../services/otp.service');
const otpModel = require('../models/otp.model');
const createAuditLog = require('../utils/createAuditLog');


async function generateOTPController(req, res) {
    try {

        await sendOTP(req.user);

        return res.status(200).json({
            message: "OTP sent successfully to your email"
        });

        await createAuditLog({
            userId: req.user._id,
            action: 'OTP_VERIFIED',
            req
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to send OTP",
            error: err.message
        });
    }
}

async function verifyOTPController(req, res) {

    try {

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required"
            });
        }

        // 1. Find latest OTP for user
        const record = await otpModel.findOne({
            userId: req.user._id,
            otp,
            verified: false
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // 2. Check expiry
        if (record.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // 3. Mark as verified
        record.verified = true;
        await record.save();

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: "OTP verification failed",
            error: err.message
        });
    }
}


module.exports = { generateOTPController, verifyOTPController };