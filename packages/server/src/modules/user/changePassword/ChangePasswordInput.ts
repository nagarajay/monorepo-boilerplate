import { InputType, Field } from "type-graphql";

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  newPassword: string;
}
