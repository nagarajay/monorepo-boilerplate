import { Resolver, Arg, Mutation } from "type-graphql";
import { User } from "../../../entity/User";
import { redis } from "../../../redis";
import { confirmUserPrefix } from "../../constants/redisPrefixes";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    await User.update({ id: userId }, { confirmed: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
