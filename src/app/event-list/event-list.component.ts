import { Component, OnInit } from '@angular/core';
import { EventService } from '../event-service/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((data: any[]) => {
      this.events = data.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    });
  }
}
