import { Component, OnInit } from '@angular/core';
import { EventService } from '../../event-service/event.service';
import { Event } from '../../models/event.model';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((data: Event[]) => {
      this.events = data.sort((a, b) => new Date(parseInt(a.endDate)).getTime() - new Date(parseInt(b.endDate)).getTime());
    });
  }
}
