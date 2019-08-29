import * as passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Connection } from "typeorm";
import { User } from "../entity/User";
import {
  fullnameToFirstName,
  fullnameToLastName
} from "./fullnameToFirstAndLastName";

// Twitter password Strategy
export const LoginViaTwitter = (connection: Connection) => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
        callbackURL: `${process.env.BACKEND_HOST}/auth/twitter/callback`,
        includeEmail: true
      },
      async (_, ___, profile, cb) => {
        const { id, emails, displayName } = profile;
        const query = connection
          .getRepository(User)
          .createQueryBuilder("user")
          .where("user.twitterId= :id", { id });

        let email: string | undefined = undefined;

        if (emails) {
          email = emails[0].value;
          await query.orWhere("user.email = :email", { email });
        }

        let user = await query.getOne();

        // this user needs to be registered
        if (!user) {
          const firstname = fullnameToFirstName(displayName);
          const lastname = fullnameToLastName(displayName);
          user = await User.create({
            twitterId: id,
            email,
            firstname,
            lastname
          }).save();
        } else if (!user.twitterId) {
          // we found user by email
          user.twitterId = id;
          await user.save();
        }
        // @todo error handling
        return cb(null, { id: user!.id });
      }
    )
  );
};
