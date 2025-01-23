import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  getUserAndProfileById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserAndProfileById/${id}`);
  }

  updateProfileAndUser(id: string, profileDto: any, userDto: any, profilePicture?: File): Observable<any> {
    const formData = new FormData();

    // Convert to Blob and append with proper content type
    formData.append('profileDto', new Blob([JSON.stringify(profileDto)], { type: 'application/json' }));
    formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    return this.http.put(`${this.apiUrl}/updateProfileAndUser/${id}/profilePicture`, formData);
  }
  
  getHaveUserProfile(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/getUserProfile/${id}`);
  }
}
