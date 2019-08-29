import { Field, ObjectType } from "type-graphql";
import { ErrorOutput } from "../../shared/ErrorOutput";

@ObjectType()
export class LoginOutput {
  @Field(() => [ErrorOutput], { nullable: true })
  errors?: ErrorOutput[];

  @Field()
  sessionId?: string;
}
