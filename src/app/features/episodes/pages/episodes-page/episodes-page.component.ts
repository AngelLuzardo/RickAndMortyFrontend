import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EpisodesStore } from '../../store/episodes.store';
import {
  EpisodeListComponent,
  EpisodeFilterComponent,
  EpisodeDetailDialogComponent,
} from '../../components';
import { LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent } from '../../../../shared/components';
import { getSeasonColor } from '../../../../shared/utils/season-colors';

@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    EpisodeFilterComponent,
    EpisodeListComponent,
    EpisodeDetailDialogComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    EmptyStateComponent,
  ],
  templateUrl: './episodes-page.component.html',
  styleUrls: ['./episodes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesPageComponent implements OnInit {
  readonly store = inject(EpisodesStore);
  private dialogOpen = false;

  ngOnInit(): void {
    this.store.loadAllEpisodes();
  }

  onRefresh(): void {
    this.store.refreshEpisodes();
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  onFilterChange(filter: { name: string; seasons: string[] }): void {
    this.store.setFilter(filter);
  }

  onSelectEpisode(episode: any): void {
    this.store.selectEpisode(episode);
    this.store.loadCharacters();
    this.dialogOpen = true;
  }

  getSeasonColor = getSeasonColor;

  onNextPage(): void {
    const nextPage = this.store.pagination().currentPage + 1;
    if (nextPage <= this.store.pagination().totalPages) {
      this.store.setPage(nextPage);
    }
  }

  onPreviousPage(): void {
    const prevPage = this.store.pagination().currentPage - 1;
    if (prevPage >= 1) {
      this.store.setPage(prevPage);
    }
  }

  closeDialog(): void {
    this.dialogOpen = false;
  }

  isDialogOpen(): boolean {
    return this.dialogOpen;
  }
}
