const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/account');

const auth = require('./auth');

router.get('/', auth.checkIfAuthenticated, (req, res) => {
    res.redirect('profile/'+req.user.username);
});

router.get('/:username', auth.checkIfAuthenticated, async (req, res) => {
    if (req.user.username === req.params.username) {
        res.render('profile/profile.ejs', { account: req.user });
    } else {
        const account = await Account.findOne( {username: req.params.username});
        if (account !== null) {
            return res.render('profile/view.ejs', { account: account });
        }
        res.status(404).end()
    }
});

router.post('/update', auth.checkIfAuthenticated, async (req, res) => {
    var passwordUpdated = false;
    const newpass1 = req.body.newpass1;
    const newpass2 = req.body.newpass2;

    if( newpass1 != '' || newpass2 != ''){
        if (newpass1 == newpass2) {
            req.user.password = await bcrypt.hash(newpass1, 10);
            passwordUpdated = true;
        } else {
            req.flash('error', 'Passwords does not match');
        }
    }

    req.user.firstname =  req.body.firstname;
    req.user.middlename =  req.body.middlename;
    req.user.lastname =  req.body.lastname;
    req.user.number =  req.body.number;
    req.user.addressLine1 =  req.body.addressLine1;
    req.user.addressLine2 =  req.body.addressLine2;
    req.user.city =  req.body.city;
    req.user.stateProvinceRegion =  req.body.stateProvinceRegion;
    req.user.zipPostalCode =  req.body.zipPostalCode;
    req.user.country =  req.body.country;
    await req.user.save();

    if (passwordUpdated) {
        req.flash('info', 'Password updated');
        req.logout();
        return res.redirect('/login');
    }

    res.redirect('profile/');
});

module.exports = router;