import { inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { EpisodesState } from './episodes.state';
import { RickMortyApiService } from '../../../core/services/rick-morty-api.service';
import { Episode, ApiResponse, Character } from '../../../shared/models';
import { finalize } from 'rxjs/operators';

const initialState: EpisodesState = {
  episodes: [],
  allEpisodes: [],
  selectedEpisode: null,
  characters: [],
  loading: false,
  error: null,
  filter: { name: '', seasons: [] },
  pagination: { currentPage: 1, totalPages: 1 },
  allSeasons: [],
  lastUpdated: null,
};

export const EpisodesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredCount: computed(() => store.episodes().length),
    hasError: computed(() => store.error() !== null),
    isEmpty: computed(() => !store.loading() && store.episodes().length === 0),
    isLoading: computed(() => store.loading()),
    availableSeasons: computed(() => store.allSeasons()),
  })),
  withMethods((store) => {
    const apiService = inject(RickMortyApiService);
    
    return {
      /**
       * Carga TODOS los episodios una sola vez con cache
       */
      loadAllEpisodes(): void {
        patchState(store, { loading: true, error: null });

        apiService
          .getAllEpisodes()
          .pipe(finalize(() => patchState(store, { loading: false })))
          .subscribe({
            next: (allEpisodes: Episode[]) => {
              const seasonsSet = new Set<string>();
              allEpisodes.forEach((ep) => {
                const season = ep.episode.substring(0, 3);
                seasonsSet.add(season);
              });
              const sortedSeasons = Array.from(seasonsSet).sort();

              patchState(store, {
                allEpisodes,
                allSeasons: sortedSeasons,
                filter: { name: '', seasons: sortedSeasons },
                lastUpdated: new Date(),
              });

              this.applyFilters();
            },
            error: (err: Error) => {
              patchState(store, { error: err.message, allEpisodes: [] });
            },
          });
      },

      /**
       * Invalida cache y recarga todos los episodios
       */
      refreshEpisodes(): void {
        patchState(store, { loading: true, error: null });

        apiService
          .reloadAllEpisodes()
          .pipe(finalize(() => patchState(store, { loading: false })))
          .subscribe({
            next: (allEpisodes: Episode[]) => {
              const seasonsSet = new Set<string>();
              allEpisodes.forEach((ep) => {
                const season = ep.episode.substring(0, 3);
                seasonsSet.add(season);
              });
              const sortedSeasons = Array.from(seasonsSet).sort();

              const currentFilter = store.filter();
              patchState(store, {
                allEpisodes,
                allSeasons: sortedSeasons,
                filter: {
                  ...currentFilter,
                  seasons: currentFilter.seasons.filter((s) => sortedSeasons.includes(s)),
                },
                lastUpdated: new Date(),
              });

              this.applyFilters();
            },
            error: (err: Error) => {
              patchState(store, { error: err.message });
            },
          });
      },

      /**
       * Filtra y pagina episodios en el cliente
       */
      applyFilters(): void {
        const allEpisodes = store.allEpisodes();
        const filter = store.filter();
        const currentPage = store.pagination().currentPage;

        // Filtrar por nombre
        let filtered = allEpisodes;
        if (filter.name) {
          const searchLower = filter.name.toLowerCase();
          filtered = filtered.filter((ep) =>
            ep.name.toLowerCase().includes(searchLower)
          );
        }

        // Filtrar por temporadas
        if (filter.seasons.length > 0) {
          filtered = filtered.filter((ep) => {
            const season = ep.episode.substring(0, 3);
            return filter.seasons.includes(season);
          });
        }

        // Calcular paginación (12 episodios por página)
        const itemsPerPage = 12;
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageResults = filtered.slice(startIndex, endIndex);

        patchState(store, {
          episodes: pageResults,
          pagination: {
            currentPage,
            totalPages,
          },
        });
      },

      selectEpisode(episode: Episode): void {
        patchState(store, { selectedEpisode: episode });
      },

      setFilter(filter: Partial<{ name: string; seasons?: string[] }>): void {
        const currentFilter = store.filter();
        patchState(store, {
          filter: { ...currentFilter, ...filter },
          pagination: { currentPage: 1, totalPages: 1 },
        });
        this.applyFilters();
      },

      setPage(page: number): void {
        patchState(store, {
          pagination: { ...store.pagination(), currentPage: page },
        });
        this.applyFilters();
      },

      clearError(): void {
        patchState(store, { error: null });
      },

      loadCharacters(): void {
        const episode = store.selectedEpisode();
        if (!episode || episode.characters.length === 0) {
          patchState(store, { characters: [] });
          return;
        }

        const characterIds = episode.characters
          .map((url: string) => {
            const id = url.split('/').pop();
            return id ? parseInt(id, 10) : null;
          })
          .filter((id: number | null): id is number => id !== null);

        if (characterIds.length === 0) {
          patchState(store, { characters: [] });
          return;
        }

        apiService.getCharactersByIds(characterIds).subscribe({
          next: (characters: Character | Character[]) => {
            const charArray = Array.isArray(characters) ? characters : [characters];
            patchState(store, { characters: charArray });
          },
          error: () => {
            patchState(store, { characters: [] });
          },
        });
      },
    };
  })
);
