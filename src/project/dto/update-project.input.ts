import { CreateProjectInput } from './create-project.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  short_name: string;

  @Field({ nullable: true })
  description: string;
}
