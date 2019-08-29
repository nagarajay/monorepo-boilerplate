import { Resolver, Arg, Mutation } from "type-graphql";
import * as bcrypt from "bcryptjs";

import { ErrorOutput } from "../../shared/ErrorOutput";

import { ChangePasswordInput } from "./ChangePasswordInput";
import { redis } from "../../../redis";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";
import { User } from "../../../entity/User";
import { changePasswordSchema } from "@monorepo/common";
import { formatYupError } from "../../../utils/formatYupError";
import { expiredKeyError, userNonExistent } from "./errorMessages";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => [ErrorOutput], { nullable: true })
  async changePassword(@Arg("data")
  {
    token,
    newPassword
  }: ChangePasswordInput): Promise<ErrorOutput[] | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return [
        {
          path: "newPassword",
          message: expiredKeyError
        }
      ];
    }

    try {
      await changePasswordSchema.validate(
        { newPassword },
        { abortEarly: false }
      );
    } catch (err) {
      return formatYupError(err);
    }

    const user = await User.findOne(userId);

    if (!user) {
      return [
        {
          path: "user",
          message: userNonExistent
        }
      ];
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatePromise = User.update(
      { id: userId },
      {
        password: hashedPassword
      }
    );

    const deleteKeyPromise = redis.del(forgotPasswordPrefix + token);

    await Promise.all([updatePromise, deleteKeyPromise]);

    return null;
  }
}
