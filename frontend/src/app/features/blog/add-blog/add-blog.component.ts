import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogService } from 'src/app/core/services/api/blog.service';
import { Router } from '@angular/router';
import { ProfileModule } from '../../profile/profile.module';
import { ProfileService } from 'src/app/core/services/api/profile.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css'],
})
export class AddBlogComponent implements OnInit {
  fileList: File[] = []; // Store selected files
  title: string = '';
  description2: string = '';
  description: string = '';

  username: string = '';
  pictureUrl: string = '';
  yearOfStudy: string = '';
  program: string = '';
  faculty: string = '';

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService,
    private messageService: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = window.localStorage.getItem('userId') || '';
    this.profileService.getUserAndProfileById(id).subscribe((data) => {
      console.log('User and profile data:', data);
      this.pictureUrl = data[0].profilePhoto;
      this.username = data[0].login;
      this.faculty = data[1].fac;
      this.program = data[1].program;
      this.yearOfStudy = data[1].yearOfStudy;
      console.log('Picture URL:', this.pictureUrl);
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      // Convert FileList to an array and store it in fileList
      this.fileList = Array.from(files);
    }
  }

  onSubmitBlog(): void {
    // Prepare FormData to send as 'multipart/form-data'
    const formData = new FormData();

    // Append blog details to the FormData object
    formData.append(
      'blogDto',
      new Blob(
        [
          JSON.stringify({
            postTitle: this.title,
            postDescription: this.description,
            postDescription2: this.description2,
            id: window.localStorage.getItem('userId') || '',
          }),
        ],
        { type: 'application/json' }
      )
    );

    // Append all selected files to FormData
    for (let file of this.fileList) {
      formData.append('files', file, file.name);
    }

    // Use BlogService to send HTTP POST request with FormData
    this.blogService
      .createBlog(
        {
          postTitle: this.title,
          postDescription: this.description,
          postDescription2: this.description2,
          id: window.localStorage.getItem('userId') || '',
        },
        this.fileList
      )
      .subscribe({
        next: (response) => {
          console.log('Blog successfully uploaded:', response);
          // alert('Blog successfully uploaded');
          this.messageService.success('Blog successfully uploaded');
          this.router.navigate(['default/blog']);
        },
        error: (error) => {
          console.error('Error uploading blog:', error);
          // alert('Failed to upload the blog. Please try again.');
          this.messageService.error(
            'Failed to upload the blog. Please try again.'
          );
        },
      });
  }
}
