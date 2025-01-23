import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8080/api/likes';

  constructor(private http: HttpClient) { }

  // Blog
  getLikeStatus(userId: string, blogId: number) {
    return this.http.get<{count: string, likeByMe: string}>(`${this.apiUrl}/getcolandlikebyme/${userId}/blog/${blogId}`);
  }

  toggleLike(userId: string, blogId: number) {
    return this.http.post<any>(`${this.apiUrl}/${userId}/blog/${blogId}`, {});
  }

  // Event
  getEventLikeStatus(userId: string, eventId: number) {
    return this.http.get<{count: string, likeByMe: string}>(`${this.apiUrl}/getcolandlikebyme/${userId}/event/${eventId}`);
  }

  toggleEventLike(userId: string, eventId: number) {
    return this.http.post<any>(`${this.apiUrl}/${userId}/event/${eventId}`, {});
  }
}
