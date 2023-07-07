import { Card } from './card.model';

export class Player {
  id: string;
  name: string;
  cards: Card[] = [];
  currentCard?: Card;
  wins: number = 0;

  constructor(id: string, name: string, cards?: Card[]) {
    this.id = id;
    this.name = name;
    if (cards) {
      this.cards = cards;
    }
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      cards: this.cards.map(card => card.toFirestore ? card.toFirestore() : card),
      wins: this.wins
    };
  }
}
