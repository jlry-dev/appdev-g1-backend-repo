require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function emailVerificationSender(receiverEmail, username, token, expiration) {
  try {
    const info = await transporter.sendMail({
      from: `"Movie Munch" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: 'Movie Munch - Email Verification',
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .content {
        background-color: #f8f9fa;
        padding: 30px;
        border-radius: 8px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
      }
      h2 {
        color: #333;
      }
      p {
        color: #666;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Movie Munch</h1>
      </div>
      <div class="content">
        <h2> Hello ${ username} </h2>
        <p><strong>Click the button below to verify your email and complete registration.</strong></p>
        <p>Password reset will expire on ${ expiration }</p>
        <a href="${ process.env.SIGNUP_VERIFICATION_ROUTE }?token=${ encodeURIComponent(token) }" class="button">Verify Email</a>
      </div>
    </div>
  </body>
</html>`,
    });

    console.log("✅ Email sent");
 
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}


async function passwordRecoverEmailSender(receiverEmail, recoveryCode) {
  try {
    const info = await transporter.sendMail({
      from: `"Movie Munch" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: 'Movie Munch - Email Verification',
      html: 
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .header {
              text-align: center;
              padding: 20px 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            h2 {
              color: #333;
            }
            p {
              color: #666;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Movie Munch</h1>
            </div>
            <div class="content">
              <h2> You have requested to recover your account. </h2>
              <p><strong>You're recovery code is: </strong></p>
              <h3><strong>${recoveryCode}</strong></h3>
            </div>
          </div>
        </body>
      </html>`,
    });

    console.log("✅ Email sent");

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

module.exports = {emailVerificationSender, passwordRecoverEmailSender}
