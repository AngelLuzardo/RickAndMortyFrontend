import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/episodes',
    pathMatch: 'full',
  },
  {
    path: 'episodes',
    loadChildren: () =>
      import('./features/episodes/episodes.routes').then(
        (m) => m.episodesRoutes
      ),
  },
];
