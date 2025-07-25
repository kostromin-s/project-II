import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: "dppn ramm uukg wadr",
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"My App" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
export { sendEmail };
