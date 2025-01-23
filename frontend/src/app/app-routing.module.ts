import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateEventComponent} from "./features/event/create-event/create-event.component";
import {EventsListComponent} from "./features/event/events-list/events-list.component";
import {LoginFormComponent} from "./features/landing/login-form/login-form.component";
import { DefaultComponent } from './layout/default/default.component';
import { BuddyModule } from './features/buddy/buddy.module';

export const routes: Routes = [
  // { path: 'login', component: LoginFormComponent },
  // { path: 'events', component: EventsListComponent },
  // { path: 'create-event', component: CreateEventComponent},
  // { path: '', redirectTo: '', pathMatch: 'full' }, // Redirect to events by default
  // { path: 'default', component: DefaultComponent },
  {
    path: 'default',
    component: DefaultComponent,
    children: [
      {
        path: 'events',
        loadChildren: () => import('./features/event/event.module').then(m => m.EventModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./features/blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'buddy',
        loadChildren: () => import('./features/buddy/buddy.module').then(m => m.BuddyModule)
      },
      {
        path: 'message',
        loadChildren: () => import('./features/message/message.module').then(m => m.MessageModule)
      },
    ]
  },
  { path: '', redirectTo: 'default/events', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
