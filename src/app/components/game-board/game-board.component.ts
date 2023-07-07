import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/player.model';
import { UserService } from '../../services/user.service';

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

  constructor(private gameService: GameService, private userService: UserService) { }

  ngOnInit() {
    this.startGame();
  }

  async startGame() {
    const playerId = 'player1'; // ID do jogador, você precisa substituir pelo ID correto
    try {
      const player = await this.userService.getPlayer(playerId);
      if (player && player.cards.length > 0) {
        this.playerCard = player.cards[0];
        this.gameService.players$.subscribe((players: Player[]) => {
          this.playerWins = players.find(p => p.id === playerId)?.wins || 0;
          this.computerWins = players.find(p => p.id !== playerId)?.wins || 0;
        });
      }
    } catch (error) {
      console.error('Error fetching player:', error);
    }
  }
  

  playTurn(attribute: string) {
    if (this.playerCard && this.computerCard) {
      if (this.playerCard[attribute] > this.computerCard[attribute]) {
        this.winner = 'Player';
        this.playerWins++;
        this.gameService.updateWins('player1');
      } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
        this.winner = 'Computer';
        this.computerWins++;
        this.gameService.updateWins('player2');
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
