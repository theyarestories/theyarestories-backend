import { err, ok } from "neverthrow";
import nodemailer from "nodemailer";

export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.forwardemail.net",
      port: 587,
      secure: false,
      auth: {
        user: "support@theyarestories.com",
        pass: process.env.FORWARD_EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"They are stories" <support@theyarestories.com>',
      to: to.join(","),
      subject,
      html,
    });

    return ok(info);
  } catch (error: any) {
    return err({ errorMessage: error.message });
  }
}
