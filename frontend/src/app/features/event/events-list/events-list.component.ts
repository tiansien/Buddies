import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppEvent } from '../../../interface/eventModal';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ParticipantService } from 'src/app/core/services/api/participant.service';
import { Participation } from 'src/app/interface/participant';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
})
export class EventsListComponent implements OnInit {
  events: AppEvent[] = [];
  filteredEvents: AppEvent[] = [];
  loading = false;
  hasError = false;
  searchTerm = '';
  filterDate: Date | null = null;
  role = localStorage.getItem('role') ;

  drawerVisible = false;

  constructor(
    private participantService: ParticipantService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchParticipations();
  }

  private fetchEvents(): void {
    this.loading = true;
    this.hasError = false;

    this.http.get<AppEvent[]>('http://localhost:8080/events').subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.events = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => {
        console.error('There was an error fetching events:', error);
        this.hasError = true;
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
    });
  }

  applyFilters(): void {
    let tempEvents = this.events;
    if (this.searchTerm) {
      tempEvents = tempEvents.filter((event) =>
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.filterDate) {
      tempEvents = tempEvents.filter(
        (event) =>
          new Date(event.date).toDateString() ===
          this.filterDate?.toDateString()
      );
    }
    this.filteredEvents = tempEvents;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(date: string): void {
    this.filterDate = date ? new Date(date) : null;
    this.applyFilters();
  }

  redirectToEventDetails(id: number): void {
    this.route.navigateByUrl(`/default/events/detail/${id}`);
  }

  participations: Participation[] = [];

  fetchParticipations(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.participantService
        .getAllRequestParticipantsByUserId(Number(userId))
        .subscribe({
          next: (data) => {
            this.participations = data;
            console.log('Participations fetched:', this.participations); // Log the fetched data
            this.cdr.detectChanges(); // Ensure UI updates with new data
          },
          error: (error) => {
            console.error('Error fetching participations:', error);
            this.cdr.detectChanges(); // Ensure UI updates to reflect error state if needed
          },
        });
    }
  }
}
