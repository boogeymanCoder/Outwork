const express = require('express');
const router = express.Router();

const auth = require("./auth");
const Account = require('../models/account');
const Chat = require('../models/chat');

router.all('*', auth.checkIfAuthenticated);

router.get('/', async (req, res) => {
    const chats = await Chat.find({ members: req.user.username });  
    res.render('chat/chat', { chats: chats, username: req.user.username });
});

router.get('/new', (req, res) =>{
    res.render('chat/new');
});

// TODO enhance to multiple recipients
router.post('/new', async (req, res) => {
    const now = new Date();
    const recipient = await Account.findOne({ username: req.body.recipient });
    if (recipient === null) {
        req.flash('error', 'Recipient doesn\'t exist');
        return res.redirect('/chat/new');
    }

    const chat = new Chat();
    chat.members.push(recipient.username);
    chat.members.push(req.user.username);

    const message = {
        sender: req.user.username,
        recipient: recipient.username,
        when: now,
        message: req.body.message
    };

    chat.messages.push(message);
    chat.lastUpdate = now;
    await chat.save();

    res.redirect('/chat');
});

router.post('/send/:chat_id/:recipient', async (req, res) => {
    const now = new Date();

    const recipient = await Account.findOne({ username: req.params.recipient });
    if (recipient === null) {
        req.flash('error', 'Recipient doesn\'t exist');
        return res.redirect('/chat/new');
    }

    const chat = await Chat.findById(req.params.chat_id);
    if (chat === null || !chat.members.includes(req.user.username)) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/chat');
    }

    const message = {
        sender: req.user.username,
        recipient: recipient.username,
        when: now,
        message: req.body.message
    };

    chat.messages.push(message);
    chat.lastUpdate = now;
    await chat.save();

    res.redirect(`/chat/view/${chat.id}`);
});

router.get('/view/:chat_id', async (req, res) => {
    const chat = await Chat.findById(req.params.chat_id);
    
    if (chat === null || !chat.members.includes(req.user.username)) {
        req.flash('error', 'Invalid URL');
        return res.redirect('/chat');
    }

    var recipient = "";
    for (member of chat.members) {
        if (member !== req.user.username) {
            recipient = member;
            break;
        }
    }

    res.render('chat/view', { chat: chat, recipient: recipient })
});

module.exports = router;