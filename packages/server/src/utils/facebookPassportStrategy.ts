import * as passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Connection } from "typeorm";
import { User } from "../entity/User";
import {
  fullnameToFirstName,
  fullnameToLastName
} from "./fullnameToFirstAndLastName";

// Important Note - In development only developers facebook account
// will work. A live app requires https://

export const LoginViaFacebook = (connection: Connection) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID as string,
        clientSecret: process.env.FACEBOOK_APP_SECRET as string,
        callbackURL: `${process.env.BACKEND_HOST}/auth/facebook/callback`,
        profileFields: ["id", "displayName", "email"],
        enableProof: true
      },
      async (_, __, profile, cb) => {
        const { id, emails, displayName } = profile;
        const query = connection
          .getRepository(User)
          .createQueryBuilder("user")
          .where("user.facebookId= :id", { id });

        let email: string | undefined = undefined;

        if (emails) {
          email = emails[0].value;
          await query.orWhere("user.email = :email", { email });
        }

        let user = await query.getOne();

        // this user needs to be registered
        // 2 cases - either
        if (!user) {
          const firstname = fullnameToFirstName(displayName);
          const lastname = fullnameToLastName(displayName);
          user = await User.create({
            facebookId: id,
            email,
            firstname,
            lastname
          }).save();
        } else if (!user.facebookId) {
          // we found user by email so we just need to update facebook id
          user.facebookId = id;
          await user.save();
        }
        // @todo error handling
        return cb(null, { id: user!.id });
      }
    )
  );
};
