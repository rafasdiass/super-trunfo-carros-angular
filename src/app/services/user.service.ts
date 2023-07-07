import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { PokemonService } from './pokemon.service';
import { environment } from '../../environments/environment';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db = firebase.firestore();

  constructor(private pokemonService: PokemonService) {}

  async setPlayer(player: Player): Promise<void> {
    return this.db.doc(`players/${player.id}`).set(player.toFirestore());
  }

  async getPlayer(id: string): Promise<Player> {
    const doc = await this.db.collection('players').doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        // Map each card data to a Card instance
        const cards = (data['cards'] as any[]).map(cardData => {
          return new Card(
            cardData.id,
            cardData.name,
            cardData.imageUrl,
            cardData.hp,
            cardData.attack,
            cardData.defense,
            cardData.specialAttack,
            cardData.specialDefense,
            cardData.speed
          );
        });
        return new Player(data['id'] as string, data['name'] as string, cards);
      }
    }
    throw new Error('No player found with id ' + id);
  
  }

  updatePlayer(id: string, changes: Partial<Player>): Promise<void> {
    return this.db.collection('players').doc(id).update(changes);
  }

  removePlayer(id: string): Promise<void> {
    return this.db.collection('players').doc(id).delete();
  }
}
