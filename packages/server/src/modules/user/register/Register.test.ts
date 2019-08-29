import { Connection } from "typeorm";
import * as faker from "faker";

import { createTypeormConn } from "../../../utils/createTypeormConn";
import { gCall } from "../../../test-utils/gCall";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!){
    register(
        data: $data
    ){ 
      path
      message  
    }
}
`;

// Avoid race conditions in faker
faker.seed(Date.now() + 0);

describe("Register", () => {
  it("create user", async () => {
    const user = {
      fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    expect(response).toMatchObject({
      data: {
        register: null
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
  });
});
