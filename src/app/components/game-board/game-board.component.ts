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
  playerCard: Card | undefined;
  computerCard: Card | undefined;
  winner: string;
  playerWins: number;
  computerWins: number;

  constructor(private gameService: GameService, private userService: UserService) {
    this.winner = '';
    this.playerWins = 0;
    this.computerWins = 0;
    console.log('GameBoardComponent constructor called');
  }

  ngOnInit() {
    console.log('OnInit called');

    const playerPokemon = this.userService.getPlayerPokemon();
    const players: Player[] = [
      new Player('player1', 'Player 1', playerPokemon),
      new Player('player2', 'Player 2')
    ];

    this.gameService.initializeGame(players).subscribe(updatedPlayers => {
      console.log('Players initialized with updated cards:', updatedPlayers);
      // Escolha a primeira carta de cada jogador para começar o jogo
      this.nextTurn();
    });

    console.log('Game initialized');
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
        window.alert('Você venceu esse turno.');

      } else if (this.playerCard[attribute] < this.computerCard[attribute]) {
        this.winner = 'Computer';
        this.computerWins++;
        window.alert('Você perdeu esse turno.');

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
