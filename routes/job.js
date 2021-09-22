const { application } = require('express');
const express = require('express');
const router = express.Router();

const Job = require('../models/job');
const Application = require('../models/application');

// TODO add route job/apply
// TODO add route job/invitation

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
    const applicationRequests = await Application.find({ jobId: job.id });
    if (job.employer === req.user.username) {
        res.render('job/edit_job', { job: job, applications: applicationRequests });
    } else {
        res.render('job/view_job', { job: job, applications: applicationRequests });
    }
});

// TODO change date when updating job
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

    const applicationRequest = new Application();
    applicationRequest.employee = req.user.username;
    applicationRequest.jobId = job.id;
    applicationRequest.message = req.body.message;
    applicationRequest.time = new Date();

    await applicationRequest.save();

    req.flash('info', 'Apllication request successfully sent');
    res.redirect('/');
});

module.exports = router;