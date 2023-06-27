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
      map((player: any) => player instanceof Player ? new Player(player.id, player.name, player.cards) : null),
      catchError(() => of(null)) // Retorna um Observable que emite 'null' se ocorrer um erro.
    );
  }

  setPlayer(player: { id: string, name: string, cards: Card[] }): Promise<void> {
    console.log('Setting player with cards: ', player.cards); // Log the cards before setting
    return this.db.object(`/players/${player.id}`).set(player);
  }
}
