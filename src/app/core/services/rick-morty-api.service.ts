import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, map, catchError, expand, reduce } from 'rxjs/operators';
import { ApiResponse, Character, Episode } from '../../shared/models';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RickMortyApiService {
  private readonly API_URL = environment.apiUrl;
  private allEpisodesCache$: Observable<Episode[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los episodios con cache
   */
  getAllEpisodes(): Observable<Episode[]> {
    if (this.allEpisodesCache$) {
      return this.allEpisodesCache$;
    }

    return this.loadAllEpisodes();
  }

  /**
   * Invalida el cache
   */
  clearEpisodesCache(): void {
    this.allEpisodesCache$ = null;
  }

  /**
   * Recarga todos los episodios desde la API
   */
  reloadAllEpisodes(): Observable<Episode[]> {
    this.clearEpisodesCache();
    return this.getAllEpisodes();
  }

  private loadAllEpisodes(): Observable<Episode[]> {
    this.allEpisodesCache$ = this.http
      .get<ApiResponse<Episode>>(`${this.API_URL}/episode`)
      .pipe(
        catchError(() =>
          of({
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          } as ApiResponse<Episode>)
        ),
        expand((response: ApiResponse<Episode>) => {
          if (response.info.next) {
            return this.http.get<ApiResponse<Episode>>(response.info.next).pipe(
              catchError(() =>
                of({
                  info: { count: 0, pages: 0, next: null, prev: null },
                  results: [],
                } as ApiResponse<Episode>)
              )
            );
          }
          return of();
        }),
        map((response: ApiResponse<Episode>) => response.results),
        reduce((acc: Episode[], episodes: Episode[]) => [...acc, ...episodes], [] as Episode[]),
        shareReplay(1)
      );

    return this.allEpisodesCache$;
  }

  getCharactersByIds(ids: number[]): Observable<Character[]> {
    if (ids.length === 0) {
      return of([]);
    }

    const idList = ids.join(',');
    return this.http.get<Character[]>(`${this.API_URL}/character/${idList}`).pipe(
      shareReplay(1)
    );
  }
}
