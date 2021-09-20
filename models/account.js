const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true,
        unique: false,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    stateProvinceRegion: {
        type: String,
        required: true
    },
    zipPostalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Account', accountSchema);
