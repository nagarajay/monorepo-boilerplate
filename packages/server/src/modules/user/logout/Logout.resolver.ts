import { Resolver, Mutation, Ctx } from "type-graphql";

import { MyContext } from "../../../types/MyContext";

@Resolver()
export class LogOutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, rej) => {
      ctx.req.session!.destroy(err => {
        if (err) {
          console.log(err);
          return rej(false);
        }

        ctx.res.clearCookie("wahid");
        return res(true);
      });
    });
  }
}
