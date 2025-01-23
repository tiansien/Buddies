import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { th } from 'date-fns/locale';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { ParticipantService } from 'src/app/core/services/api/participant.service';

interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  profilePhoto: string;
  role: string;
}

interface Event {
  eventId: number;
  title: string;
  date: number;
  location: string;
  eventType: string;
}

interface Participant {
  participationID: number;
  appUser: AppUser;
  event: Event;
  role: string;
  status: string;
  applyReason: string;
}

interface TableItem {
  key: number;
  user: AppUser;
  event: Event;
  role: string;
  status: string;
  applyReason: string;
  isLoading?: boolean; // Add this line
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<TableItem> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<TableItem> | null;
}


@Component({
  selector: 'app-paticipant-managment',
  templateUrl: './paticipant-managment.component.html',
  styleUrls: ['./paticipant-managment.component.css'],
})
export class PaticipantManagmentComponent implements OnInit {
  participants: TableItem[] = [];
  allParticipants: TableItem[] = []; // Store the complete dataset
  searchValue = '';
  visible = false;
  loading = true;

  listOfColumns: ColumnItem[] = [];

  constructor(
    private participantService: ParticipantService,
    private message: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.loading = true;
    this.participantService.getAllParticipants().subscribe({
      next: (response: Participant[]) => {
        const mappedData = response.map((p) => ({
          key: p.participationID,
          user: p.appUser,
          event: p.event,
          role: p.role,
          status: p.status,
          applyReason: p.applyReason,
        }));
        this.allParticipants = [...mappedData]; // Store complete dataset
        this.participants = [...mappedData]; // Working copy

        this.initializeColumns();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading participants:', error);
        this.message.error('Failed to load participants');
        this.loading = false;
      },
    });
  }

  initializeColumns(): void {
    const eventFilters: NzTableFilterList = this.allParticipants
      .map((item) => item.event.title)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((title) => ({ text: title, value: title }));

    this.listOfColumns = [
      {
        name: 'Event',
        sortOrder: null,
        sortFn: (a: TableItem, b: TableItem) =>
          a.event.title.localeCompare(b.event.title),
        listOfFilter: eventFilters,
        filterFn: (list: string[], item: TableItem) =>
          list.includes(item.event.title),
      },
      {
        name: 'Role',
        sortOrder: null,
        sortFn: (a: TableItem, b: TableItem) => a.role.localeCompare(b.role),
        listOfFilter: [
          { text: 'Attendee', value: 'Attendee' },
          { text: 'Speaker', value: 'Speaker' },
          { text: 'Organizer', value: 'Organizer' },
          { text: 'Volunteer', value: 'Volunteer' },
        ],
        filterFn: (list: string[], item: TableItem) =>
          list.some((role) => item.role.includes(role)),
      },
      {
        name: 'Status',
        sortOrder: null,
        sortFn: (a: TableItem, b: TableItem) =>
          a.status.localeCompare(b.status),
        listOfFilter: [
          { text: 'Pending', value: 'pending' },
          { text: 'Approved', value: 'approved' },
          { text: 'Rejected', value: 'rejected' },
        ],
        filterFn: (list: string[], item: TableItem) =>
          list.some((status) => item.status.includes(status)),
      },
    ];
  }

  updateStatus(participant: TableItem, status: 'approved' | 'rejected'): void {
    participant.isLoading = true; // Start loading
    this.cdr.detectChanges(); // Update the view

    this.participantService
      .updateParticipantStatus(participant.key, status)
      .subscribe({
        next: () => {
          this.message.success(`Request ${status} successfully`);
          participant.status = status;
          participant.isLoading = false; // Stop loading
          this.loadParticipants(); // Optional: Reload the full list after update
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.message.error('Failed to update status');
          participant.isLoading = false; // Stop loading on error
        },
        complete: () => {
          this.cdr.detectChanges(); // Ensure the view is updated
        },
      });
  }

  navigateToProfile(userId: number): void {
    this.router.navigate(['/default/profile', userId]);
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['/default/events/detail', eventId]);
  }

  reset(): void {
    this.searchValue = '';
    this.participants = [...this.allParticipants]; // Reset to complete dataset
    this.cdr.detectChanges();
  }

  search(): void {
    this.visible = false;
    if (!this.searchValue) {
      this.participants = [...this.allParticipants];
    } else {
      const searchTerm = this.searchValue.toLowerCase();
      this.participants = this.allParticipants.filter(
        (item: TableItem) =>
          item.event.title.toLowerCase().includes(searchTerm) ||
          item.user.login.toLowerCase().includes(searchTerm) ||
          item.user.email.toLowerCase().includes(searchTerm)
      );
    }
    this.cdr.detectChanges();
  }

  // Optional: Method to handle page size changes
  onPageSizeChange(size: number): void {
    this.participants = [...this.participants];
    this.cdr.detectChanges();
  }

  // Optional: Method to handle table refresh
  refreshTable(): void {
    this.loadParticipants();
  }

  isRejectModalVisible = false;
  rejectReason:string = '';
  selectedParticipant: TableItem | null = null;

  showRejectModal(participant: TableItem): void {
    this.selectedParticipant = participant;
    this.isRejectModalVisible = true;
    this.rejectReason = '';
  }

  handleRejectCancel(): void {
    this.isRejectModalVisible = false;
    this.rejectReason = '';
    this.selectedParticipant = null;
  }

  handleRejectOk(): void {
    if (!this.selectedParticipant || !this.rejectReason.trim()) {
      this.message.error('Please provide a reason for rejection');
      return;
    }

    this.selectedParticipant.isLoading = true;
    this.cdr.detectChanges();

    this.participantService
      .rejectParticipantWithReason(
        this.selectedParticipant.key,
        this.rejectReason
      )
      .subscribe({
        next: () => {
          this.message.success('Request rejected successfully');
          this.selectedParticipant!.status = 'rejected';
          this.loadParticipants();
          this.isRejectModalVisible = false;
          this.rejectReason = '';
          this.selectedParticipant = null;
        },
        error: (error) => {
          console.error('Error rejecting participant:', error);
          this.message.error('Failed to reject participant');
          if (this.selectedParticipant) {
            this.selectedParticipant.isLoading = false;
          }
        },
        complete: () => {
          this.cdr.detectChanges();
        },
      });
  }
}
