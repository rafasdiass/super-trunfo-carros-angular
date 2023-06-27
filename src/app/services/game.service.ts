import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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

  getGame(pokemon: string): Observable<any> {
    return this.apiService.fetchPokemonDetails(pokemon).pipe(
      switchMap(pokemonDetails => {
        const players = this.playersSubject.getValue();

        return forkJoin([
          ...Array(5).fill(this.apiService.fetchRandomCard())
        ]).pipe(
          map(randomCards => {
            players.forEach((player, index) => {
              player.cards = [...(player.cards || []), ...(randomCards[index] as Card[])];
            });
            this.playersSubject.next(players);
            return pokemonDetails;
          })
        );
      })
    );
  }

  private shuffleCards(cards: Card[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  // Coloque qualquer outra lógica de jogo aqui
}
