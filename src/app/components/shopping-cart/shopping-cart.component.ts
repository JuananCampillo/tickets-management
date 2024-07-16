import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Session } from '../../models/session.model';
import { EventSelected } from '../../models/event.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  @Input() events: EventSelected[] = [];
  @Output() remove = new EventEmitter<{session: Session, eventTitle: string}>();

  onRemove(session: Session, eventTitle: string ) {
    this.remove.emit({session, eventTitle});
  }

  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
