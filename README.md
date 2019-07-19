# Google Cloud Functions to handle form submission

### Features
1. Google Captcha support (optional)
2. Send Email to multiple Recipients
3. Origin Control
4. Form Validation

### ToDo
- [ ] Slack Notification
- [ ] Google Sheet Integration


### Configure

1. Download `contact-form-function.zip` file from `dist` folder
2. Create google cloud function and upload this file.
3. Set Environment variables under ' Environment variables, networking, timeouts and more' link
4. Set below mentioned environment variables:

Key | Sample Value | Details
--- | ------------ | -------
SMTP_USERNAME | 9ec87c6286ec | This can be a key or email id depends on smtp provider
SMTP_PASSWORD | 93202702fbd5 | smtp password
SMTP_HOST | smtp.mailgun.org | 
SMTP_PORT | 2525 | 25 or 465 or 587 or 2525
SMTP_FROM_NAME | yourwebsite.com | This can be your name or your website name.
SMTP_FROM_EMAIL | no-reply@example.com |
SMTP_FROM_SUBJECT | New contact form | This can  be a fixed subject line or from subject field of your contact form
SMTP_TO |  jack@example.com,mike@example.com | comma separated email addresses of recipients
RECAPTCHA_SECRET_KEY | | Leave this blank it don't want captcha.  Read more about [reCaptcha](https://developers.google.com/recaptcha/docs/verify)
REQUIRED_FIELDS | name,email,message | Comma separated list of required fields
SUCCESS_MESSAGE | Thank you, We have received your message | 
```




