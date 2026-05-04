import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EpisodesStore } from './episodes.store';
import { RickMortyApiService } from '../../../core/services/rick-morty-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Episode, Character } from '../../../shared/models';
import { vi } from 'vitest';

describe('EpisodesStore', () => {
  let store: InstanceType<typeof EpisodesStore>;
  let apiService: RickMortyApiService;

  const mockEpisodes: Episode[] = [
    { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', 
      characters: ['1', '2'], url: '', created: '' },
    { id: 12, name: 'A Rickle in Time', air_date: 'July 26, 2015', episode: 'S02E01',
      characters: ['1', '2'], url: '', created: '' },
    { id: 22, name: 'The Rickshank Rickdemption', air_date: 'April 1, 2017', episode: 'S03E01',
      characters: ['1'], url: '', created: '' },
  ];

  const mockCharacters: Character[] = [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'rick.jpg',
      location: { name: 'Citadel of Ricks', url: '' }, origin: { name: 'Earth C-137', url: '' } },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'morty.jpg',
      location: { name: 'Citadel of Ricks', url: '' }, origin: { name: 'Earth C-137', url: '' } }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EpisodesStore, RickMortyApiService],
    });

    store = TestBed.inject(EpisodesStore);
    apiService = TestBed.inject(RickMortyApiService);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.episodes().length).toBe(0);
      expect(store.allEpisodes().length).toBe(0);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.selectedEpisode()).toBeNull();
      expect(store.characters().length).toBe(0);
      expect(store.filter().name).toBe('');
      expect(store.filter().seasons.length).toBe(0);
      expect(store.pagination().currentPage).toBe(1);
      expect(store.pagination().totalPages).toBe(1);
      expect(store.lastUpdated()).toBeNull();
    });

    it('should have correct computed values', () => {
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
      expect(store.isEmpty()).toBe(true);
      expect(store.availableSeasons().length).toBe(0);
    });
  });

  describe('loadAllEpisodes', () => {
    it('should load all episodes and extract seasons', fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));

      store.loadAllEpisodes();
      tick();

      expect(store.loading()).toBe(false);
      expect(store.allEpisodes().length).toBe(3);
      expect(store.allSeasons()).toEqual(['S01', 'S02', 'S03']);
      expect(store.filter().seasons).toEqual(['S01', 'S02', 'S03']);
      expect(store.episodes().length).toBe(3);
      expect(store.lastUpdated()).not.toBeNull();
    }));

    it('should handle errors when loading episodes', fakeAsync(() => {
      const errorMessage = 'Network error';
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.loadAllEpisodes();
      tick();

      expect(store.loading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
      expect(store.allEpisodes().length).toBe(0);
      expect(store.hasError()).toBe(true);
    }));
  });

  describe('refreshEpisodes', () => {
    it('should reload episodes and maintain current filter', fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();

      store.setFilter({ name: 'Pilot', seasons: ['S01'] });
      tick();

      vi.spyOn(apiService, 'reloadAllEpisodes').mockReturnValue(of(mockEpisodes));
      const previousTimestamp = store.lastUpdated();

      store.refreshEpisodes();
      tick();

      expect(store.lastUpdated()).not.toBe(previousTimestamp);
      expect(store.filter().name).toBe('Pilot');
      expect(store.filter().seasons).toEqual(['S01']);
    }));

    it('should remove invalid seasons from filter after refresh', fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();

      store.setFilter({ name: '', seasons: ['S01', 'S04'] });
      tick();

      vi.spyOn(apiService, 'reloadAllEpisodes').mockReturnValue(of(mockEpisodes));

      store.refreshEpisodes();
      tick();

      expect(store.filter().seasons).toEqual(['S01']);
      expect(store.filter().seasons).not.toContain('S04');
    }));
  });

  describe('applyFilters', () => {
    beforeEach(fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();
    }));

    it('should filter episodes by name', fakeAsync(() => {
      store.setFilter({ name: 'Pilot', seasons: ['S01', 'S02', 'S03'] });
      tick();

      expect(store.episodes().length).toBe(1);
      expect(store.episodes()[0].name).toBe('Pilot');
    }));

    it('should filter episodes by seasons', fakeAsync(() => {
      store.setFilter({ name: '', seasons: ['S01'] });
      tick();

      expect(store.episodes().length).toBe(1);
      expect(store.episodes()[0].episode).toBe('S01E01');
    }));

    it('should filter by name and seasons combined', fakeAsync(() => {
      store.setFilter({ name: 'Rick', seasons: ['S02', 'S03'] });
      tick();

      const episodes = store.episodes();
      expect(episodes.length).toBe(2);
      expect(episodes.every(ep => ep.name.toLowerCase().includes('rick'))).toBe(true);
      expect(episodes.every(ep => ['S02', 'S03'].includes(ep.episode.substring(0, 3)))).toBe(true);
    }));

    it('should paginate results correctly', fakeAsync(() => {
      const manyEpisodes = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `Episode ${i + 1}`,
        air_date: 'Date',
        episode: 'S01E01',
        characters: [],
        url: '',
        created: ''
      }));

      vi.spyOn(apiService, 'reloadAllEpisodes').mockReturnValue(of(manyEpisodes));
      store.refreshEpisodes();
      tick();

      expect(store.pagination().totalPages).toBe(3);
      expect(store.episodes().length).toBe(12);
    }));
  });

  describe('setFilter', () => {
    beforeEach(fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();
    }));

    it('should update filter and reset to page 1', fakeAsync(() => {
      store.setPage(2);
      tick();

      store.setFilter({ name: 'Pilot', seasons: ['S01'] });
      tick();

      expect(store.filter().name).toBe('Pilot');
      expect(store.filter().seasons).toEqual(['S01']);
      expect(store.pagination().currentPage).toBe(1);
    }));
  });

  describe('setPage', () => {
    beforeEach(fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();
    }));

    it('should update current page', fakeAsync(() => {
      store.setPage(2);
      tick();

      expect(store.pagination().currentPage).toBe(2);
    }));
  });

  describe('selectEpisode and loadCharacters', () => {
    beforeEach(fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(of(mockEpisodes));
      store.loadAllEpisodes();
      tick();
    }));

    it('should select episode', () => {
      const episode = mockEpisodes[0];
      store.selectEpisode(episode);

      expect(store.selectedEpisode()).toEqual(episode);
    });

    it('should load characters for selected episode', fakeAsync(() => {
      vi.spyOn(apiService, 'getCharactersByIds').mockReturnValue(of(mockCharacters));

      store.selectEpisode(mockEpisodes[0]);
      store.loadCharacters();
      tick();

      expect(store.characters().length).toBe(2);
      expect(store.characters()[0].name).toBe('Rick Sanchez');
      expect(store.characters()[0].location?.name).toBe('Citadel of Ricks');
    }));

    it('should handle character loading errors', fakeAsync(() => {
      vi.spyOn(apiService, 'getCharactersByIds').mockReturnValue(
        throwError(() => new Error('Failed to load characters'))
      );

      store.selectEpisode(mockEpisodes[0]);
      store.loadCharacters();
      tick();

      expect(store.error()).toBe('Failed to load characters');
    }));
  });

  describe('clearError', () => {
    it('should clear error state', fakeAsync(() => {
      vi.spyOn(apiService, 'getAllEpisodes').mockReturnValue(
        throwError(() => new Error('Test error'))
      );

      store.loadAllEpisodes();
      tick();

      expect(store.error()).toBe('Test error');

      store.clearError();

      expect(store.error()).toBeNull();
    }));
  });
});
