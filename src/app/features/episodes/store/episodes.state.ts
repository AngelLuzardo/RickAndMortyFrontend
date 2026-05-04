import { Episode, Character } from '../../../shared/models';

export interface EpisodesFilter {
  name: string;
  seasons: string[];
}

export interface EpisodesPagination {
  currentPage: number;
  totalPages: number;
}

export interface EpisodesState {
  episodes: Episode[];
  allEpisodes: Episode[]; // Cache completo de todos los episodios
  selectedEpisode: Episode | null;
  characters: Character[];
  loading: boolean;
  error: string | null;
  filter: EpisodesFilter;
  pagination: EpisodesPagination;
  allSeasons: string[];
  lastUpdated: Date | null;
}
