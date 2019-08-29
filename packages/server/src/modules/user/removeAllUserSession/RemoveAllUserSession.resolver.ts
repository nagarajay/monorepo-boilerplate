import { Mutation, Resolver, Ctx } from "type-graphql";
import { redis } from "../../../redis";
import {
  userSessionsPrefix,
  redisSessionPrefix
} from "../../constants/redisPrefixes";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class RemoveAllUserSessionResolver {
  @Mutation(() => Boolean)
  async removeAllUserSession(@Ctx() ctx: MyContext): Promise<Boolean> {
    const userId = ctx.req.session!.userId;

    const sessionIds = await redis.lrange(userSessionsPrefix + userId, 0, -1);

    const promises = [];

    for (let i = 0; i < sessionIds.length; i += 1) {
      promises.push(redis.del(redisSessionPrefix + sessionIds[i]));
    }

    await Promise.all(promises);
    await redis.del(userSessionsPrefix + userId);
    await ctx.res.clearCookie("wahid");

    return true;
  }
}
