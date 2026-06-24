const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: false,
        index: true
    },

    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: false,
        index: true
    },

    // NEW FIELD
    type: {
        type: String,
        enum: ['TRANSFER', 'DEPOSIT', 'WITHDRAW'],
        required: true,
        default: 'TRANSFER'
    },

    status:{
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED', 'FAILED' , 'REVERSED'],
            message: 'Status must be either PENDING, COMPLETED, FAILED, or REVERSED.',
        },
        default: 'PENDING'
    },

    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction."],
        min: [0, "Amount must be a positive number."]
    },

    // OPTIONAL NOTE
    note: {
        type: String,
        default: ''
    },

    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for creating a transaction."],
        index: true,
        unique: true
    }

}, {
    timestamps: true
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;