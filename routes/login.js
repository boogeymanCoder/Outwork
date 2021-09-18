const express = require('express');
const router = express.Router();
const passport = require('passport');
const otpGenerator = require('otp-generator');

const Account = require('../models/account');
const mail = require('./mail');
const Otp = require('../models/otp');
const auth = require('./auth');

router.get('/', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('login/login');
});

router.post('/', auth.checkIfNotAuthenticated, async (req, res, next) => {
    const account = await Account.findOne({
        $or: [
            { email: req.body.emailUsername }, 
            { username: req.body.emailUsername }
        ]
    });

    if (account == null || account.verified) return next();

    var otp = await Otp.findOne({
        accountId: account.id,
        type: 'verification'
    });
    if (otp == null) {
        otp = new Otp({
            accountId: account.id,
            pin: otpGenerator.generate(6),
            type: 'verification'
        });
    }

    await otp.save();
    await mail.sendVerificationMail(account.email, otp.pin, req);
    req.flash('info', 'Sending verification OTP to your email');
    next();
}, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    })
);


module.exports = router;
