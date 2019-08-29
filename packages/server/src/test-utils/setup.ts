import { createTypeormConn } from "../utils/createTypeormConn";

createTypeormConn(true).then(() => process.exit());
