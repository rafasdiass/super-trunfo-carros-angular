import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  getUserPokemon(userId: string): Observable<any> {
    return this.db.object(`/users/${userId}/pokemon`).valueChanges();
  }

  setUserPokemon(userId: string, pokemon: any): Promise<void> {
    return this.db.object(`/users/${userId}/pokemon`).set(pokemon);
  }

  getPlayer(userId: string): Observable<Player | null> { // Ajustado para Player | null
    return this.db.object(`/players/${userId}`).valueChanges().pipe(
      map((player: any) => player instanceof Player ? new Player(player.id, player.name) : null),
      catchError(() => of(null)) // Retorna um Observable que emite 'null' se ocorrer um erro.
    );
  }

  setPlayer(player: Player): Promise<void> {
    return this.db.object(`/players/${player.id}`).set({
      id: player.id,
      name: player.name
    });
  }
}
