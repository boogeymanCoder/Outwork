const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');

const Account = require('../models/account');
const mail = require('./mail');
const Otp = require('../models/otp');
const auth = require('./auth');

router.all('*', auth.checkIfNotAuthenticated);

router.get('/', (req, res) => {
    res.render('register/register',  { account: new Account() });
});

router.post('/', async (req, res) => {
    const account = new Account({
        username: req.body.username,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        gender: req.body.gender,
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
        return res.render('register/register',  { 
            account: account
        });
    }

    if (await Account.findOne({ email: req.body.email }) != null ) {
        req.flash('error', 'Email already exists');
        return res.render('register/register',  { 
            account: account
        });
    }

    //check password at backend as well
    //prevents registering weak passwords by edditing on element inspector
    if (!auth.checkPasswordStrength(req.body.password)) {
        req.flash('error', 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least eight characters long.');
        return res.render('register/register',  { 
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
        return res.render('register/register',  { 
            account: account
        });
    });
});

module.exports = router;