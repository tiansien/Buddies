import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EventService } from 'src/app/core/services/api/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: number;
  existingImages: string[] = [];
  newFiles: File[] = [];
  loading = false;
  event: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // React to parameter changes
      this.eventId = +params['id'];
      this.initForm();
      this.loadEventDetails();
    });
  }

  initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      applyDueDate: ['', Validators.required],
    });
  }

  loadEventDetails(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event.data;
        const eventtemp = event.data;
        console.log('Event:', event);
        const eventDate = new Date(event.data.date);
        const localDate = eventDate.toISOString().slice(0, 10);
        console.log('Local Date:', localDate);
        const eventApplyDueDate = new Date(event.data.applyDueDate);
        console.log('Event Apply Due Date:', eventApplyDueDate);
        const localDueDate = eventApplyDueDate.toISOString().slice(0, 10);
        this.eventForm.patchValue({
          date: localDate,
        });

        this.eventForm.patchValue({
          title: eventtemp.title,
          date: localDate,
          applyDueDate: localDueDate,
          location: eventtemp.location,
          description: eventtemp.description,
          eventType: eventtemp.eventType,
        });

        this.existingImages = Array.isArray(eventtemp.eventPictureUrls)
          ? eventtemp.eventPictureUrls
          : (eventtemp.eventPictureUrls as string).split(',');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.messageService.error('Failed to load event details');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      this.newFiles = Array.from(files);
    }
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  submitForm(): void {
    if (this.eventForm.invalid) {
      this.messageService.error('Please fill all required fields');
      return;
    }

    if (this.existingImages.length === 0 && this.newFiles.length === 0) {
      this.messageService.error('Please include at least one image');
      return;
    }

    const formData = new FormData();

    // Append the event JSON part
    const eventDto = {
      eventId: this.eventId,
      title: this.eventForm.get('title')!.value,
      date: this.eventForm.get('date')!.value,
      location: this.eventForm.get('location')!.value,
      applyDueDate: this.eventForm.get('applyDueDate')!.value,
      description: this.eventForm.get('description')!.value,
      eventType: this.eventForm.get('eventType')!.value,
    };
    formData.append(
      'event',
      new Blob([JSON.stringify(eventDto)], { type: 'application/json' })
    );

    // Append files, if any
    this.newFiles.forEach((file) => {
      formData.append('files', file);
    });

    // Append existing images as JSON
    formData.append(
      'existingImages',
      new Blob([JSON.stringify(this.existingImages)], {
        type: 'application/json',
      })
    );

    this.loading = true;
    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.messageService.success('Event updated successfully');
        this.router.navigate(['/default/events']);
      },
      error: (error) => {
        this.messageService.error('Failed to update the event');
        console.error('Error updating event:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/default/events']);
  }
}
