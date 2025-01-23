import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/core/services/api/blog.service';
import { CommentsService } from 'src/app/core/services/api/comments.service';
import { LikeService } from 'src/app/core/services/api/like.service';
import { Comment } from 'src/app/interface/comment';

import { timestamp } from 'rxjs';
import { formatDistanceToNow } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  type: string = '';
  blogId: string = '';
  eventId: string = '';
  details: any;
  userProfile: any;

  likes: number = 0;
  isLiked: boolean = false;
  loading: boolean = true;

  userId: string = localStorage.getItem('userId')!;

  images: string[] = [
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    // Add more images here
  ];

  newComment: string = '';

  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private likeService: LikeService,
    private cdr: ChangeDetectorRef,
    private commentService: CommentsService,
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDetails();
    this.checkLikeStatus();
    console.log('Blog ID:', this.blogId);
    console.log('User ID:', this.userId);
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }

  checkingDeleteAndEdit: boolean = false;

  loadDetails(): void {
    this.loading = true; // Start loading
    this.blogService.getBlogWithProfile(this.blogId).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length >= 2) {
          this.details = response;
          const blogDetails = response[0];
          this.userProfile = response[1];

          this.images = blogDetails.postPicturePath
            .split(',')
            .map(
              (path: string) =>
                `http://localhost:8080/download/blog/${path.trim()}`
            );
          console.log('Blog details:', blogDetails);
          console.log('User profile:', this.userProfile);
          console.log('blogDetails?.appUser?.id', blogDetails?.appUser?.id);

          if (blogDetails?.appUser?.id == this.userId) {
            this.checkingDeleteAndEdit = true;
            this.cdr.detectChanges();
          } else {
            this.checkingDeleteAndEdit = false;
            this.cdr.detectChanges();
          }

          // After loading details, load comments
          this.loadComments();
        } else {
          console.error('Unexpected response structure:', response);
          this.loading = false; // Stop loading on error
        }
      },
      error: (error) => {
        console.error('Error fetching blog details:', error);
        this.loading = false; // Stop loading on error
      },
    });
  }

  loadComments(): void {
    this.commentService.getCommentWithProfile(this.blogId, 'blog').subscribe({
      next: (response: any) => {
        const userProfileData = response.userProfile.reduce(
          (acc: any, curr: any) => {
            if (!acc[curr[0].id]) acc[curr[0].id] = {};
            Object.assign(acc[curr[0].id], ...curr);
            return acc;
          },
          {}
        );

        const commentsWithProfiles = response.comment.map((comment: any) => ({
          ...comment,
          userProfile: userProfileData[comment.id],
        }));

        this.comments = commentsWithProfiles;
        this.cdr.detectChanges();
        this.loading = false; // Stop loading after fetching comments
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
        this.loading = false; // Stop loading on error
      },
    });
  }

  checkLikeStatus(): void {
    const blogIdnumber = parseInt(this.blogId);
    this.likeService.getLikeStatus(this.userId!, blogIdnumber).subscribe({
      next: (response: { likeByMe: string; count: string }) => {
        this.likes = parseInt(response.count);
        this.isLiked = response.likeByMe === 'true';
        this.cdr.markForCheck();
        this.loading = false; // Stop loading after checking like status
      },
      error: (error) => {
        console.error('Error fetching like status and count:', error);
        this.loading = false; // Stop loading on error
      },
    });
  }

  toggleLike(): void {
    if (!this.userId) {
      console.error(
        'User ID is null or undefined. Please ensure the user is logged in.'
      );
      return;
    }
    const blogIdnumber = parseInt(this.blogId);
    this.likeService.toggleLike(this.userId, blogIdnumber).subscribe({
      next: () => {
        this.isLiked = !this.isLiked;
        this.likes += this.isLiked ? 1 : -1;
        this.cdr.markForCheck();
      },
      error: (error) => console.error('Error toggling like:', error),
    });
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;

    const comment = {
      referenceID: this.blogId,
      type: 'blog',
      content: this.newComment,
      id: this.userId,
    };

    this.commentService.addComment(comment).subscribe({
      next: (response: any) => {
        console.log('Comment added:', response);
        this.newComment = '';
        this.loadComments(); // Reload comments after adding a new one
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }

  navigateToEditBlog(blogId: string): void {
    this.router.navigate(['/default/blog/edit/', blogId]);
  }

  deleteBlog(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this blog?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.blogService.deleteBlog(this.blogId).subscribe({
          next: () => {
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'Blog has been deleted successfully',
              nzOnOk: () => this.router.navigate(['/default/blog']),
            });
          },
          error: (error) => {
            console.error('Error deleting blog:', error);
            this.modal.error({
              nzTitle: 'Error',
              nzContent: 'Failed to delete the blog. Please try again.',
            });
          },
        });
      },
      nzCancelText: 'Cancel',
    });
  }

  checkingEditAndDelete(): boolean {
    console.log('this.userProfile?.appUser?.id', this.userProfile?.appUser?.id);
    console.log('userId:', this.userId);
    if (this.userProfile?.appUser?.id === this.userId) {
      return true;
    } else {
      return false;
    }
  }

  redirectToProfile(comment: Comment): void {
    if (comment.userProfile) {
      this.router.navigate(['/default/profile', comment.userProfile.id]);
    } else {
      console.error('User profile is undefined for the comment:', comment);
    }
  }

  redirectToProfileFromBlog(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/default/profile/', id]);
    });
  }
}
