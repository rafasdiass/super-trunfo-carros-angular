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
  private playerCards: Card[] = []; // Armazena as cartas do jogador

  // Observables para os jogadores e jogador ativo.
  players$ = this.playersSubject.asObservable();
  activePlayer$ = this.activePlayerSubject.asObservable();

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  // Inicializa o jogo com os jogadores.
  async initializeGame(): Promise<Player[]> {
    const user = await this.authService.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const player = await this.userService.getPlayer(user.uid);

    const players: Player[] = [
      player,
      // Aqui, você pode adicionar a lógica para adicionar um segundo jogador, se necessário.
    ];

    // Atualiza os jogadores e o jogador ativo.
    this.playersSubject.next(players);
    this.activePlayerSubject.next(players[0]);

    return players;
  }

  // Define as cartas do jogador.
  setPlayerCards(cards: Card[]) {
    this.playerCards = cards;
  }

  // Retorna as cartas do jogador.
  getPlayerCards(): Card[] {
    return this.playerCards;
  }

  // Sorteia cartas para o jogador e para o computador.
  drawCards(): [Card | undefined, Card | undefined] {
    const players = this.playersSubject.getValue();

    if (players.length < 2) {
      return [undefined, undefined];
    }

    const playerCard = players[0].cards.shift();
    const computerCard = players[1].cards.shift();

    // Atualiza os jogadores após as cartas terem sido sorteadas.
    this.playersSubject.next(players);

    return [playerCard, computerCard];
  }

  // Atualiza as vitórias de um jogador.
  updateWins(playerId: string): void {
    const players = this.playersSubject.getValue();
    const player = players.find(player => player.id === playerId);

    if (player) {
      player.wins++;
    }

    // Atualiza os jogadores após as vitórias terem sido atualizadas.
    this.playersSubject.next(players);
  }

  // Passa a vez para o próximo jogador.
  nextTurn(): void {
    const players = this.playersSubject.getValue();
    const activePlayer = this.activePlayerSubject.getValue();

    if (!activePlayer || players.length < 2) {
      return;
    }

    // Alterna entre os jogadores para definir o jogador ativo.
    this.activePlayerSubject.next(
      activePlayer.id === players[0].id ? players[1] : players[0]
    );
  }
}
