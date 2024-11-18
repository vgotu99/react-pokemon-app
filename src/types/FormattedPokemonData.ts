export interface FormattedPokemonData {
  id:              number;
  name:            string;
  weight:          number;
  height:          number;
  next:            Next | undefined;
  prev:            Next | undefined;
  abilities:       string[];
  stats:           Stat[];
  types:           string[];
  damageRelations: DamageRelation[];
  sprites:         string[];
  desc:            string;
}

export interface DamageRelation {
  double_damage_from: Next[];
  double_damage_to:   Next[];
  half_damage_from:   Next[];
  half_damage_to:     Next[];
  no_damage_from:     any[];
  no_damage_to:       any[];
}

export interface Next {
  name: string;
  url:  string;
}

export interface Stat {
  name:     string;
  baseStat: number;
}