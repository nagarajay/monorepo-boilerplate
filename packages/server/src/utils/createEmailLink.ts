import { v4 } from "uuid";
import { redis } from "../redis";
// import { Redis } from "ioredis";
// url will always be of the form http://abc.com/ note the / in the end.
// middle should also end with an extra / e.g. confirm/
export const createEmailLink = async (
  url: string,
  userId: string,
  middle: string,
  redisPrefix: string
) => {
  const id = v4();
  await redis.set(redisPrefix + id, userId, "ex", 60 * 60 * 1); // one hour
  return `${url}${middle}${id}`;
};
