import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private apiUrl = 'http://localhost:8080/api/userfollow';

  constructor(private http: HttpClient) { }
  
  checkingFollow(followerID: number, followingID: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkingFollow`, null, {
      params: {
        followerID: followerID.toString(),
        followingID: followingID.toString()
      }
    });
  }

  isFollowing(followerID: number, followingID: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/isFollowing`, {
      params: {
        followerID: followerID.toString(),
        followingID: followingID.toString()
      }
    });
  }

  getAllFollows(followerID: number): Observable<[]> {
    return this.http.get<[]>(`${this.apiUrl}/getAllFollows/${followerID}`);
  }

  getAllFollowings(followingID: number): Observable<[]> {
    return this.http.get<[]>(`${this.apiUrl}/getAllFollowings/${followingID}`);
  }

  countFollowing(followerID: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countFollowing/${followerID}`);
  }

  countFollower(followingID: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countFollower/${followingID}`);
  }

  getFollowingAndFollower(id: number): Observable<{ following: number, follower: number }> {
    return this.http.get<{ following: number, follower: number }>(`${this.apiUrl}/getFollowingAndFollower/${id}`);
  }
}
