import { Component } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/player.model';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { shuffle } from 'lodash';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  playerCard!: Card;
  computerCard!: Card;
  winner!: string;

  constructor(private gameService: GameService, private apiService: ApiService) {
    const player1 = new Player("Player 1", [], false);
    const player2 = new Player("Player 2", [], false);
    const players: Player[] = [player1, player2];

    // Atribuir cartas aos jogadores
    this.getInitialPlayerCards().subscribe(cards => {
      player1.cards = cards.slice(0, 5);
      player2.cards = cards.slice(5, 10);
    });

    console.log('Players:', players);

    if (players.length >= 2) {
      this.gameService.initializeGame(players);
      this.nextTurn();
    } else {
      console.log('Not enough players to start the game');
    }
  }

  nextTurn() {
    try {
      [this.playerCard, this.computerCard] = this.gameService.drawCards();
    } catch (error) {
      console.log('Error drawing cards:');
    }
  }

  playTurn(attribute: keyof Card) {
    if (this.playerCard[attribute] > this.computerCard[attribute]) {
      this.winner = 'Player';
    } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
      this.winner = 'Computer';
    } else {
      this.winner = 'Draw';
    }
    this.nextTurn();
  }

  private getInitialPlayerCards(): Observable<Card[]> {
    return this.apiService.fetchCards().pipe(
      map((cards: Card[]) => this.shuffleCards(cards))
    );
  }

  private shuffleCards(cards: Card[]): Card[] {
    return shuffle(cards);
  }
}
