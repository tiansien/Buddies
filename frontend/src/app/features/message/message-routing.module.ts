import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagingPageComponent } from './messaging-page/messaging-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MessagingPageComponent },
      { path: ':contactId', component: MessagingPageComponent },  // Dynamic route for selected contact
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }
