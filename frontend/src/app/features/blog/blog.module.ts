import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    BlogItemComponent,
    BlogPageComponent,
    AddBlogComponent,
    BlogDetailComponent,
    EditBlogComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedZorroModule,
    CommonModule,
    ComponentsModule,
    NzModalModule
  ],
  exports: [BlogItemComponent],
})
export class BlogModule {}
