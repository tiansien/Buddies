import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { DetailPageComponent } from 'src/app/shared/components/detail-page/detail-page.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: BlogPageComponent },
      { path: 'add', component: AddBlogComponent },
      { path: 'detail/:id', component: BlogDetailComponent },
      { path: 'edit/:id', component: EditBlogComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
