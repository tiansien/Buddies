import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BizComponentsModule } from './biz-components/biz-components.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { PipesModule } from './pipes/pipes.module';

const MODULES = [
  CommonModule,
  FormsModule,
  BizComponentsModule,
  ReactiveFormsModule,
  PipesModule,
  ...SHARED_ZORRO_MODULES
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES
  ]
})
export class SharedModule { }
