const nodemailer = require('nodemailer');

// Setup Nodemailer transporter with local log fallback
const sendEmail = async (options) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('--- EMAIL FALLBACK LOG ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.text || options.html}`);
    console.log('---------------------------');
    return { success: true, message: 'Email logged to console (no SMTP settings)' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Z Cool Tech'} <${process.env.FROM_EMAIL || 'no-reply@zcooltech.com'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log(`Message sent: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
