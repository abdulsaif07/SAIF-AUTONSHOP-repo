// server/services/emailService.js
const nodemailer = require('nodemailer');

// We will use Ethereal Mail for testing if real credentials are not provided.
// Ethereal is a fake SMTP service specifically for testing.
async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    console.log(`✉️  Ethereal Test Email Account created: ${testAccount.user}`);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass  // generated ethereal password
      }
    });
  }
}

async function sendPriceAlertEmail(userEmail, productTitle, targetPrice, currentPrice, productLink) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Autonshop Alerts" <alerts@autonshop.local>',
    to: userEmail,
    subject: `🚨 Price Drop Alert: ${productTitle}!`,
    html: `
      <h2>Good news! The price dropped!</h2>
      <p>The product <strong>${productTitle}</strong> has dropped to <strong>₹${currentPrice}</strong>, which is below your target price of ₹${targetPrice}.</p>
      <p><a href="${productLink}">Click here to view the deal!</a></p>
    `
  });

  console.log(`📧 Email sent: ${info.messageId}`);
  if (!process.env.SMTP_HOST) {
    console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

module.exports = { sendPriceAlertEmail };
