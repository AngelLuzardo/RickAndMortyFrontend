import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Episode, Character } from '../../../../shared/models';
import { getSeasonColor } from '../../../../shared/utils/season-colors';

@Component({
  selector: 'app-episode-detail-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-detail-dialog.component.html',
  styleUrls: ['./episode-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailDialogComponent {
  @Input() isOpen = false;
  @Input() episode: Episode | null = null;
  @Input() characters: Character[] = [];
  @Output() onClose = new EventEmitter<void>();

  getSeasonColor = getSeasonColor;
}
