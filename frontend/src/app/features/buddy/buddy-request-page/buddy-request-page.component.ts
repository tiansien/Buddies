import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { BuddyService } from 'src/app/core/services/api/buddy.service';
import { BuddyProfile } from 'src/app/interface/buddyProfile';
import { BuddyRequestDrawerComponent } from '../buddy-request-drawer/buddy-request-drawer.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buddy-request-page',
  templateUrl: './buddy-request-page.component.html',
  styleUrls: ['./buddy-request-page.component.css'],
})
export class BuddyRequestPageComponent {
  buddies: BuddyProfile[] = [];
  currentPage = 0;
  totalPages = 0;
  isLoading = false;
  pageSize = 10;
  hasMoreData = true; // New flag to track if more data is available

  userId: string | null = localStorage.getItem('userId');

  searchTerm: string = '';
  filterYear: string = '';
  filterProgram: string = '';

  constructor(
    private buddyService: BuddyService,
    private cdr: ChangeDetectorRef,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBuddies();
    this.getAllReceivedRequests();
  }

  statusForButton: boolean = false;

  loadBuddies() {
    this.isLoading = true;
    this.buddies = []; // Clear existing buddies
    this.cdr.detectChanges();

    this.buddyService.getAllUserProfileExceptMe(Number(this.userId)).subscribe({
      next: (response) => {
        // Filter by search term and year
        this.buddies = response.filter((buddy) => {
          this.buddyService.checkStatusOverall(Number(this.userId)).subscribe({
            next: (response) => {
              this.statusForButton = response;
              console.log('Status for button:', this.statusForButton);
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error checking overall status:', error);
            },
          });

            return (
            (!this.searchTerm ||
              `${buddy.user.firstName} ${buddy.user.lastName} ${buddy.user.login}`
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())) &&
              (!this.filterYear || buddy.profile.yearOfStudy === this.filterYear) &&
              (!this.filterProgram || buddy.profile.program === this.filterProgram)
            );
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading buddies:', error);
        this.isLoading = false;
        this.hasMoreData = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters() {
    this.loadBuddies();
  }

  handleImageError(event: any) {
    event.target.src =
      'http://localhost:8080/download/User/defaultProfilePicture.jpg';
  }

  sendBuddyRequest(id: number, name: string) {
    if (this.userId) {
      // Show confirmation modal
      this.modalService.confirm({
        nzTitle: 'Are you sure?',
        nzContent:
          'Do you want to send a buddy request to <b>' + name + '</b> user?',
        nzOnOk: () => {
          console.log('Sending buddy request to user:', id);
          if (this.userId) {
            // Proceed with sending the buddy request
            this.buddyService.sendBuddyRequest(this.userId, id).subscribe({
              next: (response) => {
                console.log('Buddy request sent:', response);
                this.loadBuddies();
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error('Error sending buddy request:', error);
              },
            });
          }
        },
        nzOnCancel: () => {
          console.log('Buddy request canceled');
        },
      });
    }
  }

  openBuddyRequestDrawer(): void {
    const drawerRef = this.drawerService.create({
      nzContent: BuddyRequestDrawerComponent,
      nzPlacement: 'right',
      nzWidth: 400,
      nzClosable: true,
      nzMaskClosable: true,
    });

    drawerRef.afterClose.subscribe(() => {
      this.loadBuddies();
      this.getAllReceivedRequests();
    });
  }

  buddyRequests: any[] = [];

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

  redirectToProfile(id: number) {
    // Redirect to buddy profile page
    console.log('Redirecting to buddy profile:', id);
    this.router.navigate(['/default/profile/', id]);
  }
}
