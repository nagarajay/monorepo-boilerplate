import * as passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Connection } from "typeorm";
import { User } from "../entity/User";
import {
  fullnameToFirstName,
  fullnameToLastName
} from "./fullnameToFirstAndLastName";

// The Access URL needs to be added to the credentials

export const LoginViaGoogle = (connection: Connection) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.BACKEND_HOST}/auth/google/callback`
      },
      async (_, __, profile, cb) => {
        const { id, emails, displayName } = profile;
        const query = connection
          .getRepository(User)
          .createQueryBuilder("user")
          .where("user.googleId= :id", { id });

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
            googleId: id,
            email,
            firstname,
            lastname
          }).save();
        } else if (!user.facebookId) {
          // we found user by email so we just need to update google id
          // Incase the user created the account earlier with gmail and
          // now is signing with google plus
          user.googleId = id;
          await user.save();
        }
        // @todo error handling
        return cb(null, { id: user!.id });
      }
    )
  );
};
