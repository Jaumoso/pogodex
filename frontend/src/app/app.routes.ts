import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pokelist', component: PokemonListComponent },
  { path: '**', redirectTo: 'login' },
];
