const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }, 
    until: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model("Otp", otpSchema);