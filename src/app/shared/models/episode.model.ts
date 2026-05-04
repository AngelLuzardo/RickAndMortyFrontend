export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // ej: "S01E01"
  characters: string[]; // URLs de personajes
  url: string;
  created: string;
}
