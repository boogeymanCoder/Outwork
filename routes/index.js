const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const otpGenerator = require('otp-generator');

const Account = require('../models/account');
const mail = require('./mail');
const Otp = require('../models/otp');
const auth = require('./auth');
const Job = require('../models/job');

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

router.get('/', auth.checkIfAuthenticated, async (req, res) => {
    const jobs = await Job.find({});
    res.render('index', { jobs: jobs });
});

router.get('/login', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('account/login');
});

router.post('/login', auth.checkIfNotAuthenticated, async (req, res, next) => {
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

router.get('/register', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('account/register',  { account: new Account() });
});

router.post('/register', auth.checkIfNotAuthenticated, async (req, res) => {
    const account = new Account({
        username: req.body.username,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        number: req.body.number,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        stateProvinceRegion: req.body.stateProvinceRegion,
        zipPostalCode: req.body.zipPostalCode,
        country: req.body.country,
        email: req.body.email,
        password: req.body.password,
    });

    if (await Account.findOne({ username: req.body.username }) != null ) {
        req.flash('error', 'Username already exists');
        return res.render('account/register',  { 
            account: account
        });
    }

    if (await Account.findOne({ email: req.body.email }) != null ) {
        req.flash('error', 'Email already exists');
        return res.render('account/register',  { 
            account: account
        });
    }

    await account.validate().then(async (val) => {
        const otp = new Otp({
            accountId: account.id,
            pin: otpGenerator.generate(6),
            type: 'verification'
        });
    
        await mail.sendVerificationMail(account.email, otp.pin, req);
    
        account.password = await bcrypt.hash(req.body.password, 10);
        await account.save();
        await otp.save();
        
        req.flash('info', `Please enter OTP sent to ${ account.email }`);
        res.redirect('/verify');
    }).catch(err => {
        var errorMessage = '';
        for (var e in err.errors) {
            errorMessage += err.errors[e];
            break;
        } 

        req.flash('error', `${ errorMessage }` );
        return res.render('account/register',  { 
            account: account
        });
    });
});

router.delete('/logout', (req, res) => {
    req.logOut();
    
    req.flash('info', 'Account has been successfuly logged out');
    res.redirect('/login');
});

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

router.get('/recover', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('account/recover', {
        email: ''
    });
});

router.post('/recover', auth.checkIfNotAuthenticated, async (req, res) => {
    const account = await Account.findOne({ email: req.body.email });
    if (account == null) {
        req.flash('error', 'Email does not exist');
        return res.render('account/recover', {
            email: req.body.email
        });
    }

    await recoveryMailer(account, req);

    req.flash('info', 'Sending recovery OTP to your email');
    res.redirect(`/recover/${ account.id }/otp`);
});

router.get('/recover/:id/otp', auth.checkIfNotAuthenticated, (req, res) => {
    res.render('account/recover_otp', {
        otp: '',
        id: req.params.id
    });
});

router.post('/recover/:id/otp', auth.checkIfNotAuthenticated, async (req, res) => {
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
        return res.render('account/recover_otp', {
            otp: req.body.otp,
            id: req.params.id
        });
    } else {
        let now = new Date();
        if (now > otp.until) {
            await otp.delete();

            await recoveryMailer(account, req);

            req.flash('error', 'OTP Expired, sending new recovery OTP');
            return res.render('account/recover_otp', {
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