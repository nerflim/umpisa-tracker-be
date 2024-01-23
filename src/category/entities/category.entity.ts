import { ObjectType, Field } from '@nestjs/graphql';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Card } from 'src/card/entities/card.entity';
import { Project } from 'src/project/entities/project.entity';

export type CategoryDocument = HydratedDocument<Category>;

@ObjectType()
@Schema()
export class Category {
  @Field()
  _id: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => Project)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
  })
  project: Project;

  @Field(() => [Card], { nullable: true })
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Card' }],
  })
  cards?: Card[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
