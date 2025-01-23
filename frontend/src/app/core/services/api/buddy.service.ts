import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuddyService {
  private apiUrl = 'http://localhost:8080/api/buddyrequest';

  constructor(private http: HttpClient) {}

  getAllUserProfile(page: number = 0, size: number = 10) {
    return this.http.get<{
      data: any[];
      currentPage: number;
      totalPages: number;
      pageSize: number;
    }>(`${this.apiUrl}/getAllUserProfile2`, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }

  // approveBuddyRequest(requestID: number) {
  //   return this.http.post<any>(`${this.apiUrl}/requests/${requestID}/approve`, {});
  // }

  // getAllBuddyRequestById(userID: number) {
  //   return this.http.get<any[]>(`${this.apiUrl}/getAllBuddyRequestById/${userID}`);
  // }

  sendBuddyRequest(appUserId: string, receivedId: number) {
    return this.http.post<any>(`${this.apiUrl}/sendBuddyRequest`, null, {
      params: {
        appUserId: appUserId.toString(),
        receivedId: receivedId.toString(),
      },
    });
  }

  getAllUserProfileExceptMe(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUserProfileExceptMe/${userId}`);
  }

  approveBuddyRequestByRequestID(requestID: number) {
    return this.http.put<any>(
      `${this.apiUrl}/requests/${requestID}/approveByRequestID`,
      {}
    );
  }

  rejectBuddyRequestByRequestID(requestID: number) {
    return this.http.put<any>(
      `${this.apiUrl}/requests/${requestID}/rejectByRequestID`,
      {}
    );
  }

  getBuddyByUserID(userID: number) {
    return this.http.get<any[]>(`${this.apiUrl}/buddies/${userID}`);
  }

  getBuddyRequestStatus(userId: string, receivedId: number) {
    return this.http.get<string>(`${this.apiUrl}/requests/status`, {
      params: {
        userId: userId.toString(),
        receivedId: receivedId.toString(),
      },
    });
  }

  checkStatusOverall(userId: number) {
    return this.http.get<boolean>(
      `${this.apiUrl}/requests/checkStatusOverall/${userId}`
    );
  }

  getAllRequests(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/requests/${userId}`);
  }

  getAllRequestReceived(receivedId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/requests/received/${receivedId}`
    );
  }

  deleteBuddyRequestByRequestID(requestID: number) {
    return this.http.delete<any>(`${this.apiUrl}/requests/${requestID}`);
  }
}
