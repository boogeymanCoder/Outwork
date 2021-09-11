const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employer: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Job", jobSchema);