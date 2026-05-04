import {
  Component,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-episode-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './episode-filter.component.html',
  styleUrls: ['./episode-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeFilterComponent implements OnChanges {
  @Input() availableSeasons: string[] = [];
  @Output() filterChange = new EventEmitter<{ name: string; seasons: string[] }>();

  nameFilter = '';
  seasonsFilter: string[] = [];

  private nameSubject = new Subject<string>();
  private initializedSeasons = false;

  constructor() {
    this.nameSubject.pipe(debounceTime(800)).subscribe((name) => {
      this.emitFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableSeasons'] && !this.initializedSeasons) {
      const seasons = changes['availableSeasons'].currentValue;
      if (seasons && seasons.length > 0) {
        this.seasonsFilter = [...seasons];
        this.initializedSeasons = true;
      }
    }
  }

  onNameChange(value: string): void {
    this.nameFilter = value;
    this.nameSubject.next(value);
  }

  onSeasonsChange(): void {
    this.emitFilter();
  }

  private emitFilter(): void {
    this.filterChange.emit({
      name: this.nameFilter,
      seasons: this.seasonsFilter,
    });
  }
}
