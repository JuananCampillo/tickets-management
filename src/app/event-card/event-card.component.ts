import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() image!: string;
  @Input() place!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() description!: string;

  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
