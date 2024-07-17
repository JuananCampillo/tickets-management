import { Component, Input } from '@angular/core';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: Event;
  
  constructor(private datePipe: DatePipe) {}

  getFormattedDate(date: string): string | null {
    return this.datePipe.transform(new Date(parseInt(date)), 'dd/MM/yyyy');
  }
}
