import { Resolver, Arg, Mutation, Ctx } from "type-graphql";
import { createEmailLink } from "../../../utils/createEmailLink";
import { MyContext } from "../../../types/MyContext";
import { User } from "../../../entity/User";
import { ErrorOutput } from "../../shared/ErrorOutput";
import { userNotFoundError } from "./errorMessages";
import { sendTestEmail } from "../../../utils/sendTestEmail";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => [ErrorOutput], { nullable: true })
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<ErrorOutput[] | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return [
        {
          path: "email",
          message: userNotFoundError
        }
      ];
    }

    const forgotPasswordlink = await createEmailLink(
      ctx.url,
      user.id,
      "change-password/",
      forgotPasswordPrefix
    );

    if (process.env.NODE_ENV !== "test") {
      const from = "support@monorepo.com";
      const subject = "Forgot Password - No Worries";
      const html = `<html>
      <body>
      <p>Let's get back to Monorepo world!!</p>
      <p>
      Please click on the link below to reset your password. </p>
      <a href="${forgotPasswordlink}" target="_blank">${forgotPasswordlink}</a>
      <p>Happy Learning!!</p>
      </body>
      </html>`;
      await sendTestEmail(email, from, subject, html);
    }

    return null;
  }
}
