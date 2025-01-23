import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LandingEditComponent } from './landing-edit/landing-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // { path: '', component: ProfilePageComponent },
      { path: 'edit', component: EditProfileComponent },
      { path: ':id', component: ProfilePageComponent },
      { path: 'landing-edit', component: LandingEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
