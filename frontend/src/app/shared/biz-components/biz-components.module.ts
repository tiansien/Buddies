import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutHeadRightMenuModule } from './layout-head-right-menu/layout-head-right-menu.module';
import { SharedZorroModule } from '../shared-zorro.module';

const MODULES = [LayoutHeadRightMenuModule];

@NgModule({
  imports: [
    CommonModule,
    ...MODULES,
    SharedZorroModule
  ],
  exports: [
    ...MODULES
  ]
})
export class BizComponentsModule { }
