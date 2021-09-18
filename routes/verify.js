const express = require('express');
const router = express.Router();

const Account = require('../models/account');
const Otp = require('../models/otp');
const auth = require('./auth');

router.get('/verify', auth.checkIfNotAuthenticated, async (req, res) => {
    res.render('account/verify', {
        otp: ''
    });
});

router.post('/verify', auth.checkIfNotAuthenticated, async (req, res) => {
    const otpPin = req.body.otp;

    const otp = await Otp.findOne({
        pin: otpPin,
        type: 'verification'
    });
    if(otp == null) {
        req.flash('error', 'Invalid OTP')
        return res.render('account/verify', {
            otp: otpPin
        });
    }

    const accountId = otp.accountId;
    const account = await Account.findById(accountId);
    account.verified = true;
    await account.save();
    await otp.delete();
    
    req.flash('info', 'Account has been verified');
    res.redirect('/login');
});

module.exports = router;