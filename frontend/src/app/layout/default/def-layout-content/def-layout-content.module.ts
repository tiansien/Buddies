import { NgModule } from '@angular/core';
import { DefLayoutContentComponent } from './def-layout-content.component';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DefLayoutContentComponent
  ],
  imports: [
    SharedZorroModule,
    CommonModule,
    RouterModule
  ],
  exports: [DefLayoutContentComponent]
})
export class DefLayoutContentModule { }
