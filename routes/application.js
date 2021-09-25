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

module.exports = router;