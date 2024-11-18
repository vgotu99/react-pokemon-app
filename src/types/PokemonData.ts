export interface PokemonData {
  count: number;
  next: string | null;
  prev: string | null;
  results: PokemonNameAndUrl[]
}

export interface PokemonNameAndUrl {
  name: string;
  url: string;
}