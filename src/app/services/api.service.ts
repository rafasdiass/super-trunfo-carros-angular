import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Card } from '../models/card.model';
import { PokemonDetails } from '../models/pokemondetails.model';
import { PokemonResponse } from '../models/pokemonresponse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) { }

  private fetchPokemonType(type: string): Observable<any> {
    const url = `${this.API_URL}type/${type}`;
    return this.http.get<any>(url).pipe(
      map(response => response.pokemon)
    );
  }

  fetchFirePokemon(): Observable<Card[]> {
    return this.fetchPokemonType('fire').pipe(
      switchMap((pokemons: any[]) =>
        forkJoin(
          pokemons.map((item: { pokemon: { name: string; }; }) =>
            this.fetchPokemonDetails(item.pokemon.name)
          )
        )
      ),
      map((pokemonDetails: PokemonDetails[]) =>
        pokemonDetails.map((details: PokemonDetails) =>
          Card.fromPokemonDetails(details)
        )
      )
    );
  }

  fetchWaterPokemon(): Observable<Card[]> {
    return this.fetchPokemonType('water').pipe(
      switchMap((pokemons: any[]) =>
        forkJoin(
          pokemons.map((item: { pokemon: { name: string; }; }) =>
            this.fetchPokemonDetails(item.pokemon.name)
          )
        )
      ),
      map((pokemonDetails: PokemonDetails[]) =>
        pokemonDetails.map((details: PokemonDetails) =>
          Card.fromPokemonDetails(details)
        )
      )
    );
  }

  fetchRandomCard(): Observable<Card> {
    const url = `${this.API_URL}pokemon?limit=1000`;

    return this.http.get<PokemonResponse>(url).pipe(
      map(response => {
        const randomIndex = Math.floor(Math.random() * response.results.length);
        return response.results[randomIndex].name;
      }),
      switchMap(randomPokemon =>
        this.fetchPokemonDetails(randomPokemon)
      ),
      map(pokemonDetails =>
        Card.fromPokemonDetails(pokemonDetails)
      )
    );
  }

  public fetchPokemonDetails(pokemonName: string): Observable<PokemonDetails> {
    const url = `${this.API_URL}pokemon/${pokemonName}`;
    return this.http.get<PokemonDetails>(url);
  }
}
