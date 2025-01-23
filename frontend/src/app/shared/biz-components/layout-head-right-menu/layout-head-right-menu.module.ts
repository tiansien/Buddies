import { NgModule } from '@angular/core';
import { LayoutHeadRightMenuComponent } from './layout-head-right-menu.component';
import { SHARED_ZORRO_MODULES } from '../../shared-zorro.module';
import { CommonModule } from '@angular/common';
import { HomeNoticeModule } from '../home-notice/home-notice.module';

@NgModule({
  declarations: [
    LayoutHeadRightMenuComponent
  ],
  imports: [
    CommonModule,
    HomeNoticeModule,
    SHARED_ZORRO_MODULES
  ],
  exports: [
    LayoutHeadRightMenuComponent
  ]
})
export class LayoutHeadRightMenuModule { }
