// src/auth/email.ts
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourEmail@gmail.com',
      pass: 'yourAppPassword', // Not your Gmail password — use App Passwords!
    },
  });

  const verificationUrl = `http://localhost:3000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: '"Your App" <yourEmail@gmail.com>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  });
}
