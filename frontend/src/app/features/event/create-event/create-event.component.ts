import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: NzMessageService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      userId: [
        window.localStorage.getItem('userId') || '',
        Validators.required,
      ],
      title: ['', Validators.required],
      date: ['', Validators.required],
      applyDueDate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      files: [null, Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      this.eventForm.get('files')!.setValue(files);
    }
  }

  submitForm(): void {
    if (this.eventForm.valid) {
      const formData = new FormData();
      const formValue = { ...this.eventForm.value };
      delete formValue.files; // Remove files from JSON serialization
      formData.append(
        'event',
        new Blob([JSON.stringify(formValue)], { type: 'application/json' })
      );

      // Append files to formData
      const files: FileList = this.eventForm.get('files')!.value;
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Update the URL to include the correct backend port
      this.http.post('http://localhost:8080/events', formData).subscribe({
        next: (response) => {
          console.log('Event created:', response);
          this.messageService.success('Event have been created successfully');
          this.router.navigate(['/default/events']);
        },
        error: (error) => console.error('Error:', error),
      });
    } else {
      Object.values(this.eventForm.controls).forEach(
        (control: AbstractControl) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      );
    }
  }
}
