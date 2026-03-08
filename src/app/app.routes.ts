import { Routes } from '@angular/router';

import { NotFoundComponent } from './features/not-found/not-found.component';
import { AddComponent } from './features/users/pages/add/add.component';
import { DefaultLayoutComponent } from './core/Layouts/default-layout/default-layout.component';
import { UsersComponent } from './features/users/pages/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },

  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'users/add', component: AddComponent },
      { path: 'users/edit/:id', component: AddComponent },
      { path: 'users/view/:id', component: AddComponent },
      { path: 'users', component: UsersComponent },
    ]
  },

  { path: '**', component: NotFoundComponent }
];
