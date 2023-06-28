import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private playersSubject = new BehaviorSubject<Player[]>([]);
  private activePlayerSubject = new BehaviorSubject<Player | null>(null);

  drawCards(): [Card | undefined, Card | undefined] {
    const players = this.playersSubject.getValue();

    if (players.length < 2) {
      return [undefined, undefined];
    }

    const playerCard = players[0].cards.shift();
    const computerCard = players[1].cards.shift();

    this.playersSubject.next(players);

    console.log('Cards drawn:', playerCard, computerCard);  // <-- log here

    return [playerCard, computerCard];
  }

  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  async initializeGame(): Promise<Player[]> {
    const user = await this.authService.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    console.log('User authenticated:', user);  // <-- log here

    const playerPokemon = this.userService.getPlayerPokemon();

    console.log('Player Pokemon:', playerPokemon);  // <-- log here

    const players: Player[] = [
      new Player('player1', 'Player 1', playerPokemon),
      new Player('player2', 'Player 2')
    ];

    return new Promise((resolve, reject) => {
      forkJoin(
        ...Array(5).fill(this.apiService.fetchRandomCard())
      ).pipe(
        switchMap((randomCards: Card[]) => {
          players[0].cards = randomCards;
          return forkJoin(
            ...Array(5).fill(this.apiService.fetchRandomCard())
          ).pipe(
            map((randomCards: Card[]) => {
              players[1].cards = randomCards;
              this.playersSubject.next(players);
              this.activePlayerSubject.next(players[0]);
              console.log('Game initialized:', players);  // <-- log here
              return players;
            })
          );
        }),
        catchError((error: any) => {
          console.error('Error initializing game:', error);
          return throwError(error);
        })
      ).subscribe(
        players => resolve(players),
        error => reject(error)
      );
    });
  }

  nextTurn(): void {
    const players = this.playersSubject.getValue();
    const activePlayer = this.activePlayerSubject.getValue();

    if (!activePlayer || players.length < 2) {
      return;
    }

    this.activePlayerSubject.next(
      activePlayer.id === players[0].id ? players[1] : players[0]
    );

    console.log('Next turn, active player:', this.activePlayerSubject.getValue());  // <-- log here
  }
}
