const Application = require('../models/application');

function getJobApplication(job, username) {
    return new Promise(async resolve => {
        const job_application = await Application.findOne({jobId: job.id, employee: username});
        resolve(job_application);
    });
}

function getAllJobApplications(jobs, username) {
    return new Promise(async resolve => {
        var job_applications = {};
        for (var job of jobs) {
            job_applications[job.id] = await getJobApplication(job, username);
        }
        resolve(job_applications);
    });
}

module.exports = {
    getJobApplication: getJobApplication,
    getAllJobApplications: getAllJobApplications
};