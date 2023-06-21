export class Card {
[x: string]: any;
  constructor(
    public id: number,
    public make: string,
    public model: string,
    public speed: number,
    public power: number,
    public price: number,
    public year: number
  ) { }
}
