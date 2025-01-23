import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ProfileService } from 'src/app/core/services/api/profile.service';

@Component({
  selector: 'app-landing-edit',
  templateUrl: './landing-edit.component.html',
  styleUrls: ['./landing-edit.component.css'],
})
export class LandingEditComponent {
  @Output() profileUpdated = new EventEmitter<void>();
  user: any = {};
  profile: any = {};
  selectedFile: File | null = null;
  profilePicturePreview: string | ArrayBuffer | null = null;
  loading = true;
  uploading = false;
  defaultProfilePicture =
    'http://localhost:8080/download/user/defaultProfilePicture.jpg';

  faculties = [
    {
      label: 'Faculty of Computer Science & Information Technology',
      value: 'Faculty of Computer Science & Information Technology',
    },
  ];

  programs = [
    { label: 'Software Engineering', value: 'Software Engineering' },
    { label: 'Information System', value: 'Information System' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
    { label: 'Multimedia', value: 'Multimedia' },
    {
      label: 'Computer System and Network',
      value: 'Computer System and Network',
    },
  ];

  yearsOfStudy = [
    { label: 'First Year', value: 'First Year' },
    { label: 'Second Year', value: 'Second Year' },
    { label: 'Third Year', value: 'Third Year' },
    { label: 'Fourth Year', value: 'Fourth Year' },
  ];

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const id = window.localStorage.getItem('userId') || '';
    this.getUserAndProfileById(id);
  }

  getUserAndProfileById(userId: string): void {
    this.profileService.getUserAndProfileById(userId).subscribe({
      next: (data) => {
        this.user = data[0];
        this.profile = data[1] || {};
        this.user.profilePhoto =
          'http://localhost:8080/download/user/defaultProfilePicture.jpg';
        this.profilePicturePreview =
          this.user.profilePhoto || this.defaultProfilePicture;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user and profile data:', error);
        this.message.error('Failed to load profile data');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('You can only upload JPG/PNG files!');
      return false;
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must be smaller than 2MB!');
      return false;
    }

    this.selectedFile = file as any;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profilePicturePreview = e.target?.result ?? null;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file as any);
    return false;
  };

  deleteProfilePicture(): void {
    this.selectedFile = null;
    this.profilePicturePreview = this.defaultProfilePicture;
    this.user.profilePhoto = this.defaultProfilePicture;
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    if (this.uploading) return;
    this.uploading = true;

    const profileDto = {
      bio: this.profile.bio,
      fac: this.profile.fac,
      program: this.profile.program,
      yearOfStudy: this.profile.yearOfStudy,
    };

    const userDto = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
    };

    const id = window.localStorage.getItem('userId') || '';

    if (
      !this.selectedFile &&
      this.profilePicturePreview === this.defaultProfilePicture
    ) {
      fetch(this.defaultProfilePicture)
        .then((res) => res.blob())
        .then((blob) => {
          const defaultImageFile = new File(
            [blob],
            'defaultProfilePicture.jpg',
            { type: 'image/jpeg' }
          );
          return this.profileService
            .updateProfileAndUser(id, profileDto, userDto, defaultImageFile)
            .toPromise();
        })
        .then(() => {
          this.message.success('Profile Updated Successfully!');
          this.profileUpdated.emit(); // Emit the event when the profile is updated
          // this.profileUpdated.emit(); // Emit the event when the profile is updated
          this.router.navigateByUrl('/default/events').then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          this.message.error('Failed to update profile');
        })
        .finally(() => {
          this.uploading = false;
          this.cdr.detectChanges();
        });
    } else {
      const saveOperation = this.selectedFile
        ? this.profileService.updateProfileAndUser(
            id,
            profileDto,
            userDto,
            this.selectedFile
          )
        : this.profileService.updateProfileAndUser(id, profileDto, userDto);

      saveOperation.subscribe({
        next: () => {
          this.message.success('Profile Updated Successfully!');
          this.profileUpdated.emit(); // Emit the event when the profile is updated
            this.router.navigateByUrl('/default/events').then(() => {
            window.location.reload();
            });
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.message.error('Failed to update profile');
        },
        complete: () => {
          this.uploading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
