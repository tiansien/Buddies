import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberLoopPipe } from './number-loop.pipe';

const PIPES =[
  NumberLoopPipe
];

@NgModule({
  declarations: [
    ...PIPES
  ],
  imports: [],exports: [
    ...PIPES
  ]
})
export class PipesModule { }
