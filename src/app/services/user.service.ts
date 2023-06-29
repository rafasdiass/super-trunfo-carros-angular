import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db = firebase.firestore();

  constructor() {}

  async setPlayer(player: Player): Promise<void> {
    await this.db.collection('players').doc(player.id).set(player);
  }

  getPlayer(id: string): Promise<Player> {
    return this.db.collection('players').doc(id).get().then((doc) => {
      if (doc.exists) {
        return doc.data() as Player;
      } else {
        throw new Error('No player found with id ' + id);
      }
    });
  }

  updatePlayer(id: string, changes: Partial<Player>): Promise<void> {
    return this.db.collection('players').doc(id).update(changes);
  }

  removePlayer(id: string): Promise<void> {
    return this.db.collection('players').doc(id).delete();
  }
}
