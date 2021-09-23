const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/account');
const Job = require('../models/job');

const auth = require('./auth');

router.all('*', auth.checkIfAuthenticated);

router.get('/', (req, res) => {
    res.redirect('profile/view/' + req.user.username);
});

router.get('/view/:username', async (req, res) => {
    if (req.user.username === req.params.username) {
        const jobs = await Job.find({employer: req.user.username});
        res.render('profile/profile.ejs', { 
            account: req.user,
            job: new Job(),
            jobs: jobs
        });
    } else {
        const account = await Account.findOne( {username: req.params.username});
        if (account !== null) {
            return res.render('profile/view.ejs', { account: account });
        }
        res.status(404).end()
    }
});

router.patch('/update', async (req, res) => {
    var passwordUpdated = false;
    const newpass1 = req.body.newpass1;
    const newpass2 = req.body.newpass2;

    if( newpass1 != '' || newpass2 != ''){
        if (newpass1 == newpass2) {
        //check password at backend as well
        //prevents registering weak passwords by edditing on element inspector
        if (!auth.checkPasswordStrength(req.body.password)) {
            req.flash('error', 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least eight characters long.');
            return res.redirect('/profile');
        }

            req.user.password = await bcrypt.hash(newpass1, 10);
            passwordUpdated = true;
        } else {
            req.flash('error', 'Passwords does not match, update failed');
            return res.redirect('/profile');
        }
    }

    req.user.firstname =  req.body.firstname;
    req.user.middlename =  req.body.middlename;
    req.user.lastname =  req.body.lastname;
    req.user.gender = req.body.gender;
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

    req.flash('info', 'Successfully updated.');
    res.redirect('/profile');
});

module.exports = router;