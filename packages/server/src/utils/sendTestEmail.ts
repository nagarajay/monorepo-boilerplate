import * as nodemailer from "nodemailer";

export const sendTestEmail = async (
  recipient: string,
  from: string,
  subject: string,
  html: string
) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  const mailOptions = {
    from, // sender address
    to: recipient, // list of receivers
    subject, // Subject line
    text: subject, // plain text body
    html: html // html body
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
