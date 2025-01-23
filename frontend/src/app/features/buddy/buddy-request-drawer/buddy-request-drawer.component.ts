import { ChangeDetectorRef, Component } from '@angular/core';
import { BuddyService } from 'src/app/core/services/api/buddy.service';
import { BuddyRequest } from 'src/app/interface/buddyProfile';
import { formatDistanceToNow } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-buddy-request-drawer',
  templateUrl: './buddy-request-drawer.component.html',
  styleUrls: ['./buddy-request-drawer.component.css'],
})
export class BuddyRequestDrawerComponent {
  // buddyRequests: BuddyRequest[] = [
  //   {
  //     id: 1,
  //     name: 'Testing Name',
  //     profilePhoto: 'http://localhost:8080/download/User/defaultProfilePicture.jpg',
  //     timestamp: new Date()
  //   },
  //   // Add more mock data as needed
  // ];

  buddyRequests: BuddyRequest[] = []; // Replace mock data with actual data
  buddyRequestsMade: BuddyRequest[] = [];

  constructor(
    private buddyService: BuddyService,
    private cdr: ChangeDetectorRef,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {
    // Load buddy requests
    this.getAllRequests();
    this.getAllReceivedRequests();
  }

  handleImageError(event: any) {
    event.target.src =
      'http://localhost:8080/download/User/defaultProfilePicture.jpg';
  }

  acceptRequest(requestId: number): void {
    console.log('Accepting request:', requestId);
    // Implement accept logic
    this.buddyService.approveBuddyRequestByRequestID(requestId).subscribe({
      next: (response) => {
        console.log('Request accepted:', response);
        this.getAllRequests();
        this.getAllReceivedRequests();
      },
      error: (error) => {
        console.error('Error accepting request:', error);
        if (error.status === 403 || error.status === 400) {
          this.nzMessageService.error(
            'You are only allowed to accept one person as your buddy'
          );
        }
      },
    });
  }

  rejectRequest(requestId: number): void {
    console.log('Rejecting request:', requestId);
    // Implement reject logic
    this.buddyService.rejectBuddyRequestByRequestID(requestId).subscribe({
      next: (response) => {
        console.log('Request rejected:', response);
        this.getAllRequests();
        this.getAllReceivedRequests();
      },
      error: (error) => console.error('Error rejecting request:', error),
    });
  }

  userId: string | null = localStorage.getItem('userId');

  getAllRequests(): void {
    // Implement get all requests logic
    this.buddyService.getAllRequests(Number(this.userId)).subscribe({
      next: (response) => {
        console.log('All requests:', response);
        this.buddyRequestsMade = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching all requests:', error),
    });
  }

  getAllReceivedRequests(): void {
    // Implement get all received requests logic
    this.buddyService.getAllRequestReceived(Number(this.userId)).subscribe({
      next: (response) => {
        this.buddyRequests = response;
        this.cdr.detectChanges();
      },
      error: (error) =>
        console.error('Error fetching received requests:', error),
    });
  }

  // formatDate(timestamp: number[]): string {
  //     // Adjust depending on how the timestamp array is structured
  //     const date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
  //     return formatDistanceToNow(date, { addSuffix: true });
  // }

  formatDate(timestamp: string): string {
    // Parse the ISO 8601 formatted timestamp directly
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Format the date to a human-readable string relative to the current time
    return formatDistanceToNow(date, { addSuffix: true });
  }

  deleteRequest(requestId: number): void {
    console.log('Deleting request:', requestId);
    // Implement delete request logic
    this.buddyService.deleteBuddyRequestByRequestID(requestId).subscribe({
      next: (response) => {
        console.log('Request deleted:', response);
        this.getAllRequests();
      },
      error: (error) => console.error('Error deleting request:', error),
    });
  }
}
