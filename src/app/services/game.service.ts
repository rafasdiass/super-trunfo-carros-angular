import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
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

    return [playerCard, computerCard];
  }

  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  async initializeGame(): Promise<Player[]> {
    const user = await this.authService.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const players: Player[] = [
      await this.userService.getPlayer(user.uid),
      // Aqui, você pode adicionar a lógica para adicionar um segundo jogador, se necessário.
    ];

    this.playersSubject.next(players);
    this.activePlayerSubject.next(players[0]);

    return players;
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
  }
}
