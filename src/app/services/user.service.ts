import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db = firebase.firestore();

  constructor(private pokemonService: PokemonService) {}

  async setPlayer(player: Player): Promise<void> {
    const cards = await this.pokemonService.getRandomPokemon(5);
    player.cards = cards;
    await this.db.collection('players').doc(player.id).set(player);
  }

  getPlayer(id: string): Promise<Player> {
    return this.db.collection('players').doc(id).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data() as Player;
        return new Player(data.id, data.name, data.cards);
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
