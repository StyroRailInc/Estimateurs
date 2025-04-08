import nodemailer from "nodemailer";
import { EmailParams } from "./../interfaces/email.js";

const transporter = nodemailer.createTransport({});

export const sendEmail = async (emailParams: EmailParams) => {
  const { to, subject, text, attachments } = emailParams;
  const mailOptions = {
    from: "technologie@styrorail.ca",
    to,
    subject,
    text,
    // attachments,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};
