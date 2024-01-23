import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  category: string;
}
