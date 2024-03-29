import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Mutation(() => Card)
  async createCard(@Args('card') card: CreateCardInput) {
    const newCard = await this.cardService.create(card);

    return newCard.populate('category');
  }

  @Query(() => Card, { name: 'card' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cardService.findOne(id);
  }

  // @Mutation(() => Card)
  // updateCard(@Args('updateCardInput') updateCardInput: UpdateCardInput) {
  //   return this.cardService.update(updateCardInput.id, updateCardInput);
  // }

  // @Mutation(() => Card)
  // removeCard(@Args('id', { type: () => Int }) id: number) {
  //   return this.cardService.remove(id);
  // }
}
