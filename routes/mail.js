const nodemailer= require('nodemailer');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

async function sendVerificationMail(receiver, otp, req) {
    const link = `${ req.protocol }://${ req.headers.host }/verify`;
    const mailHtml = await ejs.renderFile(__dirname + '/../views/mail/verify_mail.ejs', {
        link: link,
        otp: otp
    });

    const mailOptions = {
        from: process.env.USER,
        to: receiver,
        subject: 'Validate Outwork Account',
        html: mailHtml 
    }

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Verification Email Sent!');
    });
}

async function sendRecoveryMail(receiver, otp, id, req) {
    const link = `${ req.protocol }://${ req.headers.host }/recover/${ id }/otp`;
    const mailHtml = await ejs.renderFile(__dirname + '/../views/mail/recover_mail.ejs', {
        link: link,
        otp: otp
    });

    const mailOptions = {
        from: process.env.USER,
        to: receiver,
        subject: 'Recover Outwork Account',
        html: mailHtml 
    }

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Recovery Email Sent!');
    });
}

async function sendNewPassMail(receiver, pass, req) {
    const link = `${ req.protocol }://${ req.headers.host }/login`;
    const mailHtml = await ejs.renderFile(__dirname + '/../views/mail/newpass_mail.ejs', {
        link: link,
        pass: pass
    });

    const mailOptions = {
        from: process.env.USER,
        to: receiver,
        subject: 'Outwork Account New Password',
        html: mailHtml 
    }

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('New Password Sent!');
    });
}

module.exports = {
    sendVerificationMail: sendVerificationMail,
    sendRecoveryMail: sendRecoveryMail,
    sendNewPassMail: sendNewPassMail
};