const mongoose = require('mongoose');

const passwordResetSchema =
new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'user',

        required: true

    },

    otp: {

        type: String,

        required: true

    },

    expiresAt: {

        type: Date,

        required: true

    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    'PasswordReset',
    passwordResetSchema
);