require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

async function emailVerificationSender(receiverEmail, username, token, expiration) {
  // Configure API key authorization
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  // Create API instance
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  // Set up email data
  sendSmtpEmail.to = [{ email: receiverEmail, name: username }];
  sendSmtpEmail.templateId = parseInt(process.env.BREVO_TEMPLATE_VERIFICATION_ID);
  sendSmtpEmail.params = {
    username: username,
    expiration: expiration,
    verificationLink: `${process.env.SIGNUP_VERIFICATION_ROUTE}?token=${encodeURIComponent(token)}`
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully');
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

async function passwordRecoverEmailSender(receiverEmail, username, token) {
  // Configure API key authorization
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  // Create API instance
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  // Set up email data
  sendSmtpEmail.to = [{ email: receiverEmail, name: username }];
  sendSmtpEmail.templateId = parseInt(process.env.BREVO_TEMPLATE_RECOVERY_ID);
  sendSmtpEmail.params = {
    username: username,
    verificationLink: `${process.env.ACCOUNT_RECOVERY_ROUTE}/${encodeURIComponent(token)}`
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully');
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

module.exports = {emailVerificationSender, passwordRecoverEmailSender}
