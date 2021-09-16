const express = require('express');
const router = express.Router();

const Job = require('../models/job');

router.post('/new', async (req, res) => {
    const job = new Job({
        name: req.body.name,
        location: req.body.location,
        details: req.body.details,
        skills: req.body.skills,
        employer: req.user.id,
        postDate: new Date()
    });

    await job.save();
    req.flash('info', 'posted successfully');
    res.redirect('/');
});

module.exports = router;