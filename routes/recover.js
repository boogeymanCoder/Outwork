const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');

const Account = require('../models/account');
const mail = require('./mail');
const Otp = require('../models/otp');
const auth = require('./auth');

async function recoveryMailer(account, req){
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);

    var otp = await Otp.findOne({
        accountId: account.id,
        type: 'recovery'
    });

    if (otp == null) {
        otp = new Otp({
            accountId: account.id,
            pin: otpGenerator.generate(6),
            type: 'recovery',
            until: now
        });
    }
    
    await mail.sendRecoveryMail(account.email, otp.pin, account.id, req);
    await otp.save();
}

router.get('/', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('recover/recover', {
        email: ''
    });
});

router.post('/', auth.checkIfNotAuthenticated, async (req, res) => {
    const account = await Account.findOne({ email: req.body.email });
    if (account == null) {
        req.flash('error', 'Email does not exist');
        return res.render('recover/recover', {
            email: req.body.email
        });
    }

    await recoveryMailer(account, req);

    req.flash('info', 'Sending recovery OTP to your email');
    res.redirect(`/recover/${ account.id }/otp`);
});

router.get('/:id/otp', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('recover/recover_otp', {
        otp: '',
        id: req.params.id
    });
});

router.post('/:id/otp', auth.checkIfNotAuthenticated, async (req, res) => {
    const account = await Account.findById(req.params.id).catch(err => {
        req.flash('error', 'Invalid URL');
    });
    if (account == null) {
        return res.redirect('/login');
    }

    const otp = await Otp.findOne({
        pin: req.body.otp,
        type: 'recovery'
    });
    if (otp == null) {
        req.flash('error', 'Invalid OTP')
        return res.render('recover/recover_otp', {
            otp: req.body.otp,
            id: req.params.id
        });
    } else {
        let now = new Date();
        if (now > otp.until) {
            await otp.delete();

            await recoveryMailer(account, req);

            req.flash('error', 'OTP Expired, sending new recovery OTP');
            return res.render('recover/recover_otp', {
                otp: req.body.otp,
                id: req.params.id
            });

        }
    }

    if (otp.accountId != account.id) {
        return res.redirect('/');
    }

    const password = otpGenerator.generate(6);

    account.password = await bcrypt.hash(password, 10);
    await account.save();

    await mail.sendNewPassMail(account.email, password, req);

    await otp.delete();

    req.flash('info', 'Sending new password to your email');
    res.redirect('/login');
});

module.exports = router;