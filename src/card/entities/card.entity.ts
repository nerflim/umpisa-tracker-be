import { ObjectType, Field, ID } from '@nestjs/graphql';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'src/category/entities/category.entity';

export type CardDocument = HydratedDocument<Card>;

@ObjectType()
@Schema()
export class Card {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop({ required: true, unique: true, default: 1 })
  card_number: number;

  @Field()
  @Prop({ required: true, default: 1 })
  order: number;

  @Field(() => Category)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
  })
  category: Category;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.pre<CardDocument>('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    // get the highest card_number
    const highestCard = (await this.model('Card')
      .findOne()
      .sort('-card_number')
      .exec()) as CardDocument;

    // get the highest order for the category
    const highestOrder = (await this.model('Card')
      .findOne({ category: this.category })
      .sort('-order')
      .exec()) as CardDocument;

    if (highestCard?.card_number) {
      this.card_number = highestCard.card_number + 1;
    }

    if (highestOrder?.order) {
      this.order = highestOrder.order + 1;
    }

    console.log('this', this);

    next();
  } catch (error) {
    next(error);
  }
});
