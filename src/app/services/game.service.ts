import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { ApiService } from './api.service';

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

    return [playerCard, computerCard];
  }

  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(private apiService: ApiService) { }

  initializeGame(players: Player[]): Observable<any> {
    return new Observable((observer) => {
      this.apiService.fetchFirePokemon().pipe(
        switchMap((playerCards: Card[]) => {
          players[0].cards = playerCards;
          return this.apiService.fetchWaterPokemon();
        })
      ).subscribe(
        (computerCards: Card[]) => {
          players[1].cards = computerCards;
          this.playersSubject.next(players);
          this.activePlayerSubject.next(players[0]);
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  private shuffleCards(cards: Card[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  // Coloque qualquer outra lógica de jogo aqui
}