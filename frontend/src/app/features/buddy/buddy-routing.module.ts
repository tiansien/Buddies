import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuddyRequestPageComponent } from './buddy-request-page/buddy-request-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: BuddyRequestPageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuddyRoutingModule { }
