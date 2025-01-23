import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:8080/api/password';

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot`, { email });
  }

  resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {
      email,
      code,
      newPassword,
    });
  }
}
