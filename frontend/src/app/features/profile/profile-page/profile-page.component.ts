import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BlogService } from 'src/app/core/services/api/blog.service';
import { FollowService } from 'src/app/core/services/api/follow.service';
import { ProfileService } from 'src/app/core/services/api/profile.service';
import { UserService } from 'src/app/core/services/store/user/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  allBlogs: any[] = [];

  userBlogs: any[] = [];
  userProfile: any;
  user: any;
  isMyProfile = false;
  isFollowed = false;
  userId: string | null = null;

  following: number = 0;
  follower: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private followService: FollowService,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.checkUserProfile(userId);
      this.fetchAllBlogs(userId);
      this.checkUserProfile(userId);
    }
  }

  getAllBlogsTest(userId?: string | null): Observable<any> {
    if (userId) {
      return this.blogService.getAllBlogWithProfileUser(userId).pipe(
        map((response) => response as any) // Adjust the response type as needed
      );
    } else {
      return new Observable<any>(); // Return an empty observable if userId is not provided
    }
  }

  private fetchAllBlogs(userId: string | null): void {
    this.getAllBlogsTest(userId).subscribe((data) => {
      if (data.length > 0) {
        this.userBlogs = data[0].blog; // Assuming the first entry is the relevant one
        this.userProfile = data[0].profile[0];
        this.user = data[0].user[0];
      }

      console.log('User Blogs:', data);

      this.allBlogs = data[0].blog.map(
        (item: any) => ({
          id: item.blogID,
          title: item.postTitle || 'No Title',
          description: item.postDescription,
          category: item.postDescription2,
          imageUrl: item.postPicturePath
            ? `http://localhost:8080/download/Blog/${
                item.postPicturePath.split(',')[0]
              }` // Use first image in postPicturePath
            : null,
          profilePictureUrl: null,
          postingAuthor: `${item.appUser.login}`,
          postingDate: this.formatDateDynamic(item.timestamp), // Adjust date formatting as needed
          likes: 0, // Placeholder if likes data is unavailable
          comments: 0, // Placeholder if comments data is unavailable
          authorId: item.appUser.id,
        }),
        this.getFollowStatus(),
        this.getBuddiesInformation()
      );
    });
  }

  private checkUserProfile(userId: string | null): void {
    const myUserId = localStorage.getItem('userId'); // This should be dynamically obtained probably from a user service
    this.isMyProfile = userId === myUserId;
  }

  redirectToEditPage(): void {
    this.router.navigateByUrl('default/profile/edit');
  }

  formatDateDynamic(timestamp: number[]): string {
    if (!timestamp || timestamp.length < 7) return 'Invalid Date';

    const [year, month, day, hour, minute, second, nanoseconds] = timestamp;

    // Convert timestamp array into a Date object
    const milliseconds = Math.floor(nanoseconds / 1_000_000);
    const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      milliseconds
    );

    // Get today's date and reset time to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date and reset time to midnight
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Get the difference in days
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Format date based on difference
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const daysAgo = Math.floor(
        (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${daysAgo} days ago`;
    }
  }

  followUser() {
    console.log('Follow user', this.userId, this.userProfile.id);
    if (this.userId) {
      this.followService
        .checkingFollow(Number(this.userId), this.userProfile.id)
        .subscribe((next) => {
          this.getFollowStatus();
          this.followingFollwerCount();
        });
    }
  }

  getFollowStatus(): void {
    console.log('Get follow status');
    console.log('User ID:', this.userId);
    console.log('Profile ID:', this.userProfile.id);
    this.followService
      .isFollowing(Number(this.userId), this.userProfile.id)
      .subscribe((response) => {
        this.isFollowed = response;
        console.log('Is Followed:', this.isFollowed);
        this.followingFollwerCount();
        this.cdr.detectChanges();
      });
  }

  messageUser(): void {
    // Implement message user logic here
    console.log('Message user', this.userProfile.id);
    this.router.navigateByUrl('/default/message/' + this.userProfile.id);
  }

  followingFollwerCount() {
    this.followService
      .getFollowingAndFollower(Number(this.userProfile.id))
      .subscribe((response) => {
        this.following = response.following;
        this.follower = response.follower;
        this.cdr.detectChanges();
      });
  }

  buddyUser: any;
  buddyProfile: any;

  getBuddiesInformation() {
    if (this.user.buddy) {
      console.log('Buddies:', this.user.buddy);
      this.profileService
        .getUserAndProfileById(this.user.buddy)
        .subscribe((data) => {
          this.buddyUser = data[0];
          this.buddyProfile = data[1];
          console.log('Buddy:', this.buddyUser);
          console.log('Buddy:', this.buddyProfile);
        });
    }
  }

  redirectToBuddyProfile(id: number) {
    // console.log('Redirect to buddy profile:', id);
    // this.router.navigateByUrl('/default/profile/' + id);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/default/profile/', id]);
    });
  }
}
