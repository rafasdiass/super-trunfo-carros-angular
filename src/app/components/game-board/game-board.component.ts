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
  playerCard: Card | undefined;
  computerCard: Card | undefined;
  winner: string;
  playerWins: number;
  computerWins: number;

  constructor(private gameService: GameService) {
    this.winner = '';
    this.playerWins = 0;
    this.computerWins = 0;
    console.log('GameBoardComponent constructor called');
  }

  ngOnInit() {
    console.log('OnInit called');
    const players: Player[] = [
      new Player("Player 1"),
      new Player("Player 2")
    ];

    console.log('Players initialized', players);
    this.gameService.initializeGame(players).subscribe(() => {
      console.log('Game initialized');
      this.nextTurn();
    });
  }

  nextTurn() {
    console.log('nextTurn called');
    const drawnCards = this.gameService.drawCards();
    this.playerCard = drawnCards[0];
    this.computerCard = drawnCards[1];
    console.log('Cards drawn', this.playerCard, this.computerCard);
  }
  playTurn(attribute: keyof Card) {
    console.log('playTurn called', attribute);
    if (this.playerCard && this.computerCard) {
      console.log('Both cards available', this.playerCard, this.computerCard);
      if (this.playerCard[attribute] > this.computerCard[attribute]) {
        this.winner = 'Player';
        this.playerWins++;
        window.alert('Voce venceu esse turno');
      } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
        this.winner = 'Computer';
        this.computerWins++;
        window.alert('Voce perdeu esse turno.');
      } else {
        this.winner = 'Draw';
        window.alert('This round is a draw.');
      }
      console.log('Winner of the turn', this.winner);
      this.nextTurn();
    } else {
      console.log('End of game, no cards left');
    }
  }
}
