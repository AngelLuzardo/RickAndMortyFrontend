import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EpisodeFilterComponent } from './episode-filter.component';
import { FormsModule } from '@angular/forms';

interface FilterChangeEvent {
  name: string;
  seasons: string[];
}

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
    let emitted: FilterChangeEvent | null = null;
    component.filterChange.subscribe((value) => {
      emitted = value;
    });

    component.availableSeasons = ['S01', 'S02', 'S03'];
    component.ngOnChanges({
      availableSeasons: {
        previousValue: undefined,
        currentValue: ['S01', 'S02', 'S03'],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    component.onNameChange('Pilot');

    tick(900); // debounceTime is 800ms, adding 100ms extra to be safe

    expect(emitted).toEqual({
      name: 'Pilot',
      seasons: ['S01', 'S02', 'S03'],
    });
  }));

  it('should emit filter change on seasons change', fakeAsync(() => {
    let emitted: FilterChangeEvent | null = null;
    component.filterChange.subscribe((value) => {
      emitted = value;
    });

    component.availableSeasons = ['S01', 'S02', 'S03'];
    component.ngOnChanges({
      availableSeasons: {
        previousValue: undefined,
        currentValue: ['S01', 'S02', 'S03'],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    component.seasonsFilter = ['S01'];
    component.onSeasonsChange();

    tick();

    expect(emitted).toEqual({
      name: '',
      seasons: ['S01'],
    });
  }));

  it('should initialize with all available seasons', fakeAsync(() => {
    component.availableSeasons = ['S01', 'S02', 'S03', 'S04', 'S05'];
    component.ngOnChanges({
      availableSeasons: {
        previousValue: undefined,
        currentValue: ['S01', 'S02', 'S03', 'S04', 'S05'],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    tick();

    expect(component.seasonsFilter).toEqual(['S01', 'S02', 'S03', 'S04', 'S05']);
  }));
});
