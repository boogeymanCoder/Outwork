const express = require('express');
const router = express.Router();

const auth = require('./auth');
const Application = require('../models/application');

router.all('*', auth.checkIfAuthenticated);

router.delete('/cancel/:application_id', async (req, res) => {
    const application = await Application.findById(req.params.application_id);

    if (application === null) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/');
    }
    
    if (application.employee !== req.user.username) {
        req.flash('error', 'Cancelation denied, application not owned');
        return res.redirect('/');
    }

    const jobId = application.jobId;
    await application.delete();
    req.flash('info', 'Application cancelled');
    res.redirect(`/job/view/${jobId}`);
});

router.patch('/update/:application_id', async (req, res) => {
    const application = await Application.findById(req.params.application_id);

    if (application === null) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/');
    }

    if(application.employee !== req.user.username) {
        req.flash('error', 'Update denied, application not owned');
        return res.redirect(`/job/view/${application.jobId}`);
    }

    application.message = req.body.message;
    application.time = new Date();
    await application.save();

    req.flash('info', 'Updated successfuly');
    res.redirect(`/job/view/${application.jobId}`);
});

module.exports = router;