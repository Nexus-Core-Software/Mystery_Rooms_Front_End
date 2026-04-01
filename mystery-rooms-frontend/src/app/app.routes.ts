import { Routes } from '@angular/router';
import { Reto4Component } from './features/game/reto4/reto4';

export const routes: Routes = [
  {
    path: 'game/reto4',
    component: Reto4Component
  },
  {
    path: '',
    redirectTo: 'game/reto4',
    pathMatch: 'full'
  }
];
