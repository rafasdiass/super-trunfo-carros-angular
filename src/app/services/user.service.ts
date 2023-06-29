import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private playerPokemon: Card[] = [];

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  getPlayer(userId: string): Observable<Player | null> {
    return this.db.object<Player>(`/players/${userId}`).valueChanges().pipe(
      map((player: Player | null) => {
        if (player) {
          const cards: Card[] = player.cards?.map((card: Card) => new Card(
            card.id,
            card.name,
            card.imageUrl,
            card.hp,
            card.attack,
            card.defense,
            card.specialAttack,
            card.specialDefense,
            card.speed
          )) || [];
          return new Player(player.id, player.name, cards);
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  setPlayer(player: Player): Promise<void> {
    console.log('Setting player with cards: ', player.cards);
    const playerData: Player = {
      ...player,
      cards: player.cards?.map((card: Card) => ({
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        hp: card.hp,
        attack: card.attack,
        defense: card.defense,
        specialAttack: card.specialAttack,
        specialDefense: card.specialDefense,
        speed: card.speed
      })) || []
    };

    console.log('Player data to be saved: ', playerData);

    return this.db.object(`/players/${player.id}`).set(playerData)
      .then(() => {
        console.log('Player data saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving player data: ', error);
      });
  }

  setPlayerPokemon(pokemon: Card[]): void {
    this.playerPokemon = pokemon;
  }

  getPlayerPokemon(): Card[] {
    return this.playerPokemon;
  }
}
