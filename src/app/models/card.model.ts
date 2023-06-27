import { PokemonDetails } from './pokemondetails.model';

export class Card {
  [key: string]: number | string;

  constructor(
    public id: number,
    public name: string,
    public imageUrl: string,
    public hp: number,
    public attack: number,
    public defense: number,
    public specialAttack: number,
    public specialDefense: number,
    public speed: number
  ) {}

  static fromPokemonDetails(pokemonDetails: PokemonDetails): Card {
    return new Card(
      pokemonDetails.id,
      pokemonDetails.name,
      pokemonDetails.sprites.front_default,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 0,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 0,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'defense')?.base_stat || 0,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'special-attack')?.base_stat || 0,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'special-defense')?.base_stat || 0,
      pokemonDetails.stats.find((stat) => stat.stat.name === 'speed')?.base_stat || 0
    );
  }
}

