const Application = require('../models/application');

function getJobApplicants(job) {
    return new Promise(async resolve => {
        const job_applications = await Application.find({jobId: job.id});
        var job_applicants = [];

        for (const job_application of job_applications) {
            job_applicants.push(job_application.employee);
        }

        resolve(job_applicants);
    });
}

function getAllJobApplicants(jobs) {
    return new Promise(async resolve => {
        var job_applicants = {};
        for (var job of jobs) {
            job_applicants[job.id] = await getJobApplicants(job);
        }
        resolve(job_applicants);
    });
}

module.exports = {
    getJobApplicants: getJobApplicants,
    getAllJobApplicants: getAllJobApplicants
};