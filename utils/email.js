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
      <a href="${url}?user=${receiverEmail}&token=${token}&expTime=${Date.now() + (60 * 60 * 1000)}" style="background-color:#4caf50;color:white;padding:15px 20px;font-size:18px;text-decoration:none;margin:10px;width:120px;display:inline-block;border-radius:5px" target="_blank">Confirm Email</a>
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

export const sendResetPasswordEmail = async (receiverEmail, OTP, name) => {
  const html = `<html>
  <head>
    <style>
      .font-Geo {
          font-family: Roboto, sans-serif;
      }
  
      .font-Mon {
          font-family: 'Google Sans', sans-serif;
      }
    </style>
  </head>
  <body style="box-sizing:border-box; margin:0;">
  <div>
  <div style="padding:60px 0;width:100%;background-color:#6b21a8; height:auto;overflow: auto;">
  <div style="opacity:0; color:transparent">TodosApp: Reset Password Request</div>
  <table style="width: 100%;">
  <tr>
    <td style="text-align: center; vertical-align: middle;">
      <h2 class="font-Geo" style="width: 100%; letter-spacing: 0.05em; font-size: 1.125rem; line-height: 1.75rem; color: white; font-weight: 500; margin: 0;">
        <img src="https://i.ibb.co/qWmyTF2/todosapp-logo-dimensions.png" alt="TodosApp" style="display: inline-block; height: 48px; width: 48px; vertical-align: middle;">
        TodosApp
      </h2>
    </td>
  </tr>
</table>
  <div style="margin-left:auto; margin-right:auto; width: 90%;max-width: 420px; border-radius: 0.250rem; background-color: #e2e8f0;padding-left: 0.75rem;padding-right: 0.75rem; padding-top: 1.5rem;padding-bottom: 2rem;margin-top:0.4rem; text-align:center;">
    <img src="https://cdn-icons-png.flaticon.com/512/4627/4627436.png" style="margin-bottom:1.5rem; height:80px; margin-left:auto;margin-right:auto; margin-top:20px;" />
    <p class="font-Mon" style="margin-bottom:12px;font-size: 1.25rem;line-height: 1.75rem;text-align: center;font-weight: 600; color: #111827;">${"Hey " + name + ", here is your One Time Password (OTP)"}</p>
    <p class="font-Mon" style="margin-bottom:24px;color:#111827; font-weight:300; color:#111827;">to validate your reset-password request.</p>
    <div class="font-Mon" style="margin-bottom:20px;font-size: 3rem;line-height: 1;color: #334155; font-weight: 500;">${OTP}</div>
    <p class="font-Geo validity" style="color: #ef4444;font-weight: 400;letter-spacing: 0.025em;">Valid for 1 hour only</p>
    <div style="opacity:0">${"Hey " + name + ", "}Here is your One Time Password (OTP)</div>
  </div>
  </div>
  <div style="opacity:0; color:transparent">TodosApp: Reset Password Request</div>
</div>
  </body></html>`

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


    const mailOptions = {
      from: `Todo App ${ADMIN_EMAIL}`,
      to: receiverEmail,
      subject: 'Reset your password',
      html,

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