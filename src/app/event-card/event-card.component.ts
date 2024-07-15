import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() image!: string;
  @Input() place!: string;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() description!: string;
}
