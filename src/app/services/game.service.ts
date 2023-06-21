import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/440?format=json';

  private playersSubject = new BehaviorSubject<Player[]>([]);
  private activePlayerSubject = new BehaviorSubject<Player | null>(null);

  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(private http: HttpClient) { }

  initializeGame(players: Player[]): void {
    this.fetchCards().subscribe(cards => {
      this.shuffleCards(cards);
      players.forEach((player, index) => {
        player.cards = cards.slice(index * 5, (index + 1) * 5);
      });

      this.playersSubject.next(players);
      this.activePlayerSubject.next(players[0]);
    });
  }

  drawCards(): [Card, Card] {
    const players = this.playersSubject.getValue();
    if (players.length < 2) {
      throw new Error('Not enough players to draw cards');
    }

    const card1 = players[0]?.cards.shift();
    const card2 = players[1]?.cards.shift();

    if (!card1 || !card2) {
      throw new Error('Not enough cards to draw');
    }

    return [card1, card2];
  }

  playTurn(attribute: keyof Card): void {
    const players = this.playersSubject.getValue();

    if (players[0].isAI) {
      const attributes: Array<keyof Card> = ['speed', 'power', 'price', 'year'];
      const randomAttribute = attributes[Math.floor(Math.random() * attributes.length)];
      this.playTurn(randomAttribute);
      return;
    }

    players.sort((a, b) => {
      const valueA = a.currentCard ? Number(a.currentCard[attribute as keyof Card]) : 0;
      const valueB = b.currentCard ? Number(b.currentCard[attribute as keyof Card]) : 0;
      return valueB - valueA;
    });

    const winningCard = players[0].currentCard;
    if (winningCard) {
      players[0].cards.push(winningCard);
    }

    players.forEach(player => player.cards.shift());

    const nextPlayer = players.shift();
    if (nextPlayer) {
      players.push(nextPlayer);
    }

    this.playersSubject.next(players);
    this.activePlayerSubject.next(players[0]);

    if (players[0].isAI) {
      const attributes: Array<keyof Card> = ['speed', 'power', 'price', 'year'];
      const randomAttribute = attributes[Math.floor(Math.random() * attributes.length)];
      setTimeout(() => {
        this.playTurn(randomAttribute);
      }, 1000);
    }
  }

  private fetchCards(): Observable<Card[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => response.Results.map((item: any) => this.transformToCard(item)))
    );
  }

  private transformToCard(item: any): Card {
    return new Card(
      item.Model_ID,
      item.Make_Name + " " + item.Model_Name,
      `https://source.unsplash.com/400x300/?car,${item.Make_Name},${item.Model_Name}`,
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 40) + 1980  
    );
  }

  private shuffleCards(cards: Card[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  // ... outros métodos lógicos do jogo
}
