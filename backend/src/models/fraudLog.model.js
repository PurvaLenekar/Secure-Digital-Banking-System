const mongoose = require('mongoose');

const fraudLogSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    reason: {
        type: String
    },

    amount: {
        type: Number
    },

    riskLevel: {

        type: String,

        enum: ['LOW', 'MEDIUM', 'HIGH'],

        required: true
    },

    riskScore: {

        type: Number,

        required: true
    },

    fraudType: {

        type: String
    },

    status: {

        type: String,

        enum: ['NORMAL', 'SUSPICIOUS', 'BLOCKED'],

        default: 'NORMAL'
    },

    timestamp: {

        type: Date,

        default: Date.now
    }

});

// Ensure it matches your database collection exactly
module.exports = mongoose.model('FraudLog', fraudLogSchema, 'fraudlogs');