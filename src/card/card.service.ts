import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './entities/card.entity';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name)
    private cardModel: Model<CardDocument>,
    private categoryService: CategoryService,
  ) {}

  async create(card: CreateCardInput) {
    const category = await this.categoryService.findOne(card.category);

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const newCard = new this.cardModel(card);
    newCard.populate('category');

    category.cards.push(newCard);
    category.save();

    return newCard.save();
  }

  findOne(id: string) {
    return this.cardModel
      .findById(id)
      .populate({
        path: 'category',
        populate: {
          path: 'project',
          strictPopulate: false,
        },
      })
      .exec();
  }

  update(id: number, card: UpdateCardInput) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
