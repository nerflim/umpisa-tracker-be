import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field()
  short_name: string;

  @Field({ nullable: true })
  description: string;
}
