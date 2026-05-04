export interface LocationInfo {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
  location?: LocationInfo;
  origin?: LocationInfo;
}
