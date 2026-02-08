import { Routes } from '@angular/router';
import { UsersComponent } from './features/users/users.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: UsersComponent },
  { path: '**', component: NotFoundComponent }
];
