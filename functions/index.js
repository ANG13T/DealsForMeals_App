const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
var credentials = require('./config/credentials.json');
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.gmail,
        pass: credentials.gmail_password
    }
});

exports.sendMail = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {
        const dest = data.dest;
        // const senderEmail = req.query.senderEmail;
        const message = data.message;
        const username = data.username;

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
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return reject(erro.toString());
            }
            return resolve('Sended');
        });  
    })    
});
