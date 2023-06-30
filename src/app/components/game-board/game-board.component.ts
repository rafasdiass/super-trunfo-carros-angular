import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  playerCard: Card | undefined;
  computerCard: Card | undefined;
  winner: string;
  playerWins: number;
  computerWins: number;
  cardAttributes: string[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  constructor(private gameService: GameService) {
    this.winner = '';
    this.playerWins = 0;
    this.computerWins = 0;
  }

  ngOnInit() {
    // Primeira rodada do jogo
    this.nextTurn();
  }

  nextTurn() {
    const drawnCards = this.gameService.drawCards();
    this.playerCard = drawnCards[0];
    this.computerCard = drawnCards[1];
    this.winner = '';
  }

  playTurn(attribute: string) {
    if (this.playerCard && this.computerCard) {
      if (this.playerCard[attribute] > this.computerCard[attribute]) {
        this.winner = 'Player';
        this.playerWins++;
      } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
        this.winner = 'Computer';
        this.computerWins++;
      } else {
        this.winner = 'Draw';
      }
      this.nextTurn();
    }
  }
}
