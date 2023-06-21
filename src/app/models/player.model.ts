import { Card } from './card.model';

export class Player {
    name: string;
    cards: Card[];
    currentCard: Card | null;
    isAI: boolean;

    constructor(name: string, cards: Card[], isAI: boolean) {
        this.name = name;
        this.cards = cards;
        this.currentCard = null;
        this.isAI = isAI;
    }

    playCard(): Card | null {
        const card = this.cards.shift();
        if (card) {
            this.currentCard = card;
            return this.currentCard;
        } else {
            return null;
        }
    }
}
