import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/comments';

  getAllComments(referenceId: string, type: string) {
    return this.http.get(`${this.apiUrl}?referenceId=${referenceId}&type=${type}`);
  }

  addComment(comment: any) {
    return this.http.post(this.apiUrl, comment);
  }

  getCommentWithProfile(referenceId: string, type: string) {
    return this.http.get(`${this.apiUrl}/withprofile?referenceId=${referenceId}&type=${type}`);
  }

  getTotalCommentCount(referenceId: number, type: string) {
    return this.http.get(`${this.apiUrl}/count?referenceId=${referenceId}&type=${type}`);
  }

}
