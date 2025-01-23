import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/core/services/api/blog.service';
import { EventService } from 'src/app/core/services/api/event.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {

  type: string = '';
  blogId: string = '';
  eventId: string = '';
  details: any;

  images: string[] = [
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    // Add more images here
  ];
  

  newComment: string = '';

  comments = [
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    { name: 'Testing Name', text: 'Testing comment testing comment...' },
    // Add more comments here
  ];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') || '';
    if (this.type == 'blog') {
      this.blogId = this.route.snapshot.paramMap.get('id') || '';
    } else if (this.type === 'event') {
      this.eventId = this.route.snapshot.paramMap.get('id') || '';
    }
    this.loadDetails();
    this.loadComments();
  }

  loadDetails(): void {
    if (this.type === 'blog') {
      this.blogService.getBlogWithProfile(this.blogId).subscribe({
        next: (response) => {
          this.details = response;
          console.log('Blog details:', this.details);
        },
        error: (error) => {
          console.error('Error fetching blog details:', error);
        }
      });
    } else if (this.type === 'event') {
      const idNumber = parseInt(this.eventId);
      this.eventService.getEventById(idNumber).subscribe({
        next: (response) => {
          this.details = response;
          console.log('Event details:', this.details);
        },
        error: (error) => {
          console.error('Error fetching event details:', error);
        }
      });
    }
  }

  loadComments(): void {
    // Load comments logic
  }

  submitComment(): void {
    if (!this.newComment.trim()) return; // Prevent blank comments

    // Assuming CommentService handles your API calls
  //   this.commentService.postComment(this.newComment).subscribe({
  //     next: (comment) => {
  //       this.comments.push(comment);
  //       this.newComment = ''; // Reset input after success
  //     },
  //     error: (error) => {
  //       console.error('Error posting comment:', error);
  //     }
  //   });
  }
}
