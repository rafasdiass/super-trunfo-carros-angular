import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
    console.log('Draw Cards - players:', players); // Added console.log here

    if (players.length < 2) {
      return [undefined, undefined];
    }

    const playerCard = players[0].cards.shift();
    const computerCard = players[1].cards.shift();

    console.log('Drawn cards:', playerCard, computerCard); // Added console.log here

    this.playersSubject.next(players);

    return [playerCard, computerCard];
  }

  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(private apiService: ApiService) { }

  initializeGame(players: Player[]): Observable<any> {
    return new Observable((observer) => {
      this.apiService.fetchCards().subscribe(
        (cards: Card[]) => {
          console.log('Cards fetched from API:', cards);  // Add console.log here

          this.shuffleCards(cards);
          players.forEach((player, index) => {
            player.cards = cards.slice(index * 5, (index + 1) * 5);
          });

          console.log('Players after assigning cards:', players);  // Add console.log here

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
