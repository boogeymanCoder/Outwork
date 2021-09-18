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

router.get('/', auth.checkIfAuthenticated, async (req, res) => {
    const jobs = await Job.find({});
    res.render('index', { jobs: jobs });
});

router.delete('/logout', (req, res) => {
    req.logOut();
    
    req.flash('info', 'Account has been successfuly logged out');
    res.redirect('/login');
});

module.exports = router;