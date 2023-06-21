import { Card } from './card.model';

export class Player {
  name: string;
  cards: Card[] = [];
  currentCard?: Card;  // Adicione esta linha

  constructor(name: string) {
    this.name = name;
  }
}
