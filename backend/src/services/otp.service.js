const otpModel = require('../models/otp.model');
const generateOTP = require('../utils/generateOTP');
const emailService = require('./email.service');

async function sendOTP(user) {

    // 1. Generate OTP
    const otp = generateOTP();

    // 2. Set expiry time (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Save OTP in DB
    await otpModel.create({
        userId: user._id,
        otp,
        expiresAt
    });

    // 4. Send Email
    const subject = "Your OTP Code";

    const text = `Your OTP is ${otp}. It is valid for 5 minutes.`;

    const html = `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
    `;

    await emailService.sendEmail(
        user.email,
        subject,
        text,
        html
    );

    return true;
}

module.exports = sendOTP;