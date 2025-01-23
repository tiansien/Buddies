import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoticeItem } from 'src/app/interface/noti';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NoticeItem[]>([]);
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  loadInitialNotifications(userId: string): void {
    this.http.get<NoticeItem[]>(`${this.baseUrl}/${userId}`).subscribe({
      next: (notifications) => this.notificationsSubject.next(notifications),
      error: (error) => console.error('Failed to load notifications:', error),
    });
  }

  handleNotificationUpdates(newNotification: NoticeItem): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);
  }

  markAsRead(notificationID: number): void {
    const updatedNotifications = this.notificationsSubject.value.map(
      (notification) =>
        notification.notificationID === notificationID
          ? { ...notification, isRead: 'Y' }
          : notification
    );
    this.notificationsSubject.next(updatedNotifications);

    this.http.put(`${this.baseUrl}/${notificationID}/read`, {}).subscribe({
      next: () => console.log(`Notification ${notificationID} marked as read`),
      error: (error) =>
        console.error('Failed to mark notification as read:', error),
    });
  }

  // getNotifications() {
  //   return this.notificationsSubject.asObservable();
  // }

  addNewNotifications(newNotifications: NoticeItem[]): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [...currentNotifications, ...newNotifications];
    this.notificationsSubject.next(updatedNotifications);
  }

  getNotifications(): Observable<NoticeItem[]> {
    return this.notificationsSubject.asObservable();
  }
}
