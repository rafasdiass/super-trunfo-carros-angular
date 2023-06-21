// pokemon.model.ts

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: { front_default: string };
  stats: Array<{ base_stat: number, stat: { name: string } }>;
}
