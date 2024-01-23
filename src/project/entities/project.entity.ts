import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/category/entities/category.entity';

export type ProjectDocument = HydratedDocument<Project>;

@ObjectType()
@Schema()
export class Project {
  @Field()
  _id: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop({
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 3,
    uppercase: true,
  })
  short_name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => [Category])
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }],
  })
  categories: Category[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
