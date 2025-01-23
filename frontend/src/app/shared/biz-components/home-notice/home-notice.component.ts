import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/api/notification.service';
import { WebsocketService } from 'src/app/core/services/api/websocket.service';
import { NoticeItem } from 'src/app/interface/noti';

@Component({
  selector: 'app-home-notice',
  templateUrl: './home-notice.component.html',
  styleUrls: ['./home-notice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeNoticeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications$!: Observable<NoticeItem[]>;
  messages$!: Observable<NoticeItem[]>;

  userId: string = localStorage.getItem('userId') || '';
  token: string = localStorage.getItem('auth_token') || '';

  constructor(
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.notificationService.loadInitialNotifications(this.userId);
      this.websocketService.connect(this.userId, this.token); // Just connect, don't subscribe here
    }
    this.initializeNotifications();
  }

  // private initializeWebSocket() {
  //   this.websocketService
  //     .connect(this.userId, this.token)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (updates: NoticeItem[]) => {
  //         updates.forEach((update) =>
  //           this.notificationService.handleNotificationUpdates(update)
  //         );
  //       },
  //       error: (error) => console.error('WebSocket error:', error),
  //     });
  // }

  private initializeNotifications(): void {
    this.notifications$ = this.notificationService.getNotifications().pipe(
      map((items) =>
        items
          .filter((item) => item.type !== 'MESSAGE')
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
      ),
      takeUntil(this.destroy$)
    );

    this.messages$ = this.notificationService.getNotifications().pipe(
      map((items) =>
        items
          .filter((item) => item.type === 'MESSAGE')
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
      ),
      takeUntil(this.destroy$)
    );
  }

  getTimeDisplay(timestamp: Date): string {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 60000
    );

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      // less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInMinutes < 10080) {
      // less than 7 days
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return notificationDate.toLocaleDateString();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }

  // getTimeDisplay(timestamp: Date): string {
  //   return new Date(timestamp).toLocaleString();
  // }

  // markAsRead(notificationID: number): void {
  //   this.notificationService.markAsRead(notificationID);
  // }

  markAsRead(item: NoticeItem): void {
    this.directToBlogOrPostOrMessage(item, item.type, item.referenceID);
    this.notificationService.markAsRead(item.notificationID);
  }

  getNotificationCount(notifications: NoticeItem[] | null): number {
    return notifications?.filter((n) => n.isRead === 'N').length ?? 0;
  }

  getMessageCount(messages: NoticeItem[] | null): number {
    return messages?.filter((m) => m.isRead === 'N').length ?? 0;
  }

  getDisplayContent(item: NoticeItem): string {
    switch (item.type) {
      case 'LIKE':
        return 'liked your post';
      case 'LIKE BLOG':
        return 'liked your blog';
      case 'LIKE EVENT':
        return 'liked your event';
      case 'COMMENT':
        return 'commented on your post';
      case 'COMMENT BLOG':
        return 'commented on your post';
      case 'COMMENT EVENT':
        return 'commented on your event';
      case 'MESSAGE':
        return 'sent you a message';
      case 'APPROVE':
        return 'approved your request';
      case 'REJECT':
        return 'rejected your request';
      default:
        return item.content;
    }
  }

  directToProfile(userId: number): void {
    // this.websocketService.directToProfile(userId);
    this.router.navigateByUrl('/default/profile/' + userId);
  }

  directToBlogOrPostOrMessage(
    item: NoticeItem,
    type: string,
    referenceID: number
  ): void {
    // Implement navigation logic here
    console.log('Navigating to:', type, referenceID);
    const currentUrl = this.router.url;
    if (type === 'MESSAGE') {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/default/message/', item.fromId.id]);
      });
    } else if (type === 'COMMENT BLOG' || type === 'LIKE BLOG') {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/default/blog/detail/', referenceID]);
      });
    } else if (type === 'COMMENT EVENT' || type === 'LIKE EVENT') {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/default/events/detail/', referenceID]);
      });
    } else if (type === 'APPROVE' || type === 'REJECT') {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/default/events/detail/', referenceID]);
      });
    }
  }
}
