const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
import credentials from './config/credentials';
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

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const dest = req.query.dest;
        // const senderEmail = req.query.senderEmail;
        const message = req.query.message;
        const username = req.query.username;

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
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});
