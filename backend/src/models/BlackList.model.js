const mongoose = require('mongoose');


const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,   
        required: [true, "Token is required to blacklist"],
        unique: [true, "This token is already blacklisted"] 
    }
} , {
    timestamps: true
});

tokenBlacklistSchema.index({ createdAt : 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 }); // Automatically remove blacklisted tokens after 24 hours

const tokenBlacklistModel = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = tokenBlacklistModel;