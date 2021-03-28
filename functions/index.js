const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
var credentials = require('./config/credentials.json');
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/


exports.emailMessage = functions.https.onCall((data, context) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.gmail,
            pass: credentials.gmail_password
        }
    });

    const username = data.username;
    const dest = data.dest;
    const message = data.message;

    console.log("the message is", message)

    const mailOptions = {
      from: `"DealsForMeals" <${credentials.gmail}>`,
      to: dest,
      subject: `[DealsForMeals] You've received a message from ${username}`,
      text: message,
      html: `
    <h3>You've received a message from ${username}</h3>
    <p>
        ${message}
    </p>
    `
    };

    return transporter.sendMail(mailOptions)
    .then(() => {
        return {result: "Email sent"};
    })
    .catch(error => {
        console.log(error);
        throw new functions.https.HttpsError('interna', error.message);
    });
});