import * as bcrypt from "bcryptjs";
import { Arg, Resolver, Mutation, Ctx } from "type-graphql";
import { User } from "../../../entity/User";

import { LoginInput } from "./LoginInput";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { LoginOutput } from "./LoginOutput";
import { MyContext } from "../../../types/MyContext";
import { createConfirmEmailLink } from "../shared/createConfirmEmailLink";
import { redis } from "../../../redis";
import { userSessionsPrefix } from "../../constants/redisPrefixes";

const errorResponse = {
  path: "email",
  message: invalidLogin
};

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginOutput, { nullable: true })
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<LoginOutput | undefined> {
    const user = await User.findOne({ where: { email } });

    // Check if the User exists
    if (!user) {
      return { errors: [errorResponse] };
    }

    // user has not confirmed
    if (!user.confirmed) {
      // Email sent Again
      if (process.env.NODE_ENV === "development") {
        createConfirmEmailLink(ctx.url, user.id, email);
      }

      return {
        errors: [
          {
            path: "email",
            message: confirmEmailError
          }
        ]
      };
    }

    // As social login is also possible so password could be null
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);

      // password is incorrect
      if (!valid) {
        return { errors: [errorResponse] };
      }
    }

    // login sucessful
    ctx.req.session!.userId = user.id;

    // In order to close all sessions of a User.
    if (ctx.req.sessionID) {
      await redis.lpush(userSessionsPrefix + user.id, ctx.req.sessionID);
    }

    return { sessionId: ctx.req.sessionID };
  }
}
