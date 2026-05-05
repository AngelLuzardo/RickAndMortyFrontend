import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Episode } from '../../../../shared/models';
import { getSeasonColor } from '../../../../shared/utils/season-colors';

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

  getSeasonColor = getSeasonColor;
}
