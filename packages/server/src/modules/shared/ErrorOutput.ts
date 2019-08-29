import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ErrorOutput {
  @Field()
  path: string;

  @Field()
  message: string;
}
