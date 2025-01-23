import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Participation } from 'src/app/interface/participant';

@Component({
  selector: 'app-participation-request-drawer',
  templateUrl: './participation-request-drawer.component.html',
  styleUrls: ['./participation-request-drawer.component.css'],
})
export class ParticipationRequestDrawerComponent implements OnInit {
  @Input() participations: Participation[] = [];
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  // visible = false;

  approvedRequests: Participation[] = [];
  pendingRequests: Participation[] = [];
  rejectedRequests: Participation[] = [];

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.groupRequests();
  }

  onClose(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnChanges() {
    if (this.participations) {
      this.groupRequests();
    }
  }

  private groupRequests() {
    if (!this.participations) {
      console.warn('No participations available');
      return;
    }

    console.log('Grouping requests:', this.participations);

    this.approvedRequests = this.participations.filter(
      (p) => p.status?.toLowerCase() === 'approved'
    );
    this.pendingRequests = this.participations.filter(
      (p) => p.status?.toLowerCase() === 'pending'
    );
    this.rejectedRequests = this.participations.filter(
      (p) => p.status?.toLowerCase() === 'rejected'
    );

    // Force change detection
    this.cdr.detectChanges();

    console.log('Groups:', {
      approved: this.approvedRequests.length,
      pending: this.pendingRequests.length,
      rejected: this.rejectedRequests.length,
    });
  }

  openDrawer(): void {
    this.visible = true;
    this.cdr.detectChanges();
    // this.visibleChange.emit(this.visible);
  }

  closeDrawer(): void {
    this.visible = false;
  }

  openEventDetails(participation: Participation): void {
    this.router.navigateByUrl(
      `/default/events/detail/${participation.event?.eventId}`
    );
  }
}
