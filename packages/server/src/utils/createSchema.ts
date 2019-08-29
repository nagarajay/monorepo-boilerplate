import * as path from "path";
import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [__dirname + "/../modules/**/*.resolver.ts"],
    emitSchemaFile:
      process.env.NODE_ENV === "test"
        ? false
        : path.resolve(__dirname, "../schema.gql"),
    // This is to remove the No metadata found log message.
    validate: false
  });
