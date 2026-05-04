import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RickMortyApiService } from './rick-morty-api.service';
import { ApiResponse, Episode, Character } from '../../shared/models';
import { environment } from '../../../environments/environment';

describe('RickMortyApiService', () => {
  let service: RickMortyApiService;
  let httpMock: HttpTestingController;
  const API_BASE = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RickMortyApiService],
    });
    service = TestBed.inject(RickMortyApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllEpisodes', () => {
    it('should load all episodes with pagination recursively', fakeAsync(() => {
      const mockPage1: ApiResponse<Episode> = {
        info: { count: 51, pages: 3, next: `${API_BASE}/episode?page=2`, prev: null },
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', 
            characters: [], url: '', created: '' }
        ],
      };

      const mockPage2: ApiResponse<Episode> = {
        info: { count: 51, pages: 3, next: `${API_BASE}/episode?page=3`, prev: `${API_BASE}/episode?page=1` },
        results: [
          { id: 12, name: 'A Rickle in Time', air_date: 'July 26, 2015', episode: 'S02E01',
            characters: [], url: '', created: '' }
        ],
      };

      const mockPage3: ApiResponse<Episode> = {
        info: { count: 51, pages: 3, next: null, prev: `${API_BASE}/episode?page=2` },
        results: [
          { id: 22, name: 'The Rickshank Rickdemption', air_date: 'April 1, 2017', episode: 'S03E01',
            characters: [], url: '', created: '' }
        ],
      };

      let allEpisodes: Episode[] = [];
      service.getAllEpisodes().subscribe((episodes) => {
        allEpisodes = episodes;
      });

      const req1 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      expect(req1.request.method).toBe('GET');
      req1.flush(mockPage1);

      const req2 = httpMock.expectOne(`${API_BASE}/episode?page=2`);
      req2.flush(mockPage2);

      const req3 = httpMock.expectOne(`${API_BASE}/episode?page=3`);
      req3.flush(mockPage3);

      tick();

      expect(allEpisodes.length).toBe(3);
      expect(allEpisodes[0].episode).toBe('S01E01');
      expect(allEpisodes[1].episode).toBe('S02E01');
      expect(allEpisodes[2].episode).toBe('S03E01');
    }));

    it('should cache episodes and return cached data on subsequent calls', fakeAsync(() => {
      const mockResponse: ApiResponse<Episode> = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01',
            characters: [], url: '', created: '' }
        ],
      };

      service.getAllEpisodes().subscribe();
      const req1 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      req1.flush(mockResponse);
      tick();

      service.getAllEpisodes().subscribe();
      httpMock.expectNone(`${API_BASE}/episode?page=1`);
    }));
  });

  describe('clearEpisodesCache', () => {
    it('should invalidate cache', fakeAsync(() => {
      const mockResponse: ApiResponse<Episode> = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01',
            characters: [], url: '', created: '' }
        ],
      };

      service.getAllEpisodes().subscribe();
      const req1 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      req1.flush(mockResponse);
      tick();

      service.clearEpisodesCache();

      service.getAllEpisodes().subscribe();
      const req2 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      req2.flush(mockResponse);
      tick();
    }));
  });

  describe('reloadAllEpisodes', () => {
    it('should clear cache and reload episodes', fakeAsync(() => {
      const mockResponse: ApiResponse<Episode> = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01',
            characters: [], url: '', created: '' }
        ],
      };

      service.getAllEpisodes().subscribe();
      const req1 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      req1.flush(mockResponse);
      tick();

      service.reloadAllEpisodes().subscribe();
      const req2 = httpMock.expectOne(`${API_BASE}/episode?page=1`);
      expect(req2.request.method).toBe('GET');
      req2.flush(mockResponse);
      tick();
    }));
  });

  describe('getCharacters', () => {
    it('should fetch multiple characters by IDs', fakeAsync(() => {
      const mockCharacters: Character[] = [
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'rick.jpg',
          location: { name: 'Earth', url: '' }, origin: { name: 'Earth C-137', url: '' } },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'morty.jpg',
          location: { name: 'Earth', url: '' }, origin: { name: 'Earth C-137', url: '' } }
      ];

      let result: Character[] = [];
      service.getCharactersByIds([1, 2]).subscribe((chars) => {
        result = chars;
      });

      const req = httpMock.expectOne(`${API_BASE}/character/1,2`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCharacters);
      tick();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Rick Sanchez');
      expect(result[1].name).toBe('Morty Smith');
    }));

    it('should return empty array for empty IDs', fakeAsync(() => {
      let result: Character[] | undefined;
      service.getCharactersByIds([]).subscribe((chars) => {
        result = chars;
      });
      tick();

      expect(result).toEqual([]);
      httpMock.expectNone(`${API_BASE}/character/`);
    }));
  });
});
