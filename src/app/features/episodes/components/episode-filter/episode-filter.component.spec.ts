import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EpisodeFilterComponent } from './episode-filter.component';
import { FormsModule } from '@angular/forms';

describe('EpisodeFilterComponent', () => {
  let component: EpisodeFilterComponent;
  let fixture: ComponentFixture<EpisodeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeFilterComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filter change on name input', fakeAsync(() => {
    let emitted: any = null;
    component.filterChange.subscribe((value) => {
      emitted = value;
    });

    component.onNameChange('Pilot');

    tick(500); // debounceTime is 400ms, adding 100ms extra to be safe

    expect(emitted).toEqual({
      name: 'Pilot',
      season: '',
    });
  }));

  it('should emit filter change on season select', () => {
    let emitted: any = null;
    component.filterChange.subscribe((value) => {
      emitted = value;
    });

    component.seasonFilter = 'S01';
    component.onSeasonChange();

    expect(emitted).toEqual({
      name: '',
      season: 'S01',
    });
  });
});
