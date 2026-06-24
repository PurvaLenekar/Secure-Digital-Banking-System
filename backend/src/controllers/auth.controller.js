const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const tokenBlacklistModel = require('../models/BlackList.model');
const createAuditLog = require('../utils/createAuditLog');
const FraudLog = require('../models/fraudLog.model');
const PasswordReset = require('../models/passwordReset.model');
const bcrypt = require('bcryptjs');

/*user register controller */
async function userRegisterController(req, res) {
    console.log("REGISTER CONTROLLER RUNNING");
try{
    const { email, name, password } = req.body;

    const isExists = await userModel.findOne({ email : email});

    if(isExists){
        return res.status(400).json({
            message: "Email is already exists.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, name, password
    });

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    
    await createAuditLog({ userId: user._id, action: 'USER_REGISTER', req });

    await emailService.sendRegistrationEmail(user.email, user.name);

    res.status(201).json({
        user:{
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })

}catch (error) {

        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
    
}

async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user  = await userModel.findOne({email}).select('+password');

    console.log("Login email:", email);
    console.log("User found:", user);

    if(!user){

        await FraudLog.create({
            reason: 'FAILED_LOGIN_ATTEMPT',
            amount: 0
        });

        await createAuditLog({

            action: 'FAILED_LOGIN',

            req

        });

        return res.status(401).json({
            message: "Invalid email or password.",
        });

    }

    const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword){

            await FraudLog.create({

            user: user._id,

            action: "LOGIN",

            riskScore: 5,

            riskLevel: "LOW"

        });

            await createAuditLog({

                userId: user._id,

                action: 'FAILED_LOGIN',

                req

            });

            return res.status(401).json({
                message: "Invalid email or password.",
            });

        }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token' , token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    await createAuditLog({ userId: user._id, action: 'USER_LOGIN', req });

    res.status(201).json({
        user:{
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
}
    

async function userLogoutController(req, res) {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(200).json({ message: "User Logged out successfully." });
    }

    res.clearCookie('token');

    await tokenBlacklistModel.create({ token : token});
    await createAuditLog({
        userId:  req.user?.userId,
        action: 'USER_LOGOUT',
        req
    });

    res.status(200).json({ message: "User Logged out successfully." });
}


async function forgotPasswordController(req, res){

    const { email } = req.body;

    const user =
    await userModel.findOne({ email });

    if(!user){
        return res.status(404).json({
            message: 'User not found'
        });

    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordReset.create({

        userId: user._id,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await emailService.sendEmail(
        user.email,
        'Password Reset OTP',
        `Your OTP is ${otp}`,
        `<h1>Your OTP is ${otp}</h1>`
    );

    return res.status(200).json({
        message:
        'Password reset OTP sent'

    });
}

async function resetPasswordController(req, res){

    const {email,otp,newPassword} = req.body;

    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const resetRecord = await PasswordReset.findOne({
        userId: user._id,
        otp
    });

    if(!resetRecord){
        return res.status(400).json({
            message: 'Invalid OTP'
        });

    }

    if(resetRecord.expiresAt < new Date()){

        return res.status(400).json({
            message: 'OTP expired'
        });

    }


    user.password = newPassword;

    await user.save();

    await PasswordReset.deleteMany({
        userId: user._id

    });

    return res.status(200).json({
        message:'Password reset successful'
    });
}

module.exports = {userRegisterController , userLoginController, userLogoutController , forgotPasswordController, resetPasswordController}