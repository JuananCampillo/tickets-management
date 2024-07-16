import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Event, EventInfo } from '../models/event.model';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/assets/events.json');
  }

  getEventInfo(id: string): Observable<EventInfo | string> {
    return this.http.get<EventInfo>(`/assets/event-info-${id}.json`).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return of("EVENT INFO NOT FOUND");
  }
}
