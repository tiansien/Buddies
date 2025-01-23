import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/core/services/api/blog.service';
import { ProfileService } from 'src/app/core/services/api/profile.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css'],
})
export class EditBlogComponent {
  fileList: File[] = [];
  title: string = '';
  description2: string = '';
  description: string = '';
  blogId: string = '';

  username: string = '';
  pictureUrl: string = '';
  yearOfStudy: string = '';
  program: string = '';
  faculty: string = '';
  existingImages: string[] = [];

  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    this.loadBlogDetails();
    this.loadUserProfile();
  }

  loadBlogDetails(): void {
    this.blogService.getBlogWithProfile(this.blogId).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length >= 2) {
          const blogDetails = response[0];
          this.title = blogDetails.postTitle;
          this.description = blogDetails.postDescription;
          this.description2 = blogDetails.postDescription2;
          this.existingImages = blogDetails.postPicturePath
            .split(',')
            .map(
              (path: string) =>
                `http://localhost:8080/download/blog/${path.trim()}`
            );
        }
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading blog details:', error),
    });
  }

  loadUserProfile(): void {
    const id = window.localStorage.getItem('userId') || '';
    this.profileService.getUserAndProfileById(id).subscribe((data) => {
      this.pictureUrl = data[0].profilePhoto;
      this.username = data[0].login;
      this.faculty = data[1].fac;
      this.program = data[1].program;
      this.yearOfStudy = data[1].yearOfStudy;
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      this.fileList = Array.from(files);
    }
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  onSubmitEdit(): void {
    if (this.existingImages.length === 0 && this.fileList.length === 0) {
      this.alertMessage = 'Please include at least one picture.';
      this.showAlert = true;
      return;
    }

    // Show confirmation modal
    if (confirm('Are you sure you want to save the changes?')) {
      // Extract filenames from existing image URLs
      const existingImageFilenames = this.existingImages.map((url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });

      const updateData = {
        blogDto: {
          postTitle: this.title,
          postDescription: this.description,
          postDescription2: this.description2,
          blogId: this.blogId,
          id: window.localStorage.getItem('userId') || '',
        },
        files: this.fileList,
        existingImages: existingImageFilenames,
      };

      this.blogService.updateBlog(updateData).subscribe({
        next: (response) => {
          console.log('Blog successfully updated:', response);
          this.router.navigate(['default/blog']);
        },
        error: (error) => {
          console.error('Error updating blog:', error);
          this.alertMessage = 'Failed to update the blog. Please try again.';
          this.showAlert = true;
        },
      });
    }
  }

  async urlToFile(
    url: string,
    filename: string,
    mimeType: string
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  navigateToBlog(): void {
    this.router.navigate(['default/blog']);
  }
}
