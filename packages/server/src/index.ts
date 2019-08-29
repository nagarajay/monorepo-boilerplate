import "reflect-metadata";
import "dotenv";
import * as express from "express";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import * as passport from "passport";
import { ApolloServer } from "apollo-server-express";

import { redis } from "./redis";
import { redisSessionPrefix } from "./modules/constants/redisPrefixes";
import { createTypeormConn } from "./utils/createTypeormConn";
import { createSchema } from "./utils/createSchema";

import { LoginViaTwitter } from "./utils/twitterPassportStrategy";
import { LoginViaFacebook } from "./utils/facebookPassportStrategy";
import { LoginViaGoogle } from "./utils/googlePassportStrategy";

const startServer = async () => {
  if (process.env.NODE_ENV === "test") {
    redis.flushall();
  }

  const connection = await createTypeormConn();

  const schema = await createSchema();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  };

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
      url: req.protocol + "://" + req.get("host") + "/"
    })
  });

  const app = express();

  const RedisStore = connectRedis(session);

  // Rate Limiting
  app.use(
    new RateLimit({
      store: new RateLimitRedisStore({
        client: redis
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
      // delayMs: 0 // disable delaying - full speed until the max limit is reached
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: "wahid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    } as any)
  );

  if (
    process.env.TWITTER_LOGIN === "true" ||
    process.env.FACEBOOK_LOGIN === "true" ||
    process.env.GOOGLE_LOGIN === "true"
  ) {
    app.use(passport.initialize());
  }

  if (process.env.TWITTER_LOGIN === "true") {
    // TwitterLogin
    LoginViaTwitter(connection);

    app.get("/auth/twitter", passport.authenticate("twitter"));

    app.get(
      "/auth/twitter/callback",
      passport.authenticate("twitter", {
        failureRedirect: `${process.env.FRONTEND_HOST}/login`,
        session: false
      }),
      (req, res) => {
        // Successful authentication, redirect home.
        (req.session as any).userId = req.session!.user.id;
        res.redirect(`${process.env.FRONTEND_HOST}`);
      }
    );
  }

  if (process.env.FACEBOOK_LOGIN === "true") {
    // Facebook Login
    LoginViaFacebook(connection);

    app.get(
      "/auth/facebook",
      passport.authenticate("facebook", {
        scope: ["email"]
      })
    );

    app.get(
      "/auth/facebook/callback",
      passport.authenticate("facebook", {
        failureRedirect: `${process.env.FRONTEND_HOST}/login`,
        session: false
      }),
      (req, res) => {
        (req.session as any).userId = req.session!.user.id;
        res.redirect(`${process.env.FRONTEND_HOST}`);
      }
    );
  }

  if (process.env.GOOGLE_LOGIN === "true") {
    // Google Login
    LoginViaGoogle(connection);

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_HOST}/login`,
        session: false
      }),
      (req, res) => {
        (req.session as any).userId = req.session!.user.id;
        res.redirect(`${process.env.FRONTEND_HOST}`);
      }
    );
  }

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  const port = process.env.NODE_ENV === "test" ? 0 : 4000;

  app.listen({ port }, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

startServer();
