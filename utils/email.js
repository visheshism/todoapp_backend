import nodemailer from 'nodemailer';
import { ADMIN_EMAIL, ADMIN_EMAIL_HOST, ADMIN_EMAIL_PASSWORD, ADMIN_EMAIL_PORT } from '../data/env.js';
import { currentDateTime } from './features.js';
import { errHandler } from '../middlewares/error.js';


export const sendConfirmationEmail = async (url, receiverEmail, token, mode, name) => {
  try {
    const transporter = nodemailer.createTransport({
      host: ADMIN_EMAIL_HOST,
      port: ADMIN_EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_EMAIL_PASSWORD,
      },
    })

    const confirmUser = `<div style="background-color:#f0f0f0;padding:20px;text-align:center;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto">
    <div style="background-color:white;padding:20px;border-radius:5px">
      <h1 style="font-size:24px;color:purple">Confirm your email address</h1>
      <p style="font-size:16px">Please click the following link to confirm your email address:</p>
      <a href="${url}?user=${receiverEmail}&token=${token}" style="background-color:#4caf50;color:white;padding:15px 20px;font-size:18px;text-decoration:none;margin:10px;width:120px;display:inline-block;border-radius:5px" target="_blank">Confirm Email</a>
      <h3 style="color:green">This link expires in 1 hour.</h3>
    </div>
  </div>
</div>`

    const confirmationSuccess = `<div style="background-color:#f0f0f0;padding:20px;text-align:center;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto">
    <div style="background-color:white;padding:20px;border-radius:5px">
      <h1 style="font-size:24px;color:purple">Hey ${name}, you email has been confirmed</h1>
      <a href="${url}" style="background-color:#4caf50;color:white;padding:15px 20px;font-size:18px;text-decoration:none;margin:10px;width:120px;display:inline-block;border-radius:5px" target="_blank">Log In</a>
    </div>
  </div>
</div>`

    const mailOptions = {
      from: `Todo App ${ADMIN_EMAIL}`,
      to: receiverEmail,
      subject: mode === 0 ? 'Confirm your email address' : mode === 1 ? 'Email address confirmed' : null,
      html: mode === 0 ? confirmUser : mode === 1 ? confirmationSuccess : null,

    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log(`Mail sent to ${receiverEmail} at ${currentDateTime()}`);
        console.log("Message Id: %s", info.messageId);
      }
    })

  } catch (error) {
    next(new errHandler(error.message))
  }
}