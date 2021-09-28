const express = require('express');
const router = express.Router();

const auth = require('./auth');
const Job = require('../models/job');
const ja = require('./jobapplication');

router.get('/', auth.homeCheckIfAuthenticated, async (req, res) => {
    const jobs = await Job.find({});
    var job_applications = await ja.getAllJobApplications(jobs, req.user.username);
    jobs.sort((a, b) => b.postDate - a.postDate);
    res.render('index', { job: new Job(), jobs: jobs, username: req.user.username, job_applications: job_applications});
});

router.delete('/logout', (req, res) => {
    req.logOut();
    
    req.flash('info', 'Account has been successfuly logged out');
    res.redirect('/login');
});

module.exports = router;