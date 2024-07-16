import { Component, Input } from '@angular/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: Event;

  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
