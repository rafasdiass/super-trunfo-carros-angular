import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';
import { Player } from 'src/app/models/player.model';

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
    // Subscribe to the players$ observable to get the updated players data
    this.gameService.players$.subscribe((players: Player[]) => {
      // Ensure there are exactly 2 players and they have cards
      if (players.length === 2 && players[0].cards.length > 0 && players[1].cards.length > 0) {
        this.playerCard = players[0].cards[0];
        this.computerCard = players[1].cards[0];
      }
    });

    // Primeira rodada do jogo
    // this.nextTurn(); // No need to call nextTurn here as the subscription above will handle the card drawing
  }

  // rest of the code...



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
