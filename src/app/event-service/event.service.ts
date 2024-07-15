import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    console.log('getEvents')
    return this.http.get('/assets/events.json');
  }

  getEventInfo(id: number): Observable<any> {
    return this.http.get(`/assets/event-${id}.json`);
  }
}
