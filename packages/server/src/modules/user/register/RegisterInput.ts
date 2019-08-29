import { InputType, Field } from "type-graphql";

@InputType()
export class RegisterInput {
  @Field()
  fullname: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
