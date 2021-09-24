const express = require('express');
const router = express.Router();

const Job = require('../models/job');
const Application = require('../models/application');
const auth = require("./auth");

// TODO add route job/invitation
// TODO add route job/accept/:application_id

router.all('*', auth.checkIfAuthenticated);

router.post('/new', async (req, res) => {
    const job = new Job({
        name: req.body.name,
        location: req.body.location,
        details: req.body.details,
        skills: req.body.skills,
        employer: req.user.username,
        postDate: new Date()
    });

    await job.save();
    req.flash('info', 'posted successfully');
    res.redirect('/');
});

router.get('/view/:job_id', async (req, res) => {
    const job = await Job.findById(req.params.job_id);
    const applications = await Application.find({ jobId: job.id });
    applications.sort((a, b) => b.time - a.time);
    if (job.employer === req.user.username) {
        res.render('job/edit_job', { job: job, applications: applications });
    } else {
        res.render('job/view_job', { job: job, applications: applications });
    }
});

router.patch('/update', async (req, res) => {
    const job = await Job.findById(req.body.job_id);

    if (job === null) {
        req.flash('error', 'Something went wrong.');
        return res.redirect('/profile');
    }

    if (job.employer !== req.user.username) {
        req.flash('error', 'Update denied, job not owned.');
        return res.redirect('/profile');
    }

    job.name = req.body.name;
    job.location = req.body.location;
    job.skills = req.body.skills;
    job.details = req.body.details;
    job.postDate = new Date();

    await job.save();

    req.flash('info', 'Job successfuly updated.');
    res.redirect(`/job/view/${req.body.job_id}`);
});

router.post('/apply/:job_id', async (req, res) => {
    console.log(req.user);
    const job = await Job.findById(req.params.job_id);

    if (job === null) {
        req.flash('error', 'Job not found');
        return res.redirect('/');
    }

    const application = new Application();
    application.employee = req.user.username;
    application.jobId = job.id;
    application.message = req.body.message;
    application.time = new Date();

    await application.save();

    req.flash('info', 'Apllication request successfully sent');
    res.redirect('/');
});

// router.patch('job/accept/:application_id', (req, res) => {
//     const 
// });

module.exports = router;