const nodemailer = require("nodemailer");

function sendEmail(email) {

    const {from, to, subject, text, html} = email
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_ACCOUNT_USER,
      pass: process.env.SMTP_ACCOUNT_PASSWORD
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  // send mail with defined transport object
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions).then(info => {
      const emailSent = {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      }
      resolve(emailSent)
    }).catch(err => reject(err));
  })
}
module.exports = sendEmail