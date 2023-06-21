import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PokemonDetails } from '../models/pokemondetails.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50';

  constructor(private http: HttpClient) { }

  fetchCards(): Observable<Card[]> {
    return this.fetchPokemonsList().pipe(
      switchMap((pokemonsList: string[]) => {
        console.log('Pokemons List:', pokemonsList);
        return forkJoin(
          pokemonsList.map((pokemon: string) => this.fetchPokemonDetails(pokemon))
        );
      }),
      map((pokemonsDetails: any[]) => {
        console.log('Pokemons Details:', pokemonsDetails);
        return pokemonsDetails.map((pokemonDetails: any) => this.transformToCard(pokemonDetails));
      })
    );
  }

  fetchRandomCard(): Observable<Card> {
    return this.fetchPokemonsList().pipe(
      switchMap((pokemonsList: string[]) => {
        console.log('Pokemons List:', pokemonsList);
        const randomIndex = Math.floor(Math.random() * pokemonsList.length);
        const randomPokemon = pokemonsList[randomIndex];
        return this.fetchPokemonDetails(randomPokemon);
      }),
      map((pokemonDetails: any) => {
        console.log('Random Pokemon Details:', pokemonDetails);
        return this.transformToCard(pokemonDetails);
      })
    );
  }

  private fetchPokemonsList(): Observable<string[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => {
        console.log('fetchPokemonsList response:', response);
        return response.results.map((item: any) => item.name);
      })
    );
  }

  private fetchPokemonDetails(pokemon: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).pipe(
      map(response => {
        console.log('fetchPokemonDetails response:', response);
        return response;
      })
    );
  }

  private transformToCard(pokemonDetails: any): Card {
    console.log('Transforming Pokemon:', pokemonDetails);
    return new Card(
      pokemonDetails.id,
      pokemonDetails.name,
      pokemonDetails.sprites.front_default,
      pokemonDetails.stats[0]?.base_stat || 0,  // HP
      pokemonDetails.stats[1]?.base_stat || 0,  // Attack
      pokemonDetails.stats[2]?.base_stat || 0,  // Defense
      pokemonDetails.stats[3]?.base_stat || 0,  // Special Attack
      pokemonDetails.stats[4]?.base_stat || 0,  // Special Defense
      pokemonDetails.stats[5]?.base_stat || 0,  // Speed
    );
  }
}
