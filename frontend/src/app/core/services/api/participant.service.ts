import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participation } from 'src/app/interface/participant';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private apiUrl = 'http://localhost:8080/api/events/participants';

  constructor(private http: HttpClient) {}

  getAllParticipantsByEventId(eventId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}?eventId=${eventId}`);
  }

  getAllParticipants(): Observable<any> {
    return this.http.get<Participation[]>(`${this.apiUrl}/all`);
  }

  addParticipant(
    id: number,
    eventId: number,
    participation: Participation
  ): Observable<Participation> {
    const url = `${this.apiUrl}/add?id=${id}&eventId=${eventId}`;
    return this.http.put<Participation>(url, participation);
  }

  participantsStatus(
    eventId: number,
    userId: number
  ): Observable<Participation> {
    const url = `${this.apiUrl}/${eventId}/${userId}`;
    return this.http.get<Participation>(url);
  }

  approveParticipant(participationId: number): Observable<Participation> {
    const url = `${this.apiUrl}/${participationId}/approve`;
    return this.http.put<Participation>(url, {});
  }

  rejectParticipant(participationId: number): Observable<Participation> {
    const url = `${this.apiUrl}/${participationId}/reject`;
    return this.http.put<Participation>(url, {});
  }

  updateParticipantStatus(
    participantId: number,
    status: string
  ): Observable<any> {
    if (status === 'approved') {
      return this.approveParticipant(participantId);
    }
    if (status === 'rejected') {
      return this.rejectParticipant(participantId);
    }
    return new Observable<any>((observer) => {
      observer.error(new Error('Invalid status'));
    });
  }

  getAllRequestParticipantsByUserId(
    userId: number
  ): Observable<Participation[]> {
    const url = `${this.apiUrl}/requests/${userId}`;
    return this.http.get<Participation[]>(url);
  }

  rejectParticipantWithReason(
    participationId: number,
    rejectReason: string
  ): Observable<Participation> {
    const url = `${this.apiUrl}/${participationId}/rejectWithReason`;
    return this.http.put<Participation>(url, rejectReason);
  }
}
