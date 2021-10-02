const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
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
    messages: [messageSchema]
});

module.exports = mongoose.model("Chat", chatSchema);