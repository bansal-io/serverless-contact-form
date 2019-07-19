var nodemailer = require('nodemailer');
var request = require('request');
var querystring = require('querystring');

var CONFIG = {
    SMTP_USERNAME: process.env.SMTP_USERNAME || 'smtp_username',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'smtp_password',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 465,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'example.com',
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'no-reply@example.com',
    SMTP_FROM_SUBJECT: process.env.SMTP_FROM_SUBJECT || 'Contact form submitted on example.com',
    SMTP_TO: process.env.SMTP_TO || 'jack@example.com,mike@example.com',
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
    REQUIRED_FIELDS: process.env.REQUIRED_FIELDS || 'name,email,message',
    SUCCESS_MESSAGE: process.env.SUCCESS_MESSAGE || 'Thank you, We have received your message'
}

function sendEmail(formData, res){

    var smtpConfig = {
        host: CONFIG.SMTP_HOST,
        port: CONFIG.SMTP_PORT,
        auth: {
            user: CONFIG.SMTP_USERNAME,
            pass: CONFIG.SMTP_PASSWORD
        }
    }
    
    var transporter = nodemailer.createTransport(smtpConfig);

    var subject = CONFIG.SMTP_FROM_SUBJECT;
    
    if(formData['subject'] !== undefined ){
        subject = formData['subject'];
    }

    var mailBody = '';
    for (var key in formData) {
        if (formData.hasOwnProperty(key)) { 
            if(key === 'g-recaptcha-response' || key === 'submit')
            continue;
            mailBody += `<strong>${key} :</strong> ${formData[key]} <br />`;
        }
      }
    
    transporter.sendMail({
        from: '"' + CONFIG.SMTP_FROM_NAME + '" <' + CONFIG.SMTP_FROM_EMAIL + '>', // sender address
        to: CONFIG.SMTP_TO,
        subject: subject,
        html: mailBody
    }, (error, info) => {
        
        if (error) {
            return res.status(500).send(JSON.stringify({
                success: false,
                message: 'Email failed. Please Try Again.'
            }))
        }
        return res.status(200).send(JSON.stringify({
            success: true,
            message: CONFIG.SUCCESS_MESSAGE
        }))
    });
}

function reCaptcha(formData, res) {

    var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?';

    verificationUrl += querystring.stringify({
        'secret': CONFIG.RECAPTCHA_SECRET_KEY,
        'response': formData['g-recaptcha-response']
    });

    if (formData['g-recaptcha-response'] === undefined || formData['g-recaptcha-response'] === '' || formData['g-recaptcha-response'] === null) {
        return res.status(200).send(JSON.stringify({
            success: false,
            message: 'Please select captcha'
        }));
    }
    
    request(verificationUrl, function (error, response, body) {

        body = JSON.parse(body);
        
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.status(200).send(JSON.stringify({
                success: false,
                message: 'Invalid captcha. Please try again'
            }));
        }
        sendEmail(formData, res);
    });
}

exports.onSubmit = (req, res) => {
    
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    var formData = req.body;
    
    var requiredFields = CONFIG.REQUIRED_FIELDS.split(',');
    
    for (var i = 0; i < requiredFields.length; i++) {
        if(formData[requiredFields[i].trim()] == ''){
            res.send(JSON.stringify({
                success: false,
                message: `${requiredFields[i].trim()} field is required`
            }));
            res.status(200).end();
            return;
        }
    }

    if (CONFIG.RECAPTCHA_SECRET_KEY) {
        reCaptcha(formData, res);
    } else {
        sendEmail(formData, res);
    }
};