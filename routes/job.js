const express = require('express');
const router = express.Router();

const Job = require('../models/job');
const Application = require('../models/application');
const auth = require("./auth");
const ja = require('./jobapplicants');

// TODO add route job/invitation
// TODO edit application message (update time on edit) "modal"
// TODO quit job
// TODO close job
// TODO should only be able to apply once

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
    req.flash('info', 'Posted successfully');
    res.redirect('/');
});

router.get('/view/:job_id', async (req, res) => {
    const job = await Job.findById(req.params.job_id);
    const applications = await Application.find({ jobId: job.id });
    applications.sort((a, b) => b.time - a.time);
    const job_applicants = await ja.getJobApplicants(job);
    if (job.employer === req.user.username) {
        res.render('job/edit_job', { job: job, applications: applications });
    } else {
        res.render('job/view_job', {
            job: job,
            applications: applications,
            username: req.user.username,
            job_applicants: job_applicants
        });
    }
});

router.patch('/update', async (req, res) => {
    const job = await Job.findById(req.body.job_id);

    if (job === null) {
        req.flash('error', 'Something went wrong.');
        return res.redirect('/profile');
    }

    if (job.employer !== req.user.username) {
        req.flash('error', 'Update denied, job not owned');
        return res.redirect('/profile');
    }

    job.name = req.body.name;
    job.location = req.body.location;
    job.skills = req.body.skills;
    job.details = req.body.details;
    job.postDate = new Date();

    await job.save();

    req.flash('info', 'Job successfuly updated');
    res.redirect(`/job/view/${req.body.job_id}`);
});

router.post('/apply/:job_id', async (req, res) => {
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

    req.flash('info', 'Application request successfully sent');
    res.redirect(`/job/view/${req.params.job_id}`);
});

router.patch('/accept/:application_id', async (req, res) => {
    const application = await Application.findById(req.params.application_id);

    if (application === null) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/');
    }

    application.accepted = true;
    await application.save();

    req.flash('info', `${application.employee} has been accepted`);
    res.redirect(`/job/view/${application.jobId}`);
});

router.delete('/cancel/:application_id', async (req, res) => {
    const application = await Application.findById(req.params.application_id);

    if (application === null) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/');
    }

    application.accepted = false;
    await application.save();
    
    req.flash('info', 'Application has been canceled');
    res.redirect(`/job/view/${application.jobId}`);
});

module.exports = router;