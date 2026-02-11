import { Routes } from '@angular/router';
import { UsersComponent } from './features/users/users.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AddComponent } from './features/users/add/add.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },

  { path: 'users/add', component: AddComponent },
  { path: 'users/edit/:id', component: AddComponent },
  { path: 'users/view/:id', component: AddComponent },

  { path: 'users', component: UsersComponent },
  { path: '**', component: NotFoundComponent }
];
