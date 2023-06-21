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
}
