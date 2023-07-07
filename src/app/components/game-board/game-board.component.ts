import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  playerCard?: Card;
  computerCard?: Card;
  playerWins = 0;
  computerWins = 0;
  winner = '';
  selectedAttribute = '';

  cardAttributes = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.startGame();
  }

  async startGame() {
    this.gameService.initializeGame().then((players: Player[]) => {
      if (players.length === 2 && players[0].cards.length > 0 && players[1].cards.length > 0) {
        this.playerCard = players[0].cards[0];
        this.computerCard = players[1].cards[0];
        this.gameService.players$.subscribe((players: Player[]) => {
          this.playerWins = players[0].wins;
          this.computerWins = players[1].wins;
        });
      }
    }).catch(error => {
      console.error('Error initializing game:', error);
    });
  }

  playTurn(attribute: string) {
    if (this.playerCard && this.computerCard) {
      if (this.playerCard[attribute] > this.computerCard[attribute]) {
        this.winner = 'Player';
        this.playerWins++;
        this.gameService.updateWins('playerId');
      } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
        this.winner = 'Computer';
        this.computerWins++;
        this.gameService.updateWins('computerId');
      } else {
        this.winner = 'Draw';
      }
      this.nextTurn();
    }
  }

  nextTurn() {
    const drawnCards = this.gameService.drawCards();
    this.playerCard = drawnCards[0];
    this.computerCard = drawnCards[1];
    if (!this.playerCard || !this.computerCard) {
      if (this.playerWins > this.computerWins) {
        this.winner = 'Player wins the game!';
      } else if (this.playerWins < this.computerWins) {
        this.winner = 'Computer wins the game!';
      } else {
        this.winner = 'Game is a draw!';
      }
    } else {
      this.winner = '';
    }
  }
}
