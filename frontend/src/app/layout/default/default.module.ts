import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';


@NgModule({
  declarations: [
    SideNavComponent,
    NavBarComponent,
    ToolBarComponent,
  ],
  imports: [
    SharedZorroModule,
    DefaultRoutingModule,
    CommonModule,
    SharedZorroModule,
  ],
  exports: [
    SideNavComponent,
    ToolBarComponent,
  ] 
})
export class DefaultModule { }
