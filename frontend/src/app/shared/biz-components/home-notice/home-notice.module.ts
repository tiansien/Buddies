import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeNoticeComponent } from './home-notice.component';
import { SHARED_ZORRO_MODULES } from '../../shared-zorro.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [HomeNoticeComponent],
  imports: [CommonModule, SHARED_ZORRO_MODULES, PipesModule],
  exports: [HomeNoticeComponent],
})
export class HomeNoticeModule {}
