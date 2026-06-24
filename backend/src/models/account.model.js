const mongoose =  require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Account must be associated with a user."],
        index: true
    },
    status:{
        type:String,
        enum: {
            values: ['ACTIVE', 'INACTIVE', 'CLOSED'],
            message: 'Status must be either ACTIVE, INACTIVE, or CLOSED.',
           
        },
         default: 'ACTIVE'
    },
    currency:{
        type: String,
        required: [true, "Currency is required for creating an account."],
        default: 'INR',
    }
}, {
    timestamps: true
});

accountSchema.index({ user: 1 , status: 1 });

// accountSchema.methods.getBalance = async function(session = null) {

//     const balanceData = await ledgerModel.aggregate([

//         { 
//             $match: { account: this._id } 
//         },

//         { 
//             $group: {

//                 _id: null,

//                 totalDebit: {
//                     $sum: {
//                         $cond: [
//                             { $eq: ["$type", "DEBIT"] },
//                             "$amount",
//                             0
//                         ]
//                     }
//                 },

//                 totalCredit: {
//                     $sum: {
//                         $cond: [
//                             { $eq: ["$type", "CREDIT"] },
//                             "$amount",
//                             0
//                         ]
//                     }
//                 }

//             }
//         },

//         {
//             $project: {
//                 _id: 0,
//                 balance: {
//                     $subtract: ["$totalCredit", "$totalDebit"]
//                 }
//             }
//         }

//     ]).session(session);


//     if (balanceData.length === 0) {
//         return 0;
//     }

//     return balanceData[0].balance;
// }


accountSchema.methods.getBalance = async function(session = null) {
    // 1. Log the ID we are checking
    console.log("DEBUG: Calculating balance for Account ID:", this._id);

    // 2. See if there are ANY entries at all for this account
    const allEntries = await ledgerModel.find({ account: this._id });
    console.log("DEBUG: Found", allEntries.length, "ledger entries for this account.");
    
    // 3. Log the entries to see if the amounts make sense
    allEntries.forEach((e, i) => console.log(`Entry ${i}: ${e.type} | ${e.amount}`));

    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        { 
            $group: {
                _id: null,
                totalDebit: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } },
                totalCredit: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } }
            }
        },
        { $project: { _id: 0, balance: { $subtract: ["$totalCredit", "$totalDebit"] } } }
    ]).session(session);

    const finalBalance = balanceData.length > 0 ? balanceData[0].balance : 0;
    console.log("DEBUG: Final Calculated Balance:", finalBalance);
    
    return finalBalance;
}


const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;
