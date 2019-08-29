import { InputType, Field } from "type-graphql";

@InputType()
export class EmailExistsInput {
  @Field()
  email: string;
}
