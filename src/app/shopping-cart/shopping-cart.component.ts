import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Session {
  date: string;
  selected: number;
}

interface Event { id: string, title: string, sessions: { date: string, selected: number }[] };
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  @Input() events: Event[] = [];
  @Output() remove = new EventEmitter<{session: Session, eventTitle: string}>();

  onRemove(session: Session, eventTitle: string ) {
    this.remove.emit({session, eventTitle});
  }

  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
