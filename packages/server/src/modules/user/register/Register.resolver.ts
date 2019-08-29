import { Arg, Resolver, Mutation, Query, Ctx } from "type-graphql";
import { User } from "../../../entity/User";
import { RegisterInput } from "./RegisterInput";
import { registerSchema, emailSchema } from "@monorepo/common";

import {
  fullnameToFirstName,
  fullnameToLastName
} from "../../../utils/fullnameToFirstAndLastName";
import { formatYupError } from "../../../utils/formatYupError";
import { ErrorOutput } from "../../shared/ErrorOutput";
import { EmailExistsInput } from "./EmailExistsInput";
import { MyContext } from "../../../types/MyContext";
import { createConfirmEmailLink } from "../shared/createConfirmEmailLink";

const emailAlreadyExistsError = [
  {
    path: "email",
    message: "Already registered. Please Login"
  }
];

@Resolver()
export class RegisterResolver {
  @Query(() => [ErrorOutput], { nullable: true })
  async emailExists(@Arg("data")
  {
    email
  }: EmailExistsInput): Promise<ErrorOutput[] | null> {
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
    } catch (err) {
      return formatYupError(err);
    }

    const emailAlreadyExists = await User.findOne({
      where: { email }
    });

    if (emailAlreadyExists) {
      return emailAlreadyExistsError;
    }

    return null;
  }

  @Mutation(() => [ErrorOutput], { nullable: true })
  async register(
    @Arg("data") { fullname, email, password }: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<ErrorOutput[] | null> {
    try {
      await registerSchema.validate(
        { fullname, email, password },
        { abortEarly: false }
      );
    } catch (err) {
      return formatYupError(err);
    }

    const userAlreadyExists = await User.findOne({
      where: { email },
      select: ["id"]
    });

    if (userAlreadyExists) {
      return emailAlreadyExistsError;
    }

    const firstname = fullnameToFirstName(fullname);
    const lastname = fullnameToLastName(fullname);

    const user = User.create({
      firstname,
      lastname,
      email,
      password
    });

    await user.save();

    // confirmation link should be http://domain/confirm/redis-id
    if (process.env.NODE_ENV === "development") {
      createConfirmEmailLink(ctx.url, user.id, email);
    }

    return null;
  }
}
