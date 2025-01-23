import { NgModule } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAlertModule } from 'ng-zorro-antd/alert';

export const SHARED_ZORRO_MODULES = [
  NzTypographyModule,
  NzTagModule,
  NzListModule,
  NzTabsModule,
  NzCardModule,
  NzBadgeModule,
  NzDropDownModule,
  NzLayoutModule,
  NzMenuModule,
  NzIconModule,
  NzToolTipModule,
  NzAvatarModule,
  NzUploadModule,
  NzSelectModule,
  FormsModule,
  NzModalModule,
  NzCarouselModule,
  NzFormModule,
  NzSpinModule,
  NzDrawerModule,
  NzEmptyModule,
  NzAlertModule,
];

@NgModule({
  imports: [
    ...SHARED_ZORRO_MODULES
  ],
  exports: [
    ...SHARED_ZORRO_MODULES
  ]
})
export class SharedZorroModule { }
