import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Card } from '../models/card.model';
import { PokemonDetails, Stat, PokemonResponse } from '../models/pokemondetails.model';

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
          this.transformToCard(details)
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
          this.transformToCard(details)
        )
      )
    );
  }

  fetchRandomCard(): Observable<Card> {
    const url = `${this.API_URL}pokemon?limit=1000`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        const randomIndex = Math.floor(Math.random() * response.results.length);
        return response.results[randomIndex].name;
      }),
      switchMap((randomPokemon: string) =>
        this.fetchPokemonDetails(randomPokemon)
      ),
      map((pokemonDetails: PokemonDetails) =>
        this.transformToCard(pokemonDetails)
      )
    );
  }

  private fetchPokemonDetails(pokemonName: string): Observable<PokemonDetails> {
    const url = `${this.API_URL}pokemon/${pokemonName}`;
    return this.http.get<any>(url).pipe(
      map(response => new PokemonDetails(
        response.id,
        response.name,
        response.sprites,
        response.stats.map((stat: any) => new Stat(stat.base_stat, stat.stat))
      ))
    );
  }

  private transformToCard(pokemonDetails: PokemonDetails): Card {
    const findStatValue = (statName: string): number => {
      const stat: Stat | undefined = pokemonDetails.stats.find((stat: { stat: { name: string; }; }) => stat.stat.name === statName);
      return stat ? stat.base_stat : 0;
    };

    return new Card(
      pokemonDetails.id,
      pokemonDetails.name,
      pokemonDetails.sprites.front_default,
      findStatValue('hp'),
      findStatValue('attack'),
      findStatValue('defense'),
      findStatValue('special-attack'),
      findStatValue('special-defense'),
      findStatValue('speed')
    );
  }
}