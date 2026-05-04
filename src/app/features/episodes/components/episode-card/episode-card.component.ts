import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Episode } from '../../../../shared/models';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-card.component.html',
  styleUrls: ['./episode-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeCardComponent {
  @Input() episode!: Episode;
  @Output() onSelect = new EventEmitter<Episode>();

  getSeasonColor(episode: string): string {
    const season = episode.substring(1, 3);
    const seasonColors: { [key: string]: string } = {
      '01': '#FF6B6B',
      '02': '#4ECDC4',
      '03': '#45B7D1',
      '04': '#FFA07A',
      '05': '#98D8C8',
    };
    return seasonColors[season] || '#667eea';
  }
}
