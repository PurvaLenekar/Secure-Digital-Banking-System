require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Digital Banking System" <${process.env.EMAIL}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Digital Banking System!';
    const text = `Hi ${name},\n\nThank you for registering with our Digital Banking System. We're excited to have you on board!\n\nBest regards,\nThe Digital Banking Team`;
    const html = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif}.container{max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)}.header{background:#4CAF50;color:white;padding:20px;text-align:center;font-size:22px;font-weight:bold}.content{padding:30px;color:#333;line-height:1.6}.button{display:inline-block;margin-top:20px;padding:12px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;font-weight:bold}.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}</style></head><body><div class="container"><div class="header">💳 Digital Banking System</div><div class="content"><h2>Welcome, ${name}! 🎉</h2><p>Thank you for registering with our <strong>Digital Banking System</strong>. We're excited to have you on board.</p><p>You can now securely manage your finances, track transactions, and enjoy seamless banking services.</p><a href="#" class="button">Get Started</a><p style="margin-top:30px;">If you have any questions, feel free to contact our support team.</p><p>Best regards,<br><strong>Digital Banking Team</strong></p></div><div class="footer">© 2026 Digital Banking System | All Rights Reserved</div></div></body></html>`;

    await sendEmail(userEmail, subject, text, html);
}

async  function sendTransactionEmail(userEmail, name, amount, fromAccount, toAccount) { 
    const subject = 'Transaction Successful!';
    const text = `Hi ${name},\n\nYour transaction of $${amount} from account ${fromAccount} to account ${toAccount} was successful.\n\nBest regards,\nThe Digital Banking Team`;
    const html = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif}.container{max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)}.header{background:#4CAF50;color:white;padding:20px;text-align:center;font-size:22px;font-weight:bold}.content{padding:30px;color:#333;line-height:1.6}.button{display:inline-block;margin-top:20px;padding:12px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;font-weight:bold}.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}</style></head><body><div class="container"><div class="header">💳 Digital Banking System</div><div class="content"><h2>Transaction Successful! 🎉</h2><p>Hi ${name},</p><p>Your transaction of <strong>$${amount}</strong> from account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong> was successful.</p><p>If you have any questions, feel free to contact our support team.</p><p>Best regards,<br><strong>Digital Banking Team</strong></p></div><div class="footer">© 2026 Digital Banking System | All Rights Reserved</div></div></body></html>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, fromAccount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hi ${name},\n\nWe regret to inform you that your transaction of $${amount} from account ${fromAccount} to account ${toAccount} has failed. Please check your account details and try again.\n\nBest regards,\nThe Digital Banking Team`;
    const html = `<!DOCTYPE html><html><head><style>body{margin:0;  padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif}.container{max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)}.header{background:#f44336;color:white;padding:20px;text-align:center;font-size:22px;font-weight:bold}.content{padding:30px;color:#333;line-height:1.6}.button{display:inline-block;margin-top:20px;padding:12px 20px;background:#f44336;color:white;text-decoration:none;border-radius:5px;font-weight:bold}.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}</style></head><body><div class="container"><div class="header">💳 Digital Banking System</div><div class="content"><h2>Transaction Failed</h2><p>Hi ${name},</p><p>We regret to inform you that your transaction of <strong>$${amount}</strong> from account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong> has failed. Please check your account details and try again.</p><p>If you have any questions, feel free to contact our support team.</p><p>Best regards,<br><strong>Digital Banking Team</strong></p></div><div class="footer">© 2026 Digital Banking System | All Rights Reserved</div></div></body></html>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {sendEmail, sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail};