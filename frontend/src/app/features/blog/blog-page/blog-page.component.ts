import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/core/services/api/blog.service';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css'],
})
export class BlogPageComponent implements OnInit {
  allBlogs: any[] = [];
  followedBlogs: any[] = [];
  displayedAllBlogs: any[] = [];
  displayedFollowedBlogs: any[] = [];
  currentUserId: string = '';
  selectedIndex = 0;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  userId = localStorage.getItem('userId') || '';

  ngOnInit(): void {
    this.currentUserId = this.userId;
    this.fetchAllBlogs();
    this.fetchFollowedBlogs();
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchTerm.trim()) {
      this.resetDisplayBlogs();
    } else {
      this.filterBlogs(searchTerm);
    }
    this.cdr.markForCheck(); // Optimize change detection
  }

  resetDisplayBlogs(): void {
    if (this.selectedIndex === 0) {
      this.displayedAllBlogs = [...this.allBlogs];
    } else {
      this.displayedFollowedBlogs = [...this.followedBlogs];
    }
  }

  filterBlogs(searchTerm: string): void {
    if (this.selectedIndex === 0) {
      this.displayedAllBlogs = this.filterBlogList(this.allBlogs, searchTerm);
    } else {
      this.displayedFollowedBlogs = this.filterBlogList(
        this.followedBlogs,
        searchTerm
      );
    }
  }

  filterBlogList(blogs: any[], searchTerm: string): any[] {
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.description.toLowerCase().includes(searchTerm) ||
        blog.category.toLowerCase().includes(searchTerm) ||
        blog.postingAuthor.toLowerCase().includes(searchTerm)
    );
  }

  fetchAllBlogs(): void {
    this.blogService.getAllBlogsTest().subscribe({
      next: (response) => {
        this.allBlogs = this.transformBlogs(response);
        this.displayedAllBlogs = [...this.allBlogs];
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching all blogs:', error),
    });
  }

  fetchFollowedBlogs(): void {
    if (this.currentUserId) {
      this.blogService
        .getAllBlogsWithProfilesFollowed(this.currentUserId)
        .subscribe({
          next: (response) => {
            this.followedBlogs = this.transformBlogs(response);
            this.displayedFollowedBlogs = [...this.followedBlogs];
            this.cdr.detectChanges();
          },
          error: (error) =>
            console.error('Error fetching followed blogs:', error),
        });
    }
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.resetDisplayBlogs();
    this.cdr.detectChanges(); // Ensure UI is updated when switching tabs
  }

  private transformBlogs(response: any[]): any[] {
    return response.map((item: any) => ({
      id: item.blog.blogID,
      title: item.blog.postTitle || 'No Title',
      description: item.blog.postDescription,
      category: item.blog.postDescription2,
      imageUrl: item.blog.postPicturePath
        ? `http://localhost:8080/download/Blog/${
            item.blog.postPicturePath.split(',')[0]
          }`
        : null,
      profilePictureUrl:
        `http://localhost:8080/download/User/${item.blog.appUser.profilePhoto}` ||
        item.profile.profilePhoto,
      postingAuthor: `${item.blog.appUser.login}`,
      postingDate: this.formatDateDynamic(item.blog.timestamp),
      likes: 0,
      comments: 0,
      authorId: item.blog.appUser.id,
    }));
  }

  // formatDateDynamic(timestamp: number[]): string {
  //   console.log('Timestamp:', timestamp);
  //   if (!timestamp || timestamp.length < 7) return 'Invalid Date';

  //   const [year, month, day, hour, minute, second, nanoseconds] = timestamp;
  //   const milliseconds = Math.floor(nanoseconds / 1_000_000);
  //   const date = new Date(
  //     year,
  //     month - 1,
  //     day,
  //     hour,
  //     minute,
  //     second,
  //     milliseconds
  //   );

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const yesterday = new Date(today);
  //   yesterday.setDate(today.getDate() - 1);

  //   if (date.toDateString() === today.toDateString()) {
  //     return 'Today';
  //   } else if (date.toDateString() === yesterday.toDateString()) {
  //     return 'Yesterday';
  //   } else {
  //     const daysAgo = Math.floor(
  //       (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  //     );
  //     return `${daysAgo} days ago`;
  //   }
  // }


  formatDateDynamic(timestampStr: string): string {
    console.log('Timestamp:', timestampStr);
    if (!timestampStr) return 'Invalid Date';

    const date = new Date(timestampStr);

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        const daysAgo = Math.floor(
            (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysAgo === 0) {
            return 'Earlier today';
        } else if (daysAgo === 1) {
            return '1 day ago';
        } else {
            return `${daysAgo} days ago`;
        }
    }
}

  // onTabChange(index: number): void {
  //   this.selectedIndex = index;
  //   if (index === 0) {
  //     this.fetchAllBlogs();
  //   } else {
  //     this.fetchFollowedBlogs();
  //   }
  // }
}
