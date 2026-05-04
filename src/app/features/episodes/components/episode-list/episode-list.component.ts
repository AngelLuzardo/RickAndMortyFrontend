import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import { EpisodeTableComponent } from '../episode-table/episode-table.component';
import { Episode } from '../../../../shared/models';

type ViewMode = 'cards' | 'table';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [
    CommonModule,
    EpisodeCardComponent,
    EpisodeTableComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeListComponent {
  @Input() episodes: Episode[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Output() onSelectEpisode = new EventEmitter<Episode>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  private readonly STORAGE_KEY = 'episode-view-mode';
  viewMode = signal<ViewMode>(this.getStoredViewMode());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.viewMode());
    });
  }

  private getStoredViewMode(): ViewMode {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return (stored as ViewMode) || 'cards';
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }
}
