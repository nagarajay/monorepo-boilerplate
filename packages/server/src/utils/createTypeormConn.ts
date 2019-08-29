import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConn = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: "default",
    dropSchema: resetDB
  });
};
