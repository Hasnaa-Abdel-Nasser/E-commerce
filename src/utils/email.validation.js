import nodemailer from "nodemailer";
import { html } from "./email.html.js";
import { nanoid } from "nanoid";

const sendEmail = async (data, operation='confirm') => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"E A Z Y S H O P" <${process.env.EMAIL}>`,
    to: data.email,
    subject: data.subject,
    attachments: data.attachments,
    html:(operation == 'confirm') ?html({ code: data.code, name: data.name }):undefined,
  });
};
export default sendEmail;
