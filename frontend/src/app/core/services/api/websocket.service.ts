import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

export interface NoticeItem {
  notificationID: number;
  appUser: {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    profilePhoto: string;
  };
  type: string;
  referenceID: number;
  content: string;
  timestamp: Date;
  isRead: string;
  fromId: {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    profilePhoto: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Stomp.Client | null = null;
  private messageSource = new BehaviorSubject<NoticeItem[]>([]);

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  connect(userId: string, token: string): void {
    const serverUrl = `http://localhost:8080/ws?userId=${userId}&token=${token}`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.Stomp.over(ws);
    this.stompClient.connectHeaders = {
      login: userId,
      passcode: token,
    };
    this.stompClient.onConnect = (frame) => {
      this.stompClient?.subscribe(
        `/user/${userId}/queue/notifications`,
        (message) => {
          const newNotifications = JSON.parse(message.body);
          // Pass new notifications to the NotificationService
          this.notificationService.addNewNotifications(
            Array.isArray(newNotifications)
              ? newNotifications
              : [newNotifications]
          );
        }
      );
    };
    this.stompClient.onStompError = this.handleError;
    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  sendMessage(message: NoticeItem): void {
    if (this.stompClient) {
      this.stompClient.publish({
        destination: '/app/notify',
        body: JSON.stringify(message),
      });
    }
  }

  private updateNotifications(notifications: NoticeItem[]): void {
    this.messageSource.next([...this.messageSource.value, ...notifications]);
  }

  private handleError(error: any): void {
    console.error('Error in WebSocket connection:', error);
    // Implement reconnection logic or notify the user here
  }

  getNotifications(): Observable<NoticeItem[]> {
    return this.messageSource.asObservable();
  }

  directToProfile(userId: number): void {
    // Implement navigation logic here
    this.router.navigateByUrl('/default/profile/' + userId);
  }
}
