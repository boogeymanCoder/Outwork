const nodemailer= require('nodemailer');
const ejs = require('ejs');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
OAuth2_client.setCredentials( { refresh_token : process.env.REFRESH_TOKEN } );

const accessToken = OAuth2_client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
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
        if (err) {
            console.log('Error: ', err)
        } else {
            console.log('Success: ', info)
        }
        transporter.close()
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