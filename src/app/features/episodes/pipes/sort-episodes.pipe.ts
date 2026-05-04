import { Pipe, PipeTransform } from '@angular/core';
import { Episode } from '../../../shared/models';



type SortOrder = 'asc' | 'desc' | 'date-asc' | 'date-desc';

@Pipe({
  name: 'sortEpisodes',
  standalone: true,
})
export class SortEpisodesPipe implements PipeTransform {
  transform(episodes: Episode[], order: SortOrder = 'asc'): Episode[] {
    if (!episodes || episodes.length === 0) {
      return episodes;
    }

    const sorted = [...episodes];

    switch (order) {
      case 'asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.air_date).getTime() - new Date(b.air_date).getTime());
        break;
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.air_date).getTime() - new Date(a.air_date).getTime());
        break;
    }

    return sorted;
  }
}
