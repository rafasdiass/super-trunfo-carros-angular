export class PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Stat[];

  constructor(
    id: number,
    name: string,
    sprites: { front_default: string },
    stats: Stat[]
  ) {
    this.id = id;
    this.name = name;
    this.sprites = sprites;
    this.stats = stats;
  }
}

export class Stat {
  base_stat: number;
  stat: {
    name: string;
  };

  constructor(base_stat: number, stat: { name: string }) {
    this.base_stat = base_stat;
    this.stat = stat;
  }
}

export interface PokemonResponse {
  count: number;
  next: string;
  previous: string;
  results: { name: string }[];
}
