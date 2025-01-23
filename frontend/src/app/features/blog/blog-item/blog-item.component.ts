import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from 'src/app/core/services/api/comments.service';
import { LikeService } from 'src/app/core/services/api/like.service';
@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.css']
})
export class BlogItemComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() likes: number = 0;
  @Input() comments: number = 0;
  @Input() category: string = '';
  @Input() profilePictureUrl: string = '';
  @Input() postingDate: string = '';
  @Input() postingAuthor: string = '';
  @Input() blogId: number = 0;
  @Input() isProfile: boolean = false;
  @Input() authorId: string | null = null;

  userId: string | null = localStorage.getItem('userId');
  isLiked: boolean = false;

  CommentCount: String = '';

  constructor(private likeService: LikeService, private cdr: ChangeDetectorRef, private router: Router, private commentsService: CommentsService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.checkLikeStatus();
      this.getCommentCount();
    }
  }

  checkLikeStatus() {
    this.likeService.getLikeStatus(this.userId!, this.blogId).subscribe({
      next: (response) => {
        this.likes = parseInt(response.count);
        this.isLiked = response.likeByMe === 'true';
        this.cdr.markForCheck(); // Ensure the UI updates with these new values
        console.log('This author', this.authorId);
      },
      error: (error) => console.error('Error fetching like status and count:', error)
    });
  }

  toggleLike() {
    if (!this.userId) {
      console.error('User ID is null or undefined. Please ensure the user is logged in.');
      return;
    }

    this.likeService.toggleLike(this.userId, this.blogId).subscribe({
      next: () => {
        this.isLiked = !this.isLiked; // Toggle the like status
        this.likes += this.isLiked ? 1 : -1; // Adjust likes count based on new like status
        this.cdr.markForCheck(); // Trigger UI update
      },
      error: (error) => console.error('Error toggling like:', error)
    });
  }


  redirectToDetailPage(): void {
    this.router.navigateByUrl('/default/blog/detail/' + this.blogId);
    // this.router.navigate(['detail/', this.blogId]);
  }

  redirectToProfile(): void {
    console.log('Profile page', this.authorId);
    this.router.navigateByUrl('/default/profile/' + this.authorId);
  }

  getCommentCount(): void {
    this.commentsService.getTotalCommentCount(this.blogId, 'blog').subscribe({
      next: (response: any) => {
        console.log('Total comments:', response);
        this.CommentCount = response;
        this.cdr.markForCheck();
      },
      error: (error) => console.error('Error fetching comment count:', error)
    });
  }

}
