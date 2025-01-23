import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { SharedZorroModule } from '../shared-zorro.module';



@NgModule({
  declarations: [
    DetailPageComponent
  ],
  imports: [
    CommonModule,
    SharedZorroModule
  ],
  exports: [
    DetailPageComponent
  ]
})
export class ComponentsModule { }
