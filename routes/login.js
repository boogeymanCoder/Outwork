const express = require('express');
const router = express.Router();
const passport = require('passport');
const otpGenerator = require('otp-generator');

const Account = require('../models/account');
const mail = require('./mailer');
const Otp = require('../models/otp');
const auth = require('./auth');

router.all('*', auth.checkIfNotAuthenticated);

router.get('/', (req, res) => {
    res.render('login/login', {
        auth: req.isAuthenticated()
    });
});

router.post('/', async (req, res, next) => {
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
            pin: otpGenerator.generate(),
            type: 'verification'
        });
        await otp.save();
    }

    await mail.sendVerificationMail(account.email, otp.pin, req)
    .then(() => {
        req.flash('info', 'Verification OTP email sent');
    })
    .catch(() => req.flash('error', 'Verification OTP email not sent'));
    next();
}, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    })
);

module.exports = router;
