import { createEmailLink } from "../../../utils/createEmailLink";
import { sendTestEmail } from "../../../utils/sendTestEmail";
import { confirmUserPrefix } from "../../constants/redisPrefixes";

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  email: string
) => {
  const confirmlink = await createEmailLink(
    url,
    userId,
    "confirm/",
    confirmUserPrefix
  );

  if (process.env.NODE_ENV !== "test") {
    const from = "support@monorepo.com";
    const subject = "Confirm Email";
    const html = `<html>
      <body>
      <p>Welcome to Monorepo World world!!</p>
      <p>
      Please click on the link below to confirm your email. </p>
      <a href="${confirmlink}" target="_blank">${confirmlink}</a>
      <p>Happy Learning!!</p>
      </body>
      </html>`;
    await sendTestEmail(email, from, subject, html).catch(err => {
      return err;
    });
  }

  return null;
};
