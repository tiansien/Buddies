import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuddyRoutingModule } from './buddy-routing.module';
import { BuddyRequestPageComponent } from './buddy-request-page/buddy-request-page.component';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { BuddyRequestDrawerComponent } from './buddy-request-drawer/buddy-request-drawer.component';


@NgModule({
  declarations: [
    BuddyRequestPageComponent,
    BuddyRequestDrawerComponent
  ],
  imports: [
    CommonModule,
    BuddyRoutingModule,
    SharedZorroModule
  ]
})
export class BuddyModule { }
