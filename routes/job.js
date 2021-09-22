const express = require('express');
const router = express.Router();

const Job = require('../models/job');

// TODO add route job/view

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

router.post('/view/:job_id', async (req, res) => {
    const job = await Job.findById(req.params.job_id);
    if (job.employer === req.user.username) {
        res.render('job/edit_job', { job: job });
    } else {
        res.render('job/view_job', { job: job });
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

    await job.save();

    req.flash('info', 'Job successfuly updated.');
    res.redirect('/profile');

});

module.exports = router;