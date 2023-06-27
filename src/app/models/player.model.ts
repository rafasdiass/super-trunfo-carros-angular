import { Card } from './card.model';

export class Player {
  id: string;
  name: string;
  cards: Card[] = [];
  currentCard?: Card;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
