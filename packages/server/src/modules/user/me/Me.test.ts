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

const meQuery = `
 {
  me {
    id
    firstname
    lastname
    email
  }
}
`;

// Avoid race conditions in faker
faker.seed(Date.now() + 1);

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }
      }
    });
  });

  it("return null", async () => {
    const response = await gCall({
      source: meQuery
    });

    expect(response).toMatchObject({
      data: {
        me: null
      }
    });
  });
});
