import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AxiosService } from 'src/app/core/axios/axios.service';
import { NotificationService } from 'src/app/core/services/api/notification.service';
import { ProfileService } from 'src/app/core/services/api/profile.service';
import { NoticeItem } from 'src/app/interface/noti';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeadRightMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  totalUnreadCount$: Observable<number>;

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.totalUnreadCount$ = this.notificationService.getNotifications().pipe(
      map(
        (notifications : NoticeItem[]) => notifications.filter((n) => n.isRead === 'N').length
      ),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private id = localStorage.getItem('userId') || '';

  goPage(path: string): void {
    this.router.navigateByUrl(`/`);
  }

  logout(): void {
    console.log('layout');
    this.axiosService.setAuthToken('');
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }

  profilePage(): void {
    console.log('Profile page');

    // this.router.navigateByUrl('/default/profile/' + this.id);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/default/profile/', this.id]);
    });
  }

  ngOnInit(): void {
    this.getProfileUser();
  }

  user: any = [];
  userProfile: any = [];
  userProfilePhoto: string = '';

  getProfileUser(): void {
    this.profileService.getUserAndProfileById(this.id).subscribe((data) => {
      console.log('User and profile data:', data);
      this.user = data[0];
      this.userProfile = data[1];
      this.userProfilePhoto = this.user.profilePhoto;
      console.log('User:', this.user);
      console.log('Profile:', this.userProfile);
      console.log('Picture URL:', this.user.profilePhoto);

      this.cdr.detectChanges();
    });
  }
}
