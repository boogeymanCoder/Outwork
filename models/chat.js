const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        required: true
    },
    replyTo: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    }
});

const chatSchema = new mongoose.Schema({
    members: [String],
    messages: [messageSchema],
    lastUpdate: Date
});

module.exports = mongoose.model("Chat", chatSchema);