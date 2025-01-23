import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosService } from 'src/app/core/axios/axios.service';
import { AppEvent } from 'src/app/interface/eventModal';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private axiosService: AxiosService, private http: HttpClient) {}

  getEventById(id: number): Observable<AppEvent> {
    // Using `from` to convert Axios Promise to Observable
    return from(
      this.axiosService.request('get', `${this.apiUrl}/${id}`, null)
    ).pipe(
      catchError((error) => {
        console.error('Error occurred while fetching event by ID:', error);
        return throwError(() => new Error('Error fetching event by ID'));
      })
    );
  }

  getEventByEventId(eventId: string): Observable<AppEvent> {
    return this.http.get<AppEvent>(`${this.apiUrl}/${eventId}`);
  }

  // createEvent(eventData: FormData): Observable<AppEvent> {
  //   return from(this.axiosService.request('post', this.apiUrl, eventData)).pipe(
  //     catchError(error => {
  //       console.error('Error occurred while creating an event:', error);
  //       return throwError(() => new Error('Error creating an event'));
  //     })
  //   );
  // }

  getEvents(): Observable<AppEvent[]> {
    return from(this.axiosService.request('get', this.apiUrl, null)).pipe(
      catchError((error) => {
        console.error('Error occurred while fetching events:', error);
        return throwError(() => new Error('Error fetching events'));
      })
    );
  }

  updateEvent(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }
}
