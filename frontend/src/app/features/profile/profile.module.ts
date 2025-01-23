import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { BlogModule } from '../blog/blog.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { LandingEditComponent } from './landing-edit/landing-edit.component';

@NgModule({
  declarations: [ProfilePageComponent, EditProfileComponent, LandingEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedZorroModule,
    ProfileRoutingModule,
    BlogModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
  ],
  exports: [EditProfileComponent, LandingEditComponent],
})
export class ProfileModule {}
