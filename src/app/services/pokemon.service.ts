import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonDetails } from '../models/pokemondetails.model';
import { PokemonResponse } from '../models/pokemonresponse.model';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Card } from '../models/card.model';
import { Stat } from '../models/stat.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getRandomPokemon(count: number): Promise<Card[]> {
    return this.http.get<PokemonResponse>(`${this.baseUrl}/pokemon?limit=${count}`)
      .pipe(
        switchMap(response => {
          const requests = response.results.map(result =>
            this.http.get<PokemonDetails>(`${this.baseUrl}/pokemon/${result.name}`)
          );
          return forkJoin(requests);
        })
      )
      .toPromise()
      .then((pokemonDetailsList: PokemonDetails[]) => {
        console.log('Type of pokemonDetailsList:', typeof pokemonDetailsList);
        console.log('Is pokemonDetailsList an array:', Array.isArray(pokemonDetailsList));
        const cards = pokemonDetailsList.map((details: PokemonDetails) => {
          console.log('Pokemon Details:', details);
          return new Card(
            details.id,
            details.name,
            details.sprites.front_default,
            details.stats.find((stat: Stat) => stat.stat.name === 'hp')?.base_stat || 0,
            details.stats.find((stat: Stat) => stat.stat.name === 'attack')?.base_stat || 0,
            details.stats.find((stat: Stat) => stat.stat.name === 'defense')?.base_stat || 0,
            details.stats.find((stat: Stat) => stat.stat.name === 'special-attack')?.base_stat || 0,
            details.stats.find((stat: Stat) => stat.stat.name === 'special-defense')?.base_stat || 0,
            details.stats.find((stat: Stat) => stat.stat.name === 'speed')?.base_stat || 0,
          );
        });
        console.log('Cards:', cards);
        return cards;
      });
  }
}
