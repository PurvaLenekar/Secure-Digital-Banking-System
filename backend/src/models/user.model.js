const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required for creating a user."],
        trim:true,
        unique: [true, "Email is already exists."],
        lowercase: true ,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name:{
        type : String ,
        required: [true, "Name is required for creating an account."]
    },
    password:{
        type: String,
        required: [true, "Password is required for creating an account."],
        minlength: [6, "Password must be at least 6 characters long."],
        select: false
    },
    systemUser:{
        type: Boolean,
        default: false,
        immutable: true
    },
    role:{
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    transactionPin: {
        type: String,
        select: false
    },
    resetPinOtp: {
        type: String,
        default: null
    },
    resetPinOtpExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true 
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    console.log("🔥 Hashing password..."); // debug

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;