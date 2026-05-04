import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Episode } from '../../../../shared/models';
import { getSeasonColor } from '../../../../shared/utils/season-colors';

@Component({
  selector: 'app-episode-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './episode-table.component.html',
  styleUrls: ['./episode-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeTableComponent implements AfterViewInit {
  @Input() set episodes(value: Episode[]) {
    this.dataSource.data = value;
  }
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  
  @Output() onSelectEpisode = new EventEmitter<Episode>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['episode', 'name', 'air_date', 'characters', 'actions'];
  dataSource = new MatTableDataSource<Episode>([]);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getSeasonColor = getSeasonColor;
}
