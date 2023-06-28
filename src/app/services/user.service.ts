import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  getPlayer(userId: string): Observable<Player | null> {
    return this.db.object(`/players/${userId}`).valueChanges().pipe(
      map((player: any) => {
        if (player) {
          // Transforma a entrada em uma nova instância da classe Player
          const cards: Card[] = player.cards?.map((card: any) => new Card(
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
      catchError(() => of(null)) // Retorna um Observable que emite 'null' se ocorrer um erro.
    );
  }

  setPlayer(player: Player): Promise<void> {
    console.log('Setting player with cards: ', player.cards); // Log the cards before setting
    // Convert player.cards to plain object
    const playerData = {
      ...player,
      cards: player.cards.map(card => ({
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        hp: card.hp,
        attack: card.attack,
        defense: card.defense,
        specialAttack: card.specialAttack,
        specialDefense: card.specialDefense,
        speed: card.speed
      }))
    };
    return this.db.object(`/players/${player.id}`).set(playerData);
  }
}
