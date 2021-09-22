const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    employee: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Application", applicationSchema);